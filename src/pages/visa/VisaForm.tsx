import React from 'react';
import VisaLayout from '../../components/visa/VisaLayout';

export default function VisaForm() {
  return (
    <VisaLayout breadcrumbTitle="填写申请表">
      <div className="w-full">
        <img 
          src="https://static.tripcngo.com/ing/shenqingbiao.png" 
          alt="签证申请表" 
          className="w-full h-auto rounded-sm border border-gray-100 shadow-sm"
        />
      </div>
    </VisaLayout>
  );
}
