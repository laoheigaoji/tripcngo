import React from 'react';
import VisaLayout from '../../components/visa/VisaLayout';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function VisaTypes() {
  const { language, t } = useLanguage();
  
  const visaTypesData = [
    { purpose: language === 'zh' ? '旅游' : 'Tourism', type: 'L', desc: language === 'zh' ? '适用于入境旅游人员，包括团队旅游。停留时间通常为30天、60天或90天，可申请单次或多次入境。' : 'Suitable for those entering for tourism, including group tours. Stay duration is usually 30, 60, or 90 days, with single or multiple entry options.' },
    { purpose: language === 'zh' ? '商务贸易' : 'Business', type: 'M', desc: language === 'zh' ? '发给入境进行商业贸易活动的人员，首次停留最长90天，可延期。' : 'Issued to those entering for commercial and trade activities. Initial stay up to 90 days, extendable.' },
    { purpose: language === 'zh' ? '家庭团聚/结婚' : 'Family Reunion (Q1)', type: 'Q1', desc: language === 'zh' ? '因家庭团聚申请在华长期居留（超过180日）的中国公民或永久居留外国人的家庭成员。' : 'For family members of Chinese citizens or foreigners with permanent residence applying for long-term stay (>180 days).' },
    { purpose: language === 'zh' ? '家庭团聚/结婚' : 'Family Reunion (Q2)', type: 'Q2', desc: language === 'zh' ? '短期探亲（不超过180日），适用于亲属短期停留。' : 'For short-term family visits (<=180 days).' },
    { purpose: language === 'zh' ? '工作' : 'Work', type: 'Z', desc: language === 'zh' ? '入境工作的外国专家；营业性演出；外国企业常驻中国代表机构的首席代表、代表；海上石油作业；志愿者、义工（超过90日）；其他取得中国政府主管部门颁发的工作许可入境工作的人员' : 'Foreign experts, business performers, representatives of foreign companies in China, offshore oil operations, volunteers (>90 days), and others with work permits.' },
    { purpose: language === 'zh' ? '学习' : 'Study (X1)', type: 'X1', desc: language === 'zh' ? '长期学习（超过180日），需学校录取通知书及JW201/JW202表。' : 'Long-term study (>180 days), requires admission letter and JW201/JW202 form.' },
    { purpose: language === 'zh' ? '学习' : 'Study (X2)', type: 'X2', desc: language === 'zh' ? '短期学习（不超过180日），适用于短期课程或交流项目。' : 'Short-term study (<=180 days), suitable for short courses or exchange projects.' },
    { purpose: language === 'zh' ? '过境' : 'Transit', type: 'G', desc: language === 'zh' ? '经中国过境前往第三国的人员，停留时间通常不超过10天。' : 'For transit through China to a third country, stay usually <= 10 days.' },
    { purpose: language === 'zh' ? '乘务/运输' : 'Crew', type: 'C', desc: language === 'zh' ? '国际列车乘务员；国际航空器机组成员；国际航行船舶的船员及船员随行家属；从事国际道路运输的汽车驾驶员' : 'International train/airline crew, shipping crew and accompanying family, international road transport drivers.' },
    { purpose: language === 'zh' ? '永久居留' : 'Permanent Residence', type: 'D', desc: language === 'zh' ? '需提前获得公安部审批，适用于申请在中国永久居留的人员。' : 'Requires prior approval from the Ministry of Public Security, for those applying for permanent residence in China.' },
    { purpose: language === 'zh' ? '交流访问/考察' : 'Exchange', type: 'F', desc: language === 'zh' ? '学术交流活动；文化交流活动（如交流性演出）；宗教交流活动；非政府组织交流活动；志愿者、义工（不超过90日）；持《外国专家来华邀请函》的外国专家；地理测绘活动' : 'Academic/cultural exchange, religious activities, NGO activities, volunteers (<=90 days), foreign experts with invitation, surveying.' },
    { purpose: language === 'zh' ? '新闻记者' : 'Journalist (J1)', type: 'J1', desc: language === 'zh' ? '常驻中国新闻机构的外国记者，需外交部新闻司签发的通知函。' : 'Resident foreign journalists, requires notification letter from the Information Department of the Ministry of Foreign Affairs.' },
    { purpose: language === 'zh' ? '新闻记者' : 'Journalist (J2)', type: 'J2', desc: language === 'zh' ? '短期采访记者（停留不超过180日），需官方媒体公函。' : 'Short-term journalists (<=180 days), requires official media letter.' },
    { purpose: language === 'zh' ? '高层次人才' : 'Talent', type: 'R', desc: language === 'zh' ? '针对国家急需的外国高层次人才，提供便利化入境及居留政策。' : 'For high-level talents urgently needed by the country, offering facilitative visa and residence policies.' },
    { purpose: language === 'zh' ? '私人事务探亲' : 'Private (S1)', type: 'S1', desc: language === 'zh' ? '在华居留外国人的长期探亲家属（超过180日）。' : 'For long-term family dependents of foreigners residing in China (>180 days).' },
    { purpose: language === 'zh' ? '私人事务探亲' : 'Private (S2)', type: 'S2', desc: language === 'zh' ? '短期探亲（不超过180日）或因其他私人事务需停留的人员。' : 'For short-term family visits (<=180 days) or other private affairs.' }
  ];

  return (
    <VisaLayout breadcrumbTitle={t('visa.menu.types')}>
      <div className="overflow-x-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('visa.menu.types')}</h2>
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-[#1b887a] text-white">
              <th className="py-4 px-6 font-medium whitespace-nowrap border-b border-[#1b887a]">{language === 'zh' ? '赴华主要目的' : 'Main Purpose'}</th>
              <th className="py-4 px-6 font-medium whitespace-nowrap border-b border-[#1b887a]">{language === 'zh' ? '签证类型' : 'Visa Type'}</th>
              <th className="py-4 px-6 font-medium border-b border-[#1b887a]">{language === 'zh' ? '签证类型说明' : 'Description'}</th>
              <th className="py-4 px-6 font-medium whitespace-nowrap border-b border-[#1b887a]"></th>
            </tr>
          </thead>
          <tbody>
            {visaTypesData.map((item, index) => (
              <tr 
                key={index} 
                className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
              >
                <td className="py-4 px-6 text-gray-700 whitespace-nowrap">{item.purpose}</td>
                <td className="py-4 px-6 font-bold text-gray-900 text-center whitespace-nowrap">{item.type}</td>
                <td className="py-4 px-6 text-gray-600 leading-relaxed min-w-[300px]">{item.desc}</td>
                <td className="py-4 px-6 text-center whitespace-nowrap">
                  <Link to="#" className="text-[#1b887a] hover:underline text-[13px]">{language === 'zh' ? '材料清单' : 'Documents'}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </VisaLayout>
  );
}
