import React from 'react';
import VisaLayout from '../../components/visa/VisaLayout';
import { Link } from 'react-router-dom';

const visaTypesData = [
  { purpose: '旅游', type: 'L', desc: '适用于入境旅游人员，包括团队旅游。停留时间通常为30天、60天或90天，可申请单次或多次入境。' },
  { purpose: '商务贸易', type: 'M', desc: '发给入境进行商业贸易活动的人员，首次停留最长90天，可延期。' },
  { purpose: '家庭团聚/结婚', type: 'Q1', desc: '因家庭团聚申请在华长期居留（超过180日）的中国公民或永久居留外国人的家庭成员。' },
  { purpose: '家庭团聚/结婚', type: 'Q2', desc: '短期探亲（不超过180日），适用于亲属短期停留。' },
  { purpose: '工作', type: 'Z', desc: '入境工作的外国专家；营业性演出；外国企业常驻中国代表机构的首席代表、代表；海上石油作业；志愿者、义工（超过90日）；其他取得中国政府主管部门颁发的工作许可入境工作的人员' },
  { purpose: '学习', type: 'X1', desc: '长期学习（超过180日），需学校录取通知书及JW201/JW202表。' },
  { purpose: '学习', type: 'X2', desc: '短期学习（不超过180日），适用于短期课程或交流项目。' },
  { purpose: '过境', type: 'G', desc: '经中国过境前往第三国的人员，停留时间通常不超过10天。' },
  { purpose: '乘务/运输', type: 'C', desc: '国际列车乘务员；国际航空器机组成员；国际航行船舶的船员及船员随行家属；从事国际道路运输的汽车驾驶员' },
  { purpose: '永久居留', type: 'D', desc: '需提前获得公安部审批，适用于申请在中国永久居留的人员。' },
  { purpose: '交流访问/考察', type: 'F', desc: '学术交流活动；文化交流活动（如交流性演出）；宗教交流活动；非政府组织交流活动；志愿者、义工（不超过90日）；持《外国专家来华邀请函》的外国专家；地理测绘活动' },
  { purpose: '新闻记者', type: 'J1', desc: '常驻中国新闻机构的外国记者，需外交部新闻司签发的通知函。' },
  { purpose: '新闻记者', type: 'J2', desc: '短期采访记者（停留不超过180日），需官方媒体公函。' },
  { purpose: '高层次人才', type: 'R', desc: '针对国家急需的外国高层次人才，提供便利化入境及居留政策。' },
  { purpose: '私人事务探亲', type: 'S1', desc: '在华居留外国人的长期探亲家属（超过180日）。' },
  { purpose: '私人事务探亲', type: 'S2', desc: '短期探亲（不超过180日）或因其他私人事务需停留的人员。' }
];

export default function VisaTypes() {
  return (
    <VisaLayout breadcrumbTitle="签证类型">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-[#1b887a] text-white">
              <th className="py-4 px-6 font-medium whitespace-nowrap border-b border-[#1b887a]">赴华主要目的</th>
              <th className="py-4 px-6 font-medium whitespace-nowrap border-b border-[#1b887a]">签证类型</th>
              <th className="py-4 px-6 font-medium border-b border-[#1b887a]">签证类型说明</th>
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
                  <Link to="#" className="text-[#1b887a] hover:underline text-[13px]">材料清单</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </VisaLayout>
  );
}
