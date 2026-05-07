import React, { useState } from 'react';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { Download, Upload, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const TABLES = [
  { id: 'articles', label: '文章数据' },
  { id: 'cities', label: '城市数据' },
  { id: 'visa_types', label: '签证类型' },
  { id: 'signature_pages', label: '签名页面' },
  { id: 'visa_documents', label: '签证材料' },
  { id: 'visa_fees', label: '签证费用' },
  { id: 'translations', label: '翻译数据' },
  { id: 'apps_catalog', label: '目录应用' },
  { id: 'page_sections', label: '静态页板块' },
  { id: 'feedback', label: '用户反馈' },
];

export default function DataBackupManagement() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [progress, setProgress] = useState(0);

  const handleExportAll = async () => {
    setLoading(true);
    setStatus(null);
    setProgress(0);
    try {
      const allData: Record<string, any> = {};
      
      for (let i = 0; i < TABLES.length; i++) {
        const table = TABLES[i];
        const { data, error } = await supabaseAdmin.from(table.id).select('*');
        if (error) {
          console.warn(`Table ${table.id} might not exist or lacks data:`, error.message);
          allData[table.id] = [];
          continue;
        }
        allData[table.id] = data;
        setProgress(Math.round(((i + 1) / TABLES.length) * 100));
      }

      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `china_travel_guide_data_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setStatus({ type: 'success', message: '所有表数据已成功导出！' });
    } catch (err: any) {
      console.error('Export failed:', err);
      setStatus({ type: 'error', message: '备份失败: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!confirm('警告：还原操作可能会覆盖或更新现有数据。建议在操作前先进行一次备份。是否继续？')) {
      event.target.value = '';
      return;
    }

    setLoading(true);
    setStatus(null);
    setProgress(0);
    try {
      const text = await file.text();
      const backupData = JSON.parse(text);
      
      const tablesInBackup = Object.keys(backupData);
      let processedCount = 0;

      for (const tableId of tablesInBackup) {
        const rows = backupData[tableId];
        if (Array.isArray(rows) && rows.length > 0) {
          // 批量 upsert 每 100 条一组
          const batchSize = 100;
          for (let i = 0; i < rows.length; i += batchSize) {
            const batch = rows.slice(i, i + batchSize);
            const { error } = await supabaseAdmin.from(tableId).upsert(batch);
            if (error) throw error;
          }
        }
        processedCount++;
        setProgress(Math.round((processedCount / tablesInBackup.length) * 100));
      }

      setStatus({ type: 'success', message: '数据已成功恢复！' });
    } catch (err: any) {
      console.error('Import failed:', err);
      setStatus({ type: 'error', message: '恢复失败: ' + err.message });
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  const copySchemaSQL = () => {
    const sql = `-- Supabase 初始化脚本
-- 在 Supabase SQL Editor 中运行以下代码以创建表结构

${TABLES.map(t => `-- [${t.label}] ${t.id}
-- 注意：这里仅为占位符提示。真正的结构建议从 Supabase Dashboard -> Database -> Schema 导出
-- 或者在迁移时使用 pg_dump 工具。`).join('\n\n')}

-- 常用表结构参考示例：
-- CREATE TABLE IF NOT EXISTS articles (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   title TEXT NOT NULL,
--   content TEXT,
--   category TEXT,
--   lang TEXT,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );
`;
    navigator.clipboard.writeText(sql);
    alert('SQL 结构提示已复制到剪贴板！\n\n提示：真正的表结构备份建议在 Supabase 控制台使用 "Database -> SQL Editor" 或 CLI 工具进行导出。');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-2xl font-bold text-gray-800">数据库管理</h2>
          <button 
            onClick={copySchemaSQL}
            className="text-xs font-medium text-[#1b887a] hover:underline"
          >
            获取建表 SQL 提示
          </button>
        </div>
        <p className="text-gray-500 mb-8">管理应用核心数据。注意：此功能仅备份【数据内容】，不包含表结构定义、索引或触发器。</p>

        <div className="space-y-6">
          {/* Status Messages */}
          {status && (
            <div className={`p-4 rounded-xl flex items-start gap-3 ${
              status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {status.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 mt-0.5" />
              )}
              <span className="text-sm font-medium">{status.message}</span>
            </div>
          )}

          {/* Progress Bar */}
          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>处理进度</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-[#1b887a] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export Section */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">备份全部数据</h3>
              <p className="text-xs text-gray-500 mb-6">获取包含所有文章、城市、签证和设置数据的 JSON 文件。</p>
              <button
                onClick={handleExportAll}
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                开始备份
              </button>
            </div>

            {/* Import Section */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">恢复备份数据</h3>
              <p className="text-xs text-gray-500 mb-6">上传之前备份的 JSON 文件来恢复数据（小心覆盖）。</p>
              <label className="w-full py-2.5 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                选择文件恢复
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  disabled={loading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Info List */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">包含的数据表 ({TABLES.length})</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4">
          {TABLES.map(table => (
            <div key={table.id} className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              {table.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
