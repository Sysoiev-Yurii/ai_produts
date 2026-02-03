
import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Download, ExternalLink, Clock, LineChart, X, ChevronRight, TrendingDown } from 'lucide-react';
import { DatabaseItem, ExchangeSettings } from '../../types';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface DatabaseViewProps {
  settings: ExchangeSettings;
}

const DatabaseView: React.FC<DatabaseViewProps> = ({ settings }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showChart, setShowChart] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Mock Database Data with Price History
  const [items] = useState<DatabaseItem[]>([
    {
      id: 'db-1',
      modelName: 'ASUS ROG Strix G16 G614JV',
      specs: { cpu: 'i7-13650HX', gpu: 'RTX 4060', ram: '16GB', storage: '512GB', screen: '16" FHD+' },
      priceOriginal: 6499,
      currency: 'RON',
      storeName: 'eMAG.ro',
      country: 'RO',
      link: '#',
      status: 'updated',
      lastChecked: '10 мин назад',
      inStock: true,
      priceHistory: [
        { date: '20.05', price: 6800 },
        { date: '22.05', price: 6750 },
        { date: '24.05', price: 6600 },
        { date: '27.05', price: 6499 },
      ]
    },
    {
      id: 'db-2',
      modelName: 'Lenovo Legion Slim 5 16APH8',
      specs: { cpu: 'Ryzen 7 7840HS', gpu: 'RTX 4060', ram: '16GB', storage: '1TB', screen: '16" WQXGA' },
      priceOriginal: 5800,
      currency: 'RON',
      storeName: 'Altex',
      country: 'RO',
      link: '#',
      status: 'new',
      lastChecked: '30 мин назад',
      inStock: true,
      priceHistory: [
        { date: '20.05', price: 5800 },
        { date: '24.05', price: 5800 },
        { date: '27.05', price: 5800 },
      ]
    },
    {
      id: 'db-3',
      modelName: 'Acer Nitro 16 AN16-41',
      specs: { cpu: 'Ryzen 7 7735HS', gpu: 'RTX 4050', ram: '16GB', storage: '512GB', screen: '16" 165Hz' },
      priceOriginal: 42000,
      currency: 'UAH',
      storeName: 'Rozetka',
      country: 'UA',
      link: '#',
      status: 'stable',
      lastChecked: '1 час назад',
      inStock: true,
      priceHistory: [
        { date: '20.05', price: 44000 },
        { date: '22.05', price: 43500 },
        { date: '25.05', price: 42000 },
        { date: '27.05', price: 42000 },
      ]
    },
    {
      id: 'db-4',
      modelName: 'HP Omen 16',
      specs: { cpu: 'i5-13500HX', gpu: 'RTX 4050', ram: '16GB', storage: '512GB', screen: '16.1"' },
      priceOriginal: 5200,
      currency: 'RON',
      storeName: 'PC Garage',
      country: 'RO',
      link: '#',
      status: 'deleted',
      lastChecked: 'Вчера',
      inStock: false
    }
  ]);

  const getPriceInUah = (item: DatabaseItem) => {
    if (item.currency === 'UAH') return item.priceOriginal;
    if (item.currency === 'RON') {
      return (item.priceOriginal * settings.ronToUsdFactor * settings.usdBuyRate) + settings.romanianDeliveryRate;
    }
    return 0;
  };

  const getStatusBadge = (status: string, inStock: boolean) => {
    if (!inStock) return <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider">Нет в наличии</span>;
    switch(status) {
      case 'new': return <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-wider">Новый</span>;
      case 'updated': return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider">Цена изменилась</span>;
      default: return <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider">Стабильно</span>;
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (showChart && chartRef.current && selectedIds.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const selectedItems = items.filter(i => selectedIds.includes(i.id) && i.priceHistory);
      
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: selectedItems[0]?.priceHistory?.map(p => p.date) || [],
            datasets: selectedItems.map((item, idx) => ({
              label: item.modelName,
              data: item.priceHistory?.map(p => p.price) || [],
              borderColor: [
                'rgb(79, 70, 229)', 
                'rgb(16, 185, 129)', 
                'rgb(245, 158, 11)', 
                'rgb(239, 68, 68)'
              ][idx % 4],
              backgroundColor: 'transparent',
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 4,
              pointBackgroundColor: '#fff',
              pointBorderWidth: 2,
            }))
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20, font: { family: 'Plus Jakarta Sans', weight: 'bold' } } },
              tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                padding: 12,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
                cornerRadius: 8,
                displayColors: true
              }
            },
            scales: {
              y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { weight: 'bold' } } },
              x: { grid: { display: false }, ticks: { font: { weight: 'bold' } } }
            }
          }
        });
      }
    }
  }, [showChart, selectedIds, items]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto h-full flex flex-col relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">База Данных</h2>
          <p className="text-slate-500 font-medium">Мониторинг цен в режиме реального времени.</p>
        </div>
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <button 
              onClick={() => setShowChart(true)}
              className="flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 font-bold"
            >
              <LineChart className="w-4 h-4 mr-2" />
              График ({selectedIds.length})
            </button>
          )}
          <button className="flex items-center px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-bold transition-all shadow-sm">
            <Filter className="w-4 h-4 mr-2" />
            Фильтры
          </button>
          <button className="flex items-center px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-bold transition-all shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            CSV
          </button>
        </div>
      </div>

      {/* Chart Overlay Panel */}
      {showChart && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
           <div className="bg-white rounded-[2.5rem] w-full max-w-5xl h-[60vh] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div>
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                       <TrendingDown className="w-5 h-5 text-indigo-600" />
                       Динамика изменения цен
                    </h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Сравнение выбранных моделей</p>
                 </div>
                 <button onClick={() => setShowChart(false)} className="p-3 hover:bg-slate-200 rounded-2xl transition-all">
                    <X className="w-6 h-6 text-slate-400" />
                 </button>
              </div>
              <div className="flex-1 p-8">
                 <canvas ref={chartRef}></canvas>
              </div>
           </div>
        </div>
      )}

      <div className="bg-white/70 backdrop-blur-md border border-slate-200 rounded-[2rem] shadow-xl flex-1 overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Поиск по модели, CPU, GPU..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-100/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all font-medium"
            />
          </div>
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4">
               <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Выбрано: {selectedIds.length}</span>
               <button onClick={() => setSelectedIds([])} className="text-sm font-black text-red-500 hover:text-red-600 transition-colors uppercase">Сбросить</button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 sticky top-0 z-10">
              <tr className="text-[10px] uppercase text-slate-400 font-black tracking-[0.15em] border-b border-slate-100">
                <th className="p-6 w-12 text-center">
                   <input 
                     type="checkbox" 
                     className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                     onChange={(e) => {
                       if (e.target.checked) setSelectedIds(items.map(i => i.id));
                       else setSelectedIds([]);
                     }}
                     checked={selectedIds.length === items.length}
                   />
                </th>
                <th className="p-6">Статус</th>
                <th className="p-6">Модель / Источник</th>
                <th className="p-6">Характеристики</th>
                <th className="p-6 text-right">Ориг. Цена</th>
                <th className="p-6 text-right bg-indigo-50/30 text-indigo-900">Цена (UAH)</th>
                <th className="p-6 text-center">Анализ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {items.map((item) => (
                <tr 
                  key={item.id} 
                  className={`hover:bg-slate-50/80 transition-all group ${selectedIds.includes(item.id) ? 'bg-indigo-50/30' : ''}`}
                  onClick={() => toggleSelection(item.id)}
                >
                  <td className="p-6 text-center" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelection(item.id)}
                    />
                  </td>
                  <td className="p-6 whitespace-nowrap">
                    {getStatusBadge(item.status, item.inStock)}
                  </td>
                  <td className="p-6">
                    <div className="font-bold text-slate-900 text-base">{item.modelName}</div>
                    <div className="text-[11px] text-slate-400 font-bold flex items-center gap-2 mt-1 uppercase tracking-wider">
                      {item.country === 'RO' ? <span className="text-base">🇷🇴</span> : <span className="text-base">🇺🇦</span>}
                      {item.storeName}
                    </div>
                  </td>
                  <td className="p-6 text-[11px] text-slate-500 font-bold uppercase tracking-tight">
                     <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                       <span title="CPU" className="flex items-center gap-2 truncate text-slate-700">
                         <ChevronRight className="w-3 h-3 text-indigo-400" /> {item.specs.cpu}
                       </span>
                       <span title="GPU" className="flex items-center gap-2 truncate text-slate-700">
                         <ChevronRight className="w-3 h-3 text-indigo-400" /> {item.specs.gpu}
                       </span>
                       <span title="RAM" className="flex items-center gap-2 text-slate-700">
                         <ChevronRight className="w-3 h-3 text-indigo-400" /> {item.specs.ram}
                       </span>
                       <span title="Экран" className="flex items-center gap-2 text-slate-700">
                         <ChevronRight className="w-3 h-3 text-indigo-400" /> {item.specs.screen}
                       </span>
                     </div>
                  </td>
                  <td className="p-6 text-right font-mono text-slate-700 font-bold">
                    {item.priceOriginal.toLocaleString()} {item.currency}
                  </td>
                  <td className="p-6 text-right font-mono font-black text-indigo-700 bg-indigo-50/20 text-base">
                    {Math.round(getPriceInUah(item)).toLocaleString()} ₴
                  </td>
                  <td className="p-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        {item.lastChecked}
                      </div>
                      <a 
                        href={item.link} 
                        onClick={(e) => e.stopPropagation()}
                        className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md rounded-xl transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DatabaseView;
