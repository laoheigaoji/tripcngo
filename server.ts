import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Feedback Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://752675:Aa752675@cluster0.simmm5o.mongodb.net/Tripcngo";

mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB via Express Server"))
  .catch(err => console.error("MongoDB connection error:", err));

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
  updatedAt: { type: Date, default: Date.now }
});

const Article = mongoose.model("Article", ArticleSchema);

// Cloudflare R2 Configuration
const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT || "https://0a28250e63bf217f833feabaf84a25a1.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "4135a1c8edc3abd2e470f7fb23ec2d37",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "c5c84994c93562c70c56c4309a17fa0218348ace95b7a9bdde37c27aae35ace3",
  },
});

const R2_BUCKET = process.env.R2_BUCKET || "tripcngo-assets";
// Using the custom domain provided for production
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "https://static.tripcngo.com"; 

async function uploadToR2(url: string): Promise<string> {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    const contentType = response.headers['content-type'] as string || 'image/jpeg';
    const extension = contentType.split('/')[1] || 'jpg';
    const fileName = `articles/${crypto.randomBytes(16).toString('hex')}.${extension}`;

    await s3Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
    }));

    // If you have a custom domain/public access configured, return that URL
    // For now returning the full path format which works if public access is enabled on the bucket
    return `${R2_PUBLIC_URL}/${fileName}`;
  } catch (error) {
    console.error("Error uploading to R2:", error);
    return url; // Fallback to original if failed
  }
}

async function processArticleContent(content: string): Promise<string> {
  // Simple regex for Markdown image: ![alt](url)
  const mdImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g;
  let matches;
  let newContent = content;

  while ((matches = mdImageRegex.exec(content)) !== null) {
    const originalUrl = matches[2];
    if (!originalUrl.includes("cloudflarestorage.com") && !originalUrl.includes("tripcngo.com")) {
      const newUrl = await uploadToR2(originalUrl);
      newContent = newContent.replace(originalUrl, newUrl);
    }
  }

  // Also handle <img> tags if they exist (sometimes pasted from HTML)
  const htmlImageRegex = /<img[^>]+src="([^">]+)"/g;
  while ((matches = htmlImageRegex.exec(content)) !== null) {
    const originalUrl = matches[1];
    if (!originalUrl.includes("cloudflarestorage.com") && !originalUrl.includes("tripcngo.com")) {
      const newUrl = await uploadToR2(originalUrl);
      newContent = newContent.replace(originalUrl, newUrl);
    }
  }

  return newContent;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Authentication Middleware (Simple for Demo)
  const authenticate = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

    const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":");
    
    if (username === (process.env.ADMIN_USERNAME || "admin") && 
        password === (process.env.ADMIN_PASSWORD || "Aa752675")) {
      next();
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  };

  app.post("/api/generate-name", async (req, res) => {
    const { name, sex, dob, info } = req.body;
    try {
      const response = await axios.post("https://api.deepseek.com/v1/chat/completions", {
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are a professional Chinese name generator. Generate a meaningful Chinese name based on the provided information, return just the name." },
          { role: "user", content: `Generate a Chinese name for: Name: ${name}, Sex: ${sex}, DOB: ${dob}, Extra Info: ${info}` }
        ]
      }, {
        headers: { "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}` }
      });
      res.json({ name: response.data.choices[0].message.content.trim() });
    } catch (error: any) {
      console.error("DeepSeek Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to generate name" });
    }
  });

  // API Routes
  app.post("/api/feedback", async (req, res) => {
    const { name, email, message } = req.body;
    
    try {
      await transporter.sendMail({
        from: `"${name}" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER, // Send to yourself
        subject: `New Feedback from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br>${message}</p>`
      });
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Failed to send feedback email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  app.post("/api/upload", authenticate, async (req, res) => {
    try {
      // In a real production app, use multer or express-formidable. 
      // For simplicity here with base64/buffer:
      const { image, name, type } = req.body;
      if (!image) return res.status(400).json({ error: "No image provided" });

      const buffer = Buffer.from(image, 'base64');
      const fileName = `uploads/${crypto.randomBytes(16).toString('hex')}_${name || 'pasted'}`;

      await s3Client.send(new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: fileName,
        Body: buffer,
        ContentType: type || 'image/jpeg',
      }));

      const url = `${R2_PUBLIC_URL}/${fileName}`;
      res.json({ url });
    } catch (error) {
      console.error("Upload failed:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });

  app.get("/api/articles", async (req, res) => {
    try {
      const category = req.query.category as string;
      const filter = category && category !== "All" ? { category } : {};
      const articles = await Article.find(filter).sort({ createdAt: -1 });
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const article = await Article.findById(req.params.id);
      if (!article) return res.status(404).json({ error: "Article not found" });
      
      article.views += 1;
      await article.save();
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  app.post("/api/articles", authenticate, async (req, res) => {
    try {
      const articleData = req.body;
      
      // Auto-process content for images
      if (articleData.content) {
        articleData.content = await processArticleContent(articleData.content);
      }
      if (articleData.contentEn) {
        articleData.contentEn = await processArticleContent(articleData.contentEn);
      }
      
      // Auto-process thumbnail if it's an external URL
      if (articleData.thumbnail && !articleData.thumbnail.includes("cloudflarestorage.com")) {
        articleData.thumbnail = await uploadToR2(articleData.thumbnail);
      }

      const article = new Article(articleData);
      await article.save();
      res.status(201).json(article);
    } catch (error) {
      console.error("Failed to create article:", error);
      res.status(400).json({ error: "Failed to create article" });
    }
  });

  app.delete("/api/articles/:id", authenticate, async (req, res) => {
    try {
      await Article.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  app.patch("/api/articles/:id", authenticate, async (req, res) => {
    try {
      const articleData = req.body;
      
      // Auto-process content for images
      if (articleData.content) {
        articleData.content = await processArticleContent(articleData.content);
      }
      if (articleData.contentEn) {
        articleData.contentEn = await processArticleContent(articleData.contentEn);
      }
      
      // Auto-process thumbnail
      if (articleData.thumbnail && !articleData.thumbnail.includes("cloudflarestorage.com")) {
        articleData.thumbnail = await uploadToR2(articleData.thumbnail);
      }

      articleData.updatedAt = new Date();

      const article = await Article.findByIdAndUpdate(req.params.id, articleData, { new: true });
      if (!article) return res.status(404).json({ error: "Article not found" });
      
      res.json(article);
    } catch (error) {
      console.error("Failed to update article:", error);
      res.status(400).json({ error: "Failed to update article" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
