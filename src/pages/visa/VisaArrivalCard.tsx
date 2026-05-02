import React from 'react';
import VisaLayout from '../../components/visa/VisaLayout';

const steps = [
  {
    num: 1,
    title: '第一步 - 访问网站',
    desc: '搜索“外国人入境卡”，进入网站，不同城市的链接不尽相同，请根据入境口岸选择对应的链接',
    links: [
      { name: '上海', url: 'https://www.singlewindow.sh.cn/hj/' },
      { name: '浙江', url: 'https://zj.singlewindow.cn/nia/' },
    ],
    image: 'https://static.tripcngo.com/ing/buzhou1.png'
  },
  {
    num: 2,
    title: '第二步 - 选择入境卡',
    desc: '点击“外国人入境卡”或者“24/240小时过境免签”',
    image: 'https://static.tripcngo.com/ing/buzhou2.png'
  },
  {
    num: 3,
    title: '第三步 - 选择语言',
    desc: '选择语言（英语、日语、韩语等），填写姓名、性别、国籍、证件号码等基础信息',
    image: 'https://static.tripcngo.com/ing/buzhou3.png'
  },
  {
    num: 4,
    title: '第四步 - 填写信息',
    desc: '填写航班号、联系电话、入境目的和住址等相关信息',
    image: 'https://static.tripcngo.com/ing/buzhou4.png'
  },
  {
    num: 5,
    title: '第五步 - 提交保存二维码',
    desc: '填写完成之后，将二维码保存到手机内，以方便入境时使用',
    image: 'https://static.tripcngo.com/ing/buzhou5.png'
  },
  {
    num: 6,
    title: '最后一步 - 打印入境卡',
    desc: '在自助机扫描二维码打印入境卡，递交给移民局并完成入境手续，采集指纹后就可以入境啦！',
    image: 'https://static.tripcngo.com/ing/buzhou6.png'
  }
];

export default function VisaArrivalCard() {
  return (
    <VisaLayout breadcrumbTitle="入境卡填写指南">
      <h2 className="text-2xl font-bold text-center mb-10 text-gray-900">中国入境卡填写指南</h2>
      <div className="space-y-12">
        {steps.map((step) => (
          <div key={step.num} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pb-10 border-b border-gray-100 last:border-0 last:pb-0">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-[#1b887a] text-white flex items-center justify-center font-bold">{step.num}</span>
                <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{step.desc}</p>
              {step.links && (
                <div className="space-y-2">
                  {step.links.map((link) => (
                    <div key={link.name} className="flex gap-2 text-sm">
                      <span className="text-gray-900 font-medium">{link.name}:</span>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[#1b887a] hover:underline break-all">{link.url}</a>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-gray-100 rounded-lg h-[200px] flex items-center justify-center text-gray-400">
               {/* Replace with actual screenshots in production */}
               <img src={step.image} alt={step.title} className="rounded-lg w-full h-full object-cover" />
            </div>
          </div>
        ))}
      </div>
    </VisaLayout>
  );
}
