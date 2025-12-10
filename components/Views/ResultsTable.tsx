import React from 'react';
import { ExternalLink, Flag } from 'lucide-react';
import { LaptopProduct, ExchangeSettings } from '../../types';

interface ResultsTableProps {
  products: LaptopProduct[];
  settings: ExchangeSettings;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ products, settings }) => {
  if (products.length === 0) return null;

  const calculateUAH = (product: LaptopProduct): number => {
    if (product.currency === 'UAH') return product.priceOriginal;
    if (product.currency === 'RON') {
      // Formula: (Price * Factor * Rate) + Fixed Delivery
      return (product.priceOriginal * settings.ronToUsdFactor * settings.usdBuyRate) + settings.romanianDeliveryRate;
    }
    if (product.currency === 'USD') {
      return product.priceOriginal * settings.usdBuyRate;
    }
    return 0;
  };

  return (
    <div className="overflow-hidden border border-slate-200 rounded-xl shadow-sm bg-white mt-4">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
              <th className="p-4 min-w-[200px]">Модель</th>
              <th className="p-4 min-w-[100px]">Страна</th>
              <th className="p-4 min-w-[250px]">Хар-ки (CPU / GPU / RAM)</th>
              <th className="p-4 text-right min-w-[120px]">Цена (Ориг.)</th>
              <th className="p-4 text-right min-w-[120px] bg-blue-50/50">Цена (UAH)</th>
              <th className="p-4 text-center min-w-[80px]">Ссылка</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {products.map((product) => {
              const uahPrice = calculateUAH(product);
              return (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">
                    <div className="flex flex-col">
                      <span>{product.modelName}</span>
                      <span className="text-xs text-slate-400 font-normal">{product.storeName}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
                      product.country === 'RO' 
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200' 
                        : 'bg-blue-100 text-blue-800 border-blue-200'
                    }`}>
                      <Flag className="w-3 h-3 mr-1" />
                      {product.country === 'RO' ? 'Румыния' : 'Украина'}
                    </span>
                  </td>
                  <td className="p-4 text-xs">
                    <div className="grid grid-cols-1 gap-1">
                      <span className="truncate" title={product.specs.cpu}><strong>CPU:</strong> {product.specs.cpu}</span>
                      <span className="truncate" title={product.specs.gpu}><strong>GPU:</strong> {product.specs.gpu}</span>
                      <span><strong>RAM:</strong> {product.specs.ram} | <strong>SSD:</strong> {product.specs.storage}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono">
                    {product.priceOriginal.toLocaleString()} {product.currency}
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-blue-700 bg-blue-50/30">
                    {uahPrice > 0 ? `~${Math.round(uahPrice).toLocaleString()}` : 'Н/Д'} ₴
                  </td>
                  <td className="p-4 text-center">
                    <a 
                      href={product.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-8 h-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;