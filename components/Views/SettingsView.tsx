import React from 'react';
import { Save, RefreshCw, Truck } from 'lucide-react';
import { ExchangeSettings } from '../../types';

interface SettingsViewProps {
  settings: ExchangeSettings;
  onUpdateSettings: (newSettings: ExchangeSettings) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdateSettings }) => {
  const [localSettings, setLocalSettings] = React.useState(settings);
  const [saved, setSaved] = React.useState(false);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Конфигурация</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
             <RefreshCw className="w-5 h-5 text-blue-500" />
             Настройки курса и доставки
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Настройте формулу конвертации цены из Румынии (RON) в Украину (UAH).
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Коэффициент RON к USD
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={localSettings.ronToUsdFactor}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, ronToUsdFactor: parseFloat(e.target.value) }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <span className="absolute right-3 top-2 text-slate-400 text-sm">USD</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Фиксированный коэфф. (По умолч.: 0.22)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Курс покупки USD (UAH)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={localSettings.usdBuyRate}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, usdBuyRate: parseFloat(e.target.value) }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <span className="absolute right-3 top-2 text-slate-400 text-sm">UAH</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Рыночный курс покупки доллара
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Фикс. доставка из Румынии (для таблиц)
            </label>
            <div className="relative">
              <input
                type="number"
                step="1"
                value={localSettings.romanianDeliveryRate}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, romanianDeliveryRate: parseFloat(e.target.value) }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <span className="absolute right-3 top-2 text-slate-400 text-sm">UAH</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Добавляется к цене каждого товара из Румынии в списках и поиске.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Предпросмотр формулы:</h4>
          <p className="font-mono text-sm text-blue-900 break-all">
            Цена(UAH) = (Цена(RON) × {localSettings.ronToUsdFactor} × {localSettings.usdBuyRate}) + {localSettings.romanianDeliveryRate}
          </p>
          <p className="text-sm text-blue-700 mt-2">
            Пример: 1000 RON = <strong>{((1000 * localSettings.ronToUsdFactor * localSettings.usdBuyRate) + localSettings.romanianDeliveryRate).toLocaleString()} UAH</strong>
          </p>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all ${
              saved 
                ? 'bg-green-600 text-white' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Save className="w-4 h-4 mr-2" />
            {saved ? 'Сохранено!' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;