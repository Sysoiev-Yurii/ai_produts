
import React, { useState } from 'react';
import { FileText, Send, Download, FileSpreadsheet, Check, FileJson, FileCode } from 'lucide-react';
import { ReportItem } from '../../types';

const ReportsView: React.FC = () => {
  const [reports] = useState<ReportItem[]>([
    { id: '1', title: 'Ежедневный свод цен RO (Топ 50)', date: '27.05.2024 09:00', type: 'PDF', size: '2.4 MB' },
    { id: '2', title: 'Сравнение RTX 4060 vs 4070 (RO/UA)', date: '26.05.2024 14:30', type: 'EXCEL', size: '1.1 MB' },
    { id: '3', title: 'Новые поступления eMAG', date: '26.05.2024 08:00', type: 'CSV', size: '0.5 MB' },
  ]);

  const [sendingId, setSendingId] = useState<string | null>(null);

  const handleSend = (id: string) => {
    setSendingId(id);
    setTimeout(() => setSendingId(null), 2000);
  };

  const generateAndDownloadCSV = (title: string) => {
    const csvContent = "data:text/csv;charset=utf-8,ID,Model,Price_RON,Price_UAH,Link\n1,Asus ROG,6000,54000,http://link.com";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Отчеты и Экспорт</h2>
        <p className="text-slate-500 mt-2 text-lg">Генерация аналитики и выгрузка данных в удобных форматах.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <button className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300 group hover:shadow-xl shadow-sm">
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">PDF Отчет</h3>
          <p className="text-sm text-slate-500 mt-2">Визуальная аналитика с графиками цен</p>
        </button>
        
        <button 
          onClick={() => generateAndDownloadCSV("Full_Market_Export")}
          className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300 group hover:shadow-xl shadow-sm"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
            <FileCode className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">Экспорт в CSV</h3>
          <p className="text-sm text-slate-500 mt-2">Чистые данные для Excel или Google Таблиц</p>
        </button>

        <button className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300 group hover:shadow-xl shadow-sm">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
            <Send className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">Telegram Рассылка</h3>
          <p className="text-sm text-slate-500 mt-2">Отправка мгновенных уведомлений в чат</p>
        </button>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden shadow-md">
        <div className="px-8 py-6 border-b border-slate-200/60 bg-slate-50/50 flex justify-between items-center">
          <span className="font-bold text-slate-800">История генераций</span>
          <button className="text-xs font-semibold text-slate-400 hover:text-red-500 uppercase tracking-wider transition-colors">Очистить историю</button>
        </div>
        <div className="divide-y divide-slate-100">
          {reports.map((report) => (
            <div key={report.id} className="p-6 flex items-center justify-between hover:bg-slate-50/80 transition-colors group">
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                  report.type === 'PDF' ? 'bg-red-50 text-red-600' :
                  report.type === 'CSV' ? 'bg-emerald-50 text-emerald-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {report.type === 'PDF' ? <FileText className="w-6 h-6" /> : 
                   report.type === 'CSV' ? <FileCode className="w-6 h-6" /> :
                   <FileSpreadsheet className="w-6 h-6" />}
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
                 <button 
                   onClick={() => generateAndDownloadCSV(report.title)}
                   className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-white hover:border-slate-300 transition-all"
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
                   <span className="hidden lg:inline">{sendingId === report.id ? 'Отправлено' : 'В Telegram'}</span>
                 </button>
                 
                 <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="Скачать">
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
