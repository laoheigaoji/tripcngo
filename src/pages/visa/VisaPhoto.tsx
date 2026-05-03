import React from 'react';
import VisaLayout from '../../components/visa/VisaLayout';
import { X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const badExamples = [
  { label: '曝光不足', filter: 'brightness(50%)' },
  { label: '曝光过度', filter: 'brightness(150%)' },
  { label: '对比度过高', filter: 'contrast(200%)' },
  { label: '头部过大', transform: 'scale(1.2)' },
  { label: '头部过小', transform: 'scale(0.8)' },
  { label: '未居中', transform: 'translate(10px, 10px)' },
  { label: '头部倾斜', transform: 'rotate(10deg)' },
  { label: '未面向相机', filter: 'grayscale(20%)' }, // Placeholder 
  { label: '背景不纯色', bg: 'bg-gray-200' },
  { label: '背景有阴影', shadow: 'shadow-inner' },
  { label: '衣服颜色与背景相同', filter: 'opacity(80%)' },
  { label: '有色镜片', filter: 'sepia(50%)' },
  { label: '镜框遮挡眼睛', filter: 'blur(1px)' },
  { label: '镜框过厚', filter: 'blur(1px)' },
  { label: '颜色不当', filter: 'hue-rotate(90deg)' },
  { label: '面部有阴影', filter: 'contrast(150%) brightness(80%)' },
  { label: '头发遮挡眼睛眉毛或耳朵', filter: 'blur(1px)' },
  { label: '模糊', filter: 'blur(3px)' },
  { label: '面部被遮挡', overlay: 'bg-black/40' },
  { label: '照片上有印章或其他图案', overlay: 'bg-red-500/20' },
  { label: '照片损坏或有其他缺陷', filter: 'contrast(120%) drop-shadow(2px 4px 6px black)' },
];

export default function VisaPhoto() {
  const { language, t } = useLanguage();
  const baseImage = 'https://static.tripcngo.com/ing/zhaopian1.jpg';
  const childImage = 'https://static.tripcngo.com/ing/zhaopian2.png';
  const badImage = 'https://static.tripcngo.com/ing/zhaopian3.png';

  return (
    <VisaLayout breadcrumbTitle={t('visa.menu.photo')}>
      <h2 className="text-2xl font-bold text-center mb-10 text-gray-900">{t('visa.menu.photo')}</h2>
      
      <div className="flex flex-col lg:flex-row gap-10 mb-12">
        {/* Left Column: Text */}
        <div className="flex-1 space-y-6">
          <section>
            <h3 className="text-lg font-bold text-[#1b887a] mb-2">{language === 'zh' ? '通用要求' : 'General Requirements'}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {language === 'zh' 
                ? '申请时需要提交两张申请人最近6个月内拍摄的照片。照片背景必须为白色，面部和背景不得有阴影。每张照片必须包含申请人完整的正面脸部、颈部和上半部的清晰视图。照片应在亚光或光面相纸上彩色打印，且未经过任何修改。如果提交的照片不符合要求，在申请处理前需要提交新照片。'
                : 'Submit two photos of the applicant taken within the last 6 months. The background must be white, without shadows on the face or background. Each photo must show a clear, full frontal view of the applicant’s face, neck, and upper shoulders. Print on matte or glossy photo paper in color, without any modifications. If photos don’t meet requirements, new ones will be requested.'
              }
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#1b887a] mb-2">{language === 'zh' ? '照片尺寸' : 'Photo Dimensions'}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {language === 'zh'
                ? '照片尺寸应为宽33毫米，高48毫米。头部宽度应在15毫米至22毫米之间，头部高度（从下巴底部到头顶）应在28毫米至33毫米之间。头顶到照片顶部的间距应在3毫米至5毫米之间。'
                : 'Dimensions: 33mm wide X 48mm high. Head width: 15-22mm, head height (from bottom of chin to top of head): 28-33mm. Space from top of head to top of photo: 3-5mm.'
              }
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#1b887a] mb-2">{language === 'zh' ? '面部要求' : 'Face Requirements'}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {language === 'zh'
                ? '拍摄对象的面部表情必须中性，眼睛睁开，所有面部特征应清晰可见。只有在镜片未着色且没有眩光、阴影或框架遮挡眼睛的情况下，才允许在照片中佩戴眼镜。允许在照片中佩戴助听器或类似设备。'
                : 'Facial expression must be neutral, eyes open, all facial features clearly visible. Glasses allowed only if lenses are uncolored and glare-, shadow-, or frame-free. Hearing aids/similar devices allowed.'
              }
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#1b887a] mb-2">{language === 'zh' ? '头饰要求' : 'Headwear Requirements'}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {language === 'zh'
                ? '只有在因宗教原因佩戴且不遮挡任何面部特征的情况下，才允许佩戴帽子或头饰。'
                : 'Hats or headwear are permitted only if worn for religious reasons and do not obscure any facial features.'
              }
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#1b887a] mb-2">{language === 'zh' ? '数字照片要求' : 'Digital Photo Requirements'}</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              {language === 'zh'
                ? '尺寸：高度 354~472px，宽度 420~560px，人脸宽度：191~251px，眼睛：位于距底部边缘约 256px 处，顶部空白：10~70px（从头部顶部测量），请提交大小在 40 至 120 KB 之间的 JPEG 格式数字图像'
                : 'Dimensions: 354~472px high, 420~560px wide. Face width: 191~251px. Eyes: Approx. 256px from bottom edge. Top margin: 10~70px. Submit as JPEG image, size 40-120 KB.'
              }
            </p>
            <p className="text-sm text-red-500">
              {language === 'zh' ? '注意：如果您以电子方式提交签证照片，请携带两张打印照片参加面试。' : 'Note: If submitting electronically, please bring two printed photos to your interview.'}
            </p>
          </section>
        </div>

        {/* Right Column: Reference Images */}
        <div className="w-full lg:w-[350px] flex flex-col items-center">
          <div className="bg-[#a8c6fa] p-6 rounded-md mb-2 flex flex-col items-center justify-center w-full relative">
            <div className="relative border border-blue-400 bg-white inline-block">
               {/* Just a stylized dimension representation */}
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-600 w-max">{language === 'zh' ? '15-22mm' : '15-22mm'}</div>
               <div className="absolute border-t border-blue-500 w-[15px] -top-2 left-1/2 -translate-x-1/2"></div>
               
               <div className="absolute top-1/2 -left-8 -translate-y-1/2 text-[10px] text-gray-600">{language === 'zh' ? '28-33mm' : '28-33mm'}</div>
               <div className="absolute border-l border-blue-500 h-[28px] top-1/2 -left-2 -translate-y-1/2"></div>
               
               <img src={baseImage} alt={language === 'zh' ? '尺寸图示' : 'Dimension Illustration'} className="w-[120px] h-[160px] object-cover object-top" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-6 text-center">{language === 'zh' ? '照片尺寸: 33mm (宽) × 48mm (高)' : 'Photo Dimensions: 33mm (width) × 48mm (height)'}</p>

          <div className="w-full">
            <h4 className="text-sm font-bold text-gray-900 mb-3">{language === 'zh' ? '合格照片示例' : 'Qualified Photo Example'}</h4>
            <img src={childImage} alt={language === 'zh' ? '合格照片示例' : 'Qualified Photo Example'} className="rounded-sm" />
          </div>
        </div>
      </div>

      {/* Bad Examples Matrix */}
      <div className="bg-gray-50/50 border border-gray-100 rounded-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <X className="w-5 h-5 text-red-500 mr-2" strokeWidth={3} />
          {language === 'zh' ? '不合格照片示例' : 'Unqualified Photo Examples'}
        </h3>
        <div className="flex flex-col items-center">
            <div className="bg-white overflow-hidden mb-2 relative flex items-center justify-center border border-gray-200">
                <img 
                    src={badImage} 
                    alt={language === 'zh' ? '不合格照片示例' : 'Unqualified Photo Example'}
                    className=""
                />
            </div>
            <span className="text-[14px] font-bold text-gray-700 text-center px-1">{language === 'zh' ? '不合格照片示例' : 'Unqualified Photo Example'}</span>
        </div>
      </div>

    </VisaLayout>
  );
}
