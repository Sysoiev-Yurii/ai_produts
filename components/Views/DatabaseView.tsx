import React, { useState } from 'react';
import { Search, Filter, Download, ExternalLink, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { DatabaseItem, ExchangeSettings } from '../../types';

interface DatabaseViewProps {
  settings: ExchangeSettings;
}

const DatabaseView: React.FC<DatabaseViewProps> = ({ settings }) => {
  // Mock Database Data
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
      inStock: true
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
      inStock: true
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
      inStock: true
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
      status: 'deleted', // Out of stock logic
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
    if (!inStock) return <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">НЕТ В НАЛИЧИИ</span>;
    switch(status) {
      case 'new': return <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">НОВЫЙ</span>;
      case 'updated': return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">ИЗМЕНЕНИЕ ЦЕНЫ</span>;
      default: return <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">АКТУАЛЬНО</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">База Данных</h2>
          <p className="text-slate-500">Автоматически обновляемый список товаров от агентов.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">
            <Filter className="w-4 h-4 mr-2" />
            Фильтры
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Экспорт CSV
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Поиск по модели, CPU, GPU..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr className="text-xs uppercase text-slate-500 font-semibold tracking-wider border-b border-slate-200">
                <th className="p-4">Статус</th>
                <th className="p-4">Модель / Магазин</th>
                <th className="p-4">Характеристики</th>
                <th className="p-4 text-right">Цена (Orig)</th>
                <th className="p-4 text-right bg-blue-50/50">Цена (UAH)</th>
                <th className="p-4">Проверка</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 whitespace-nowrap">
                    {getStatusBadge(item.status, item.inStock)}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-slate-900">{item.modelName}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      {item.country === 'RO' ? '🇷🇴' : '🇺🇦'} {item.storeName}
                    </div>
                  </td>
                  <td className="p-4 text-xs text-slate-600">
                     <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                       <span title="CPU">🖥 {item.specs.cpu}</span>
                       <span title="GPU">🎮 {item.specs.gpu}</span>
                       <span title="RAM">💾 {item.specs.ram}</span>
                       <span title="Экран">Экран: {item.specs.screen}</span>
                     </div>
                  </td>
                  <td className="p-4 text-right font-mono text-slate-700">
                    {item.priceOriginal.toLocaleString()} {item.currency}
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-blue-700 bg-blue-50/30">
                    {Math.round(getPriceInUah(item)).toLocaleString()} ₴
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      {item.lastChecked}
                      <a href={item.link} className="ml-2 text-blue-500 hover:underline"><ExternalLink className="w-4 h-4" /></a>
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