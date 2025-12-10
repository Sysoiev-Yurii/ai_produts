import React from 'react';
import { TrendingUp, Globe, AlertCircle, Database, Truck, ArrowRight, Activity, Zap } from 'lucide-react';
import { ExchangeSettings } from '../../types';

interface DashboardViewProps {
  settings: ExchangeSettings;
}

const DashboardView: React.FC<DashboardViewProps> = ({ settings }) => {
  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="mb-10">
        <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Обзор рынка</h2>
        <p className="text-slate-500 mt-2 text-lg">Центр управления мониторингом и аналитикой.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {/* Exchange Logic - Modernized */}
        <div className="col-span-1 lg:col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-3xl shadow-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap className="text-white w-48 h-48" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                 <TrendingUp className="text-white w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold text-white">Активная формула цены (RO ➔ UA)</h3>
            </div>

            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-wrap items-center gap-4 text-xl font-mono text-white shadow-inner">
               <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-sans mb-1">База (RON)</span>
                  <span>ЦЕНА_RON</span>
               </div>
               <span className="text-slate-500">×</span>
               <div className="flex flex-col">
                  <span className="text-xs text-yellow-400/80 font-sans mb-1">Коэфф.</span>
                  <span className="text-yellow-400 font-bold">{settings.ronToUsdFactor}</span>
               </div>
               <span className="text-slate-500">×</span>
               <div className="flex flex-col">
                  <span className="text-xs text-emerald-400/80 font-sans mb-1">Курс USD</span>
                  <span className="text-emerald-400 font-bold">{settings.usdBuyRate}</span>
               </div>
               <span className="text-slate-500">+</span>
               <div className="flex flex-col">
                  <span className="text-xs text-blue-400/80 font-sans mb-1">Логистика</span>
                  <span className="text-blue-300 font-bold">{settings.romanianDeliveryRate} ₴</span>
               </div>
            </div>
            
            <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">
               <Activity className="w-4 h-4" />
               <span>Автоматическое обновление курсов отключено (Ручной режим).</span>
            </div>
          </div>
        </div>

        {/* Quick Stats - Glass */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
           <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
           <h3 className="font-bold text-xl mb-6 flex items-center gap-3">
             <Database className="w-6 h-6" />
             База товаров
           </h3>
           <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-4xl font-bold">1,240</div>
                  <div className="text-indigo-200 text-sm mt-1">Всего позиций</div>
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-md">
                   Стабильно
                </div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10 flex justify-between items-center">
                 <span className="text-indigo-100 text-sm">Новых за 24ч</span>
                 <span className="text-2xl font-bold text-emerald-300">+12</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Status Card */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between hover:shadow-lg transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-lg">Мониторинг</h3>
              <Globe className="text-blue-500 w-6 h-6" />
            </div>
            <div className="space-y-3">
               <div className="flex items-center justify-between p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                  <span className="text-sm font-medium text-emerald-900">eMAG.ro</span>
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
               </div>
               <div className="flex items-center justify-between p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                  <span className="text-sm font-medium text-emerald-900">Altex.ro</span>
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
               </div>
               <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-sm font-medium text-slate-500">Rozetka.ua</span>
                  <span className="text-xs font-bold text-slate-400">ПАУЗА</span>
               </div>
            </div>
          </div>
          <button className="mt-6 w-full py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
            Настроить источники
          </button>
        </div>

        {/* Alerts Card */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between hover:shadow-lg transition-shadow">
           <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-lg">Уведомления</h3>
              <AlertCircle className="text-amber-500 w-6 h-6" />
            </div>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              3 новых товара упали в цене более чем на 10% за последние сутки.
            </p>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-xs font-bold">RO</div>
                 <span className="text-sm font-bold text-slate-800">ASUS ROG Strix</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 line-through">6,500 RON</span>
                  <span className="text-sm font-bold text-red-600">5,800 RON</span>
               </div>
            </div>
           </div>
           <button className="mt-6 w-full py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
             Показать все <ArrowRight className="w-4 h-4" />
           </button>
        </div>

        {/* Delivery Card */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between hover:shadow-lg transition-shadow">
           <div>
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-slate-800 text-lg">Логистика</h3>
               <Truck className="text-indigo-500 w-6 h-6" />
             </div>
             <p className="text-sm text-slate-500 mb-6">
               Быстрый расчет доставки без учета таможенных платежей (упрощенная схема).
             </p>
             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500">Следующий рейс:</span>
                 <span className="font-semibold text-slate-800">Пятница, 14:00</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500">Склад Сучава:</span>
                 <span className="font-semibold text-emerald-600">Работает</span>
               </div>
             </div>
           </div>
           <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="py-3 rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-700 text-sm font-semibold hover:bg-indigo-100 transition-colors">
                Тарифы
              </button>
              <button className="py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                Калькулятор
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardView;