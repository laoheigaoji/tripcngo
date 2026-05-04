import { Hono } from "hono";
import { serveStatic } from "hono/cloudflare-workers";
import { mongoose } from "mongoose";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import crypto from "crypto";
import nodemailer from "nodemailer";

type Bindings = {
  MONGODB_URI: string;
  GMAIL_USER: string;
  GMAIL_APP_PASSWORD: string;
  R2_ENDPOINT: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_BUCKET: string;
  R2_PUBLIC_URL: string;
  DEEPSEEK_API_KEY: string;
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// ========== 1. 全局初始化 ==========
let mongoConn: typeof mongoose | null = null;

// 连接 MongoDB（Workers 环境用短连接，每次请求复用）
async function getMongo(c: any) {
  if (!mongoConn) {
    mongoConn = await mongoose.connect(c.env.MONGODB_URI);
  }
  return mongoConn;
}

// Feedback 邮件发送
function createTransporter(c: any) {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: c.env.GMAIL_USER,
      pass: c.env.GMAIL_APP_PASSWORD,
    },
  });
}

// R2 客户端
function getS3Client(c: any) {
  return new S3Client({
    region: "auto",
    endpoint: c.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: c.env.R2_ACCESS_KEY_ID,
      secretAccessKey: c.env.R2_SECRET_ACCESS_KEY,
    },
  });
}

// ========== 2. Mongoose Schema & Model ==========
const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleEn: { type: String, default: "" },
  subtitle: String,
  subtitleEn: { type: String, default: "" },
  content: { type: String, required: true },
  contentEn: { type: String, default: "" },
  thumbnail: String,
  category: { type: String, default: "General" },
  author: { type: String, default: "Miracle" },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

let Article: ReturnType<typeof mongoose.model>;

async function getArticleModel() {
  if (!Article) {
    Article = mongoose.model("Article", ArticleSchema);
  }
  return Article;
}

// ========== 3. 工具函数 ==========
// 上传图片到 R2
async function uploadToR2(c: any, url: string): Promise<string> {
  try {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(res.data);
    const contentType = (res.headers["content-type"] as string) || "image/jpeg";
    const ext = contentType.split("/")[1] || "jpg";
    const fileName = `articles/${crypto.randomBytes(16).toString("hex")}.${ext}`;

    const client = getS3Client(c);
    await client.send(
      new PutObjectCommand({
        Bucket: c.env.R2_BUCKET,
        Key: fileName,
        Body: buffer,
        ContentType: contentType,
      })
    );

    return `${c.env.R2_PUBLIC_URL}/${fileName}`;
  } catch (e) {
    console.error("R2 upload err", e);
    return url;
  }
}

// 替换文章内图片
async function processArticleContent(c: any, content: string): Promise<string> {
  let newContent = content;

  // Markdown 图片
  const mdReg = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = mdReg.exec(content)) !== null) {
    const original = m[2];
    if (!original.includes("cloudflarestorage.com") && !original.includes("tripcngo.com")) {
      const newUrl = await uploadToR2(c, original);
      newContent = newContent.replace(original, newUrl);
    }
  }

  // HTML img
  const htmlReg = /<img[^>]+src="([^">]+)"/g;
  while ((m = htmlReg.exec(content)) !== null) {
    const original = m[1];
    if (!original.includes("cloudflarestorage.com") && !original.includes("tripcngo.com")) {
      const newUrl = await uploadToR2(c, original);
      newContent = newContent.replace(original, newUrl);
    }
  }

  return newContent;
}

// 管理员鉴权中间件（和原逻辑一致）
const authMiddleware = async (c: any, next: any) => {
  const auth = c.req.header("authorization");
  if (!auth) return c.json({ error: "Unauthorized" }, 401);

  const base64 = auth.split(" ")[1];
  const [user, pass] = atob(base64).split(":");

  if (user !== c.env.ADMIN_USERNAME || pass !== c.env.ADMIN_PASSWORD) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
};

// ========== 4. API 路由（和原 Express 完全对齐） ==========
// DeepSeek 起名
app.post("/api/generate-name", async (c) => {
  const { name, sex, dob, info } = await c.req.json();
  try {
    const res = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a professional Chinese name generator. Generate a meaningful Chinese name based on the provided information, return just the name.",
          },
          { role: "user", content: `Generate a Chinese name for: Name: ${name}, Sex: ${sex}, DOB: ${dob}, Extra Info: ${info}` },
        ],
      },
      {
        headers: { Authorization: `Bearer ${c.env.DEEPSEEK_API_KEY}` },
      }
    );
    return c.json({ name: res.data.choices[0].message.content.trim() });
  } catch (e: any) {
    console.error("DeepSeek err", e);
    return c.json({ error: "Failed to generate name" }, 500);
  }
});

// 反馈邮件
app.post("/api/feedback", async (c) => {
  const { name, email, message } = await c.req.json();
  try {
    const transporter = createTransporter(c);
    await transporter.sendMail({
      from: `"${name}" <${c.env.GMAIL_USER}>`,
      to: c.env.GMAIL_USER,
      subject: `New Feedback from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br>${message}</p>`,
    });
    return c.json({ success: true });
  } catch (e) {
    console.error("Feedback mail err", e);
    return c.json({ error: "Failed to send email" }, 500);
  }
});

// 图片上传
app.post("/api/upload", authMiddleware, async (c) => {
  const { image, name, type } = await c.req.json();
  if (!image) return c.json({ error: "No image provided" }, 400);

  try {
    const buffer = Buffer.from(image, "base64");
    const fileName = `uploads/${crypto.randomBytes(16).toString("hex")}_${name || "pasted"}`;

    const client = getS3Client(c);
    await client.send(
      new PutObjectCommand({
        Bucket: c.env.R2_BUCKET,
        Key: fileName,
        Body: buffer,
        ContentType: type || "image/jpeg",
      })
    );

    const url = `${c.env.R2_PUBLIC_URL}/${fileName}`;
    return c.json({ url });
  } catch (e) {
    console.error("Upload err", e);
    return c.json({ error: "Upload failed" }, 500);
  }
});

// 获取文章列表
app.get("/api/articles", async (c) => {
  await getMongo(c);
  const Article = await getArticleModel();
  const category = c.req.query("category");
  const filter = category && category !== "All" ? { category } : {};
  const list = await Article.find(filter).sort({ createdAt: -1 });
  return c.json(list);
});

// 获取单篇文章 + 阅读量+1
app.get("/api/articles/:id", async (c) => {
  await getMongo(c);
  const Article = await getArticleModel();
  const article = await Article.findById(c.req.param("id"));
  if (!article) return c.json({ error: "Article not found" }, 404);

  article.views += 1;
  await article.save();
  return c.json(article);
});

// 创建文章
app.post("/api/articles", authMiddleware, async (c) => {
  await getMongo(c);
  const Article = await getArticleModel();
  const body = await c.req.json();

  if (body.content) body.content = await processArticleContent(c, body.content);
  if (body.contentEn) body.contentEn = await processArticleContent(c, body.contentEn);

  if (body.thumbnail && !body.thumbnail.includes("cloudflarestorage.com")) {
    body.thumbnail = await uploadToR2(c, body.thumbnail);
  }

  const doc = new Article(body);
  await doc.save();
  return c.json(doc, 201);
});

// 删除文章
app.delete("/api/articles/:id", authMiddleware, async (c) => {
  await getMongo(c);
  const Article = await getArticleModel();
  await Article.findByIdAndDelete(c.req.param("id"));
  return c.json({ success: true });
});

// 更新文章
app.patch("/api/articles/:id", authMiddleware, async (c) => {
  await getMongo(c);
  const Article = await getArticleModel();
  const body = await c.req.json();

  if (body.content) body.content = await processArticleContent(c, body.content);
  if (body.contentEn) body.contentEn = await processArticleContent(c, body.contentEn);

  if (body.thumbnail && !body.thumbnail.includes("cloudflarestorage.com")) {
    body.thumbnail = await uploadToR2(c, body.thumbnail);
  }

  body.updatedAt = new Date();
  const updated = await Article.findByIdAndUpdate(c.req.param("id"), body, { new: true });
  if (!updated) return c.json({ error: "Article not found" }, 404);
  return c.json(updated);
});

// ========== 5. 托管前端静态资源（关键！解决 Hello World） ==========
// 所有非 /api/* 的请求，都返回 React 前端
app.get("*", serveStatic({ root: "./dist", rewriteRequestPath: (p) => p }));

export default app;
