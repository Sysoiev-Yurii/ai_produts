import React, { useState } from 'react';
import { FileText, Send, Download, FileSpreadsheet, Check, FileJson } from 'lucide-react';
import { ReportItem } from '../../types';

const ReportsView: React.FC = () => {
  const [reports] = useState<ReportItem[]>([
    { id: '1', title: 'Ежедневный свод цен RO (Top 50)', date: '25.10.2023 09:00', type: 'PDF', size: '2.4 MB' },
    { id: '2', title: 'Сравнение RTX 4060 vs 4070', date: '24.10.2023 14:30', type: 'EXCEL', size: '1.1 MB' },
    { id: '3', title: 'Новые поступления Altex', date: '24.10.2023 08:00', type: 'TELEGRAM', size: '-' },
  ]);

  const [sendingId, setSendingId] = useState<string | null>(null);

  const handleSend = (id: string) => {
    setSendingId(id);
    setTimeout(() => setSendingId(null), 2000); // Simulate API call
  };

  const downloadCSV = () => {
    // Mock CSV download
    alert("Конвертация в CSV и скачивание...");
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Отчеты и Экспорт</h2>
        <p className="text-slate-500 mt-2 text-lg">Генерация аналитики и выгрузка данных.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <button className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300 group hover:shadow-xl hover:shadow-blue-900/5">
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">PDF Отчет</h3>
          <p className="text-sm text-slate-500 mt-2">Визуальная аналитика с графиками для презентаций</p>
        </button>
        
        <button 
          onClick={downloadCSV}
          className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300 group hover:shadow-xl hover:shadow-emerald-900/5"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">Excel / CSV</h3>
          <p className="text-sm text-slate-500 mt-2">Полная выгрузка базы данных в табличный формат</p>
        </button>

        <button className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300 group hover:shadow-xl hover:shadow-blue-900/5">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
            <Send className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">Telegram Bot</h3>
          <p className="text-sm text-slate-500 mt-2">Мгновенная рассылка обновлений подписчикам</p>
        </button>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-slate-200/60 bg-slate-50/50 backdrop-blur-sm flex justify-between items-center">
          <span className="font-bold text-slate-800">История генераций</span>
          <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 uppercase tracking-wider">Очистить историю</button>
        </div>
        <div className="divide-y divide-slate-100">
          {reports.map((report) => (
            <div key={report.id} className="p-6 flex items-center justify-between hover:bg-slate-50/80 transition-colors group">
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                  report.type === 'PDF' ? 'bg-red-50 text-red-600' :
                  report.type === 'EXCEL' ? 'bg-emerald-50 text-emerald-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {report.type === 'PDF' ? <FileText className="w-6 h-6" /> : 
                   report.type === 'EXCEL' ? <FileSpreadsheet className="w-6 h-6" /> :
                   <Send className="w-6 h-6" />}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-base mb-1">{report.title}</div>
                  <div className="text-xs font-medium text-slate-500 flex items-center gap-3">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{report.date}</span>
                    <span>{report.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                 {/* Convert to CSV Button Action */}
                 <button 
                   onClick={downloadCSV}
                   className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all"
                   title="Конвертировать в CSV"
                 >
                   <FileJson className="w-4 h-4" />
                   <span className="hidden lg:inline">В CSV</span>
                 </button>

                 <button 
                  onClick={() => handleSend(report.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm ${
                    sendingId === report.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600'
                  }`}
                 >
                   {sendingId === report.id ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                   <span className="hidden lg:inline">{sendingId === report.id ? 'Отправлено' : 'Отправить'}</span>
                 </button>
                 
                 <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                   <Download className="w-5 h-5" />
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsView;