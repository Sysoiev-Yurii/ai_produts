
import React from 'react';
import { TrendingUp, Globe, AlertCircle, Database, Truck, ArrowRight, Activity, Zap, CheckCircle2 } from 'lucide-react';
import { ExchangeSettings } from '../../types';

interface DashboardViewProps {
  settings: ExchangeSettings;
}

const DashboardView: React.FC<DashboardViewProps> = ({ settings }) => {
  return (
    <div className="p-8 max-w-[1600px] mx-auto h-full overflow-y-auto custom-scrollbar">
      <div className="mb-10">
        <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Обзор рынка</h2>
        <p className="text-slate-500 mt-2 text-lg font-medium">Ваш центр управления ИИ-мониторингом и логистикой.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {/* Модернизированная карточка формулы */}
        <div className="col-span-1 lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
           <div className="absolute -top-20 -right-20 p-8 opacity-10 group-hover:opacity-20 transition-all duration-700 rotate-12">
            <Zap className="text-white w-64 h-64" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
               <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10">
                 <TrendingUp className="text-white w-6 h-6" />
               </div>
               <h3 className="text-2xl font-bold text-white tracking-wide">Формула цены: RO ➔ UA</h3>
            </div>

            <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-wrap items-center justify-between gap-6 text-2xl font-mono text-white shadow-2xl ring-1 ring-white/5">
               <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-sans font-bold uppercase tracking-widest mb-2">Цена (RON)</span>
                  <span className="text-slate-300">PRICE_RON</span>
               </div>
               <span className="text-slate-600 text-4xl">×</span>
               <div className="flex flex-col">
                  <span className="text-xs text-yellow-400/80 font-sans font-bold uppercase tracking-widest mb-2">Коэфф. USD</span>
                  <span className="text-yellow-400 font-black">{settings.ronToUsdFactor}</span>
               </div>
               <span className="text-slate-600 text-4xl">×</span>
               <div className="flex flex-col">
                  <span className="text-xs text-emerald-400/80 font-sans font-bold uppercase tracking-widest mb-2">Курс (UAH)</span>
                  <span className="text-emerald-400 font-black">{settings.usdBuyRate}</span>
               </div>
               <span className="text-slate-600 text-4xl">+</span>
               <div className="flex flex-col">
                  <span className="text-xs text-blue-400/80 font-sans font-bold uppercase tracking-widest mb-2">Логистика</span>
                  <span className="text-blue-300 font-black">{settings.romanianDeliveryRate} ₴</span>
               </div>
            </div>
            
            <div className="mt-8 flex items-center gap-2 text-sm text-slate-400 bg-white/5 w-fit px-4 py-2 rounded-full border border-white/5">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <span>Система активна. Обновление курсов через 12 минут.</span>
            </div>
          </div>
        </div>

        {/* Статистика базы */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
           <h3 className="font-bold text-xl mb-8 flex items-center gap-3">
             <Database className="w-6 h-6" />
             База товаров
           </h3>
           <div className="space-y-8 relative z-10">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-5xl font-black tracking-tighter">1,240</div>
                  <div className="text-indigo-100 text-sm font-medium mt-2">Позиций в базе</div>
                </div>
                <div className="bg-emerald-500/20 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold border border-emerald-500/30 backdrop-blur-md">
                   СТАБИЛЬНО
                </div>
              </div>
              
              <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm border border-white/10 flex justify-between items-center group-hover:bg-white/15 transition-all">
                 <span className="text-indigo-50 text-sm font-medium">Новых за 24ч</span>
                 <span className="text-3xl font-black text-emerald-300">+12</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
        {/* Статус мониторинга */}
        <div className="glass-panel p-8 rounded-[2rem] flex flex-col justify-between hover:shadow-xl transition-all duration-300 border border-white/40 shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 text-lg">Мониторинг</h3>
              <Globe className="text-blue-500 w-6 h-6" />
            </div>
            <div className="space-y-3">
               {[
                 { name: 'eMAG.ro', status: 'online' },
                 { name: 'Altex.ro', status: 'online' },
                 { name: 'Rozetka.ua', status: 'paused' }
               ].map((site) => (
                 <div key={site.name} className={`flex items-center justify-between p-4 rounded-2xl border ${
                   site.status === 'online' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100 opacity-60'
                 }`}>
                    <span className={`text-sm font-bold ${site.status === 'online' ? 'text-emerald-900' : 'text-slate-500'}`}>{site.name}</span>
                    {site.status === 'online' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Online</span>
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ПАУЗА</span>
                    )}
                 </div>
               ))}
            </div>
          </div>
          <button className="mt-8 w-full py-4 rounded-2xl border-2 border-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-50 hover:border-blue-100 hover:text-blue-600 transition-all">
            Настроить источники
          </button>
        </div>

        {/* Уведомления */}
        <div className="glass-panel p-8 rounded-[2rem] flex flex-col justify-between hover:shadow-xl transition-all duration-300 border border-white/40 shadow-sm">
           <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 text-lg">Уведомления</h3>
              <AlertCircle className="text-amber-500 w-6 h-6" />
            </div>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed font-medium">
              3 товара упали в цене более чем на <span className="text-red-500 font-bold">10%</span> за последние сутки.
            </p>
            <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100 group cursor-pointer hover:bg-amber-100/50 transition-colors">
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-xs font-black text-slate-800">RO</div>
                 <div className="flex-1">
                    <span className="text-sm font-bold text-slate-800 block truncate">ASUS ROG Strix G16</span>
                    <span className="text-[10px] text-amber-600 font-bold uppercase">Акция eMAG</span>
                 </div>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 line-through font-mono">6,500 RON</span>
                  <span className="text-lg font-black text-red-600 font-mono tracking-tighter">5,800 RON</span>
               </div>
            </div>
           </div>
           <button className="mt-8 w-full py-4 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10">
             Все уведомления <ArrowRight className="w-4 h-4" />
           </button>
        </div>

        {/* Логистика */}
        <div className="glass-panel p-8 rounded-[2rem] flex flex-col justify-between hover:shadow-xl transition-all duration-300 border border-white/40 shadow-sm">
           <div>
             <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-slate-800 text-lg">Логистика</h3>
               <Truck className="text-indigo-500 w-6 h-6" />
             </div>
             <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">
               Расчет доставки и статус склада в Сучаве.
             </p>
             <div className="space-y-4">
               <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Следующий рейс</span>
                 <span className="font-bold text-slate-800 text-sm">Пятница, 14:00</span>
               </div>
               <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                 <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Склад Сучава</span>
                 <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span className="font-bold text-emerald-700 text-sm">Прием активен</span>
                 </div>
               </div>
             </div>
           </div>
           <div className="mt-8 grid grid-cols-2 gap-4">
              <button className="py-4 rounded-2xl border-2 border-indigo-50 bg-indigo-50/30 text-indigo-700 text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors">
                Тарифы
              </button>
              <button className="py-4 rounded-2xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
                Калькулятор
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
