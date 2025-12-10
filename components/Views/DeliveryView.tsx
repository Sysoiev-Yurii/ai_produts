import React, { useState, useEffect } from 'react';
import { Truck, Package, Calculator, Info, ShieldCheck, Plane, CheckCircle2 } from 'lucide-react';
import { ExchangeSettings } from '../../types';

interface DeliveryViewProps {
  settings: ExchangeSettings;
}

const DeliveryView: React.FC<DeliveryViewProps> = ({ settings }) => {
  const [weight, setWeight] = useState(2.5); // kg
  const [priceRon, setPriceRon] = useState(5000); // RON
  const [insurance, setInsurance] = useState(true);
  const [includeCustoms, setIncludeCustoms] = useState(false); // Default false: "Adds only cost"
  
  // Constants
  const SHIPPING_RATE_PER_KG = 3; // Euro per kg (approx)
  const BASE_FEE = 10; // Euro
  const CUSTOMS_LIMIT_EUR = 150;
  const VAT_UA = 0.20; // 20%
  const DUTY_UA = 0.10; // 10%

  const [result, setResult] = useState({
    shippingCost: 0,
    customsFee: 0,
    totalUah: 0
  });

  useEffect(() => {
    // 1. Calculate Product Price in EUR (approx rate 4.97 RON = 1 EUR)
    const priceEur = priceRon / 4.97;
    
    // 2. Shipping Cost
    const shippingEur = BASE_FEE + (weight * SHIPPING_RATE_PER_KG) + (insurance ? priceEur * 0.01 : 0);
    
    // 3. Customs (if > 150 EUR and ENABLED)
    let customsEur = 0;
    if (includeCustoms && priceEur > CUSTOMS_LIMIT_EUR) {
      const excess = priceEur - CUSTOMS_LIMIT_EUR;
      const duty = excess * DUTY_UA;
      const vat = (excess + duty) * VAT_UA;
      customsEur = duty + vat;
    }

    // 4. Total to UAH
    const priceInUah = priceRon * settings.ronToUsdFactor * settings.usdBuyRate;
    
    // Shipping & Customs in UAH (assuming 1 EUR ~ 45 UAH for calculation context)
    const eurRate = 45; 
    
    const shippingUah = shippingEur * eurRate;
    const customsUah = customsEur * eurRate;
    const totalUah = priceInUah + shippingUah + customsUah;

    setResult({
      shippingCost: shippingUah,
      customsFee: customsUah,
      totalUah
    });
  }, [weight, priceRon, insurance, includeCustoms, settings]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Калькулятор Логистики</h2>
        <p className="text-slate-500 mt-2 text-lg">Расчет стоимости доставки (RO ➔ UA) для оптовых и розничных партий.</p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Left Column: Calculator Inputs */}
        <div className="md:col-span-7 glass-panel p-8 rounded-3xl shadow-sm">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200/60">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
               <Calculator className="w-5 h-5" />
            </div>
            <div>
               <h3 className="font-bold text-lg text-slate-800">Параметры груза</h3>
               <p className="text-xs text-slate-500">Введите данные посылки</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Цена товара (RON)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={priceRon}
                    onChange={(e) => setPriceRon(Number(e.target.value))}
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-lg"
                  />
                  <span className="absolute right-4 top-3.5 text-slate-400 text-sm font-medium">RON</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Вес (кг)</label>
                <div className="relative">
                   <input 
                    type="number" 
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-lg"
                  />
                  <span className="absolute right-4 top-3.5 text-slate-400 text-sm font-medium">КГ</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 space-y-4 border border-slate-100">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer ${insurance ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                      <input 
                        type="checkbox" 
                        id="ins"
                        checked={insurance}
                        onChange={(e) => setInsurance(e.target.checked)}
                        className="opacity-0 w-full h-full cursor-pointer"
                      />
                      {insurance && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                   </div>
                   <label htmlFor="ins" className="text-sm font-medium text-slate-700 cursor-pointer select-none">Страхование груза</label>
                 </div>
                 <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">1%</span>
               </div>

               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer ${includeCustoms ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                      <input 
                        type="checkbox" 
                        id="customs"
                        checked={includeCustoms}
                        onChange={(e) => setIncludeCustoms(e.target.checked)}
                        className="opacity-0 w-full h-full cursor-pointer"
                      />
                      {includeCustoms && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                   </div>
                   <label htmlFor="customs" className="text-sm font-medium text-slate-700 cursor-pointer select-none flex items-center gap-2">
                      Таможенная очистка
                      {!includeCustoms && <span className="text-xs font-normal text-slate-400">(Только доставка)</span>}
                   </label>
                 </div>
                 <ShieldCheck className={`w-4 h-4 ${includeCustoms ? 'text-blue-500' : 'text-slate-300'}`} />
               </div>
            </div>

            {!includeCustoms && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 text-amber-800 text-xs rounded-xl border border-amber-100">
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <p>
                  Выбран режим <strong>"Только доставка"</strong>. Растаможка не включена в расчет. Подходит для личного использования или "серых" схем до 150 евро.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Receipt */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden ring-1 ring-white/10">
             <div className="absolute right-0 top-0 p-6 opacity-5 rotate-12">
               <Plane className="w-40 h-40" />
             </div>
             
             <div className="relative z-10">
               <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                 <Package className="w-5 h-5 text-indigo-400" />
                 Итоговый расчет
               </h3>
               
               <div className="space-y-4">
                 <div className="flex justify-between items-center text-slate-300 text-sm">
                   <span>Стоимость товара:</span>
                   <span className="font-mono text-white">{Math.round(result.totalUah - result.shippingCost - result.customsFee).toLocaleString()} ₴</span>
                 </div>
                 <div className="flex justify-between items-center text-indigo-200 text-sm">
                   <span>Доставка + Страховка:</span>
                   <span className="font-mono font-bold text-indigo-300">+ {Math.round(result.shippingCost).toLocaleString()} ₴</span>
                 </div>
                 {result.customsFee > 0 && (
                   <div className="flex justify-between items-center text-red-300 text-sm">
                     <span>Таможенные сборы:</span>
                     <span className="font-mono">+ {Math.round(result.customsFee).toLocaleString()} ₴</span>
                   </div>
                 )}
                 
                 <div className="h-px bg-white/10 my-6"></div>
                 
                 <div>
                   <span className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Итого к оплате</span>
                   <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-white tracking-tight">{Math.round(result.totalUah).toLocaleString()}</span>
                      <span className="text-xl text-slate-400 font-medium">₴</span>
                   </div>
                 </div>
               </div>
             </div>
          </div>

          <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all font-bold text-base flex items-center justify-center gap-2 group">
             <Truck className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             Создать заявку на доставку
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryView;