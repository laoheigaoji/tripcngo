import React from 'react';
import VisaLayout from '../../components/visa/VisaLayout';
import { useLanguage } from '../../context/LanguageContext';

export default function VisaFees() {
  const { language, t } = useLanguage();

  const visaFees = [
    { type: 'L', purpose: language === 'zh' ? '旅游、探亲' : 'Tourism, Visiting Relatives', range: '约 2000-3000 元', note: language === 'zh' ? '费用因停留次数（单次/多次）和国籍不同可能调整，需提供行程证明和邀请函' : 'Fees vary based on entry count (single/multiple) and nationality; itinerary proof and invitation letter required.' },
    { type: 'M', purpose: language === 'zh' ? '商务贸易活动' : 'Business/Trade', range: '约 1000-2000 元', note: language === 'zh' ? '需提供邀请函及公司资质文件，对等国家可能按协议收费' : 'Invitation letter and company documents required; reciprocal fees may apply for certain countries.' },
    { type: 'Z', purpose: language === 'zh' ? '工作' : 'Work', range: '约 800-2000 元', note: language === 'zh' ? '需额外支付《外国人工作许可证》申请费（约500元）及体检费等' : 'Additional work permit application fee (approx. 500 RMB) and medical exam fees apply.' },
    { type: 'X', purpose: language === 'zh' ? '学习' : 'Study', range: '约 1000-1500 元', note: language === 'zh' ? '长期学习 (X1) 可能涉及居留许可费用（约800元/年）' : 'Long-term study (X1) may involve residence permit fees (approx. 800 RMB/year).' },
    { type: 'Q', purpose: language === 'zh' ? '家庭团聚/探亲' : 'Family Reunion', range: '约 1000-2000 元', note: language === 'zh' ? 'Q1 (长期) 需提供亲属关系证明，Q2 (短期) 费用较低' : 'Q1 (long-term) requires proof of kinship; Q2 (short-term) fees are lower.' },
    { type: 'S', purpose: language === 'zh' ? '私人事务探亲' : 'Private Affairs', range: '约 1000-2000 元', note: language === 'zh' ? '需提供亲属在华居留证明或事务证明文件' : 'Proof of kinship or purpose of private affairs in China required.' },
    { type: 'F', purpose: language === 'zh' ? '交流、访问、考察' : 'Exchange/Visit', range: '约 800-1500 元', note: language === 'zh' ? '非商业活动，需邀请单位出具证明' : 'Non-commercial activities; certificate from inviting unit required.' },
    { type: 'G', purpose: language === 'zh' ? '过境' : 'Transit', range: '约 500-1000 元', note: language === 'zh' ? '需提供联程交通票据，停留时间通常不超过7天' : 'Connecting transport tickets required; stay usually no more than 7 days.' },
    { type: 'R', purpose: language === 'zh' ? '高层次人才' : 'High-Level Talent', range: '约 1000-2000 元', note: language === 'zh' ? '需提供人才认定证明，部分国家可能免签证费' : 'Talent identification certificate required; visa fee exemption possible for some countries.' },
    { type: 'D', purpose: language === 'zh' ? '永久居留申请' : 'Permanent Residence', range: '约 2000-3000 元', note: language === 'zh' ? '需公安部审批，含《外国人永久居留身份确认表》费用' : 'Requires Ministry of Public Security approval; includes permanent residence confirmation form fee.' },
  ];

  return (
    <VisaLayout breadcrumbTitle={t('visa.menu.fee')}>
      <div className="p-6">
        <div className="bg-[#1b887a] text-white p-6 rounded-t-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1b887a]/50">
                <th className="text-left py-2">{language === 'zh' ? '签证类型' : 'Visa Type'}</th>
                <th className="text-left py-2">{language === 'zh' ? '主要用途' : 'Main Purpose'}</th>
                <th className="text-left py-2">{language === 'zh' ? '费用范围' : 'Cost Range'}</th>
                <th className="text-left py-2">{language === 'zh' ? '特别说明' : 'Notes'}</th>
              </tr>
            </thead>
            <tbody>
              {visaFees.map((v, i) => (
                <tr key={i} className="border-b border-[#1b887a]/50 last:border-none">
                  <td className="py-3 font-semibold">{v.type} {language === 'zh' ? '签证' : 'Visa'}</td>
                  <td className="py-3">{v.purpose}</td>
                  <td className="py-3 text-[#e0f2f1] font-medium">{v.range}</td>
                  <td className="py-3 text-xs opacity-90">{v.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-8 rounded-b-lg border-x border-b border-gray-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4">{language === 'zh' ? '更多费用信息' : 'Additional Info'}</h3>
          
          <div className="space-y-6 text-sm text-gray-700">
            <div>
              <h4 className="font-semibold text-gray-900">{language === 'zh' ? '对等国家与非对等国家' : 'Reciprocal vs Non-Reciprocal'}</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>{language === 'zh' ? '部分国家与中国签订签证费用对等协议（如美国、英国、加拿大等），费用可能高于非对等国家' : 'Some countries have reciprocal visa agreements with China (e.g., USA, UK, Canada), which may result in higher fees than for non-reciprocal countries.'}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">{language === 'zh' ? '附加费用' : 'Additional Fees'}</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>{language === 'zh' ? '加急服务：通常额外收取300-500元' : 'Expedited service: Usually an additional 300-500 RMB.'}</li>
                <li>{language === 'zh' ? '邮寄费：约50-100元（若是邮寄材料）' : 'Mailing fee: Approx. 50-100 RMB (if mailing documents).'}</li>
                <li>{language === 'zh' ? '体检费：约500-800元（部分签证类型要求）' : 'Medical exam fee: Approx. 500-800 RMB (required for some visa types).'}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">{language === 'zh' ? '居留许可费用' : 'Residence Permit Fees'}</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>{language === 'zh' ? '一年内居留许可：约800元' : 'Residence permit < 1 year: Approx. 800 RMB.'}</li>
                <li>{language === 'zh' ? '1-3年居留许可：约1000元' : '1-3 years residence permit: Approx. 1000 RMB.'}</li>
                <li>{language === 'zh' ? '3-5年居留许可：约1500元' : '3-5 years residence permit: Approx. 1500 RMB.'}</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 rounded border border-gray-100 text-xs text-gray-500">
              <p className="font-semibold text-gray-700 mb-1">{language === 'zh' ? '注意事项:' : 'Note:'}</p>
              <p>{language === 'zh' ? '以上费用仅供参考，具体金额需以中国驻外使领馆或签证中心最新公告为准' : 'The above fees are for reference only; exact amounts are subject to the latest announcements from Chinese embassies, consulates, or visa centers.'}</p>
              <p>{language === 'zh' ? '建议提前通过使领馆官网查询目标国家的详细收费标准，或咨询当地签证代理机构' : 'It is recommended to check the specific fee standards for your country on the embassy website or consult a local visa agency in advance.'}</p>
            </div>
          </div>
        </div>
      </div>
    </VisaLayout>
  );
}
