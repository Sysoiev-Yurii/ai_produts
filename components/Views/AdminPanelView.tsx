
import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Cpu, 
  Database, 
  Activity, 
  Globe, 
  Zap, 
  HardDrive, 
  ShieldCheck, 
  Terminal,
  RefreshCw,
  Trash2,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { getProjectManagerInsights } from '../../services/geminiService';

const AdminPanelView: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const stats = {
    uptime: '99.98%',
    quota: '4.2k / 10k',
    latency: '340ms',
    dbHealth: 'Optimal'
  };

  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    const insight = await getProjectManagerInsights(stats);
    setAiInsight(insight);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    runAiAnalysis();
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto h-full overflow-y-auto custom-scrollbar">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Админ-панель</h2>
          <p className="text-slate-500 mt-1 text-lg font-medium">Контроль ресурсов и отчеты ИИ-Менеджера.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Перезагрузить модули
          </button>
          <button className="flex items-center px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl">
            <Terminal className="w-4 h-4 mr-2" />
            Консоль
          </button>
        </div>
      </div>

      {/* AI Manager Insights Section */}
      <div className="mb-8 p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem]">
         <div className="bg-white rounded-[2.4rem] p-8 flex flex-col md:flex-row items-center gap-8 shadow-inner">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200">
               <Sparkles className="text-white w-10 h-10 animate-pulse" />
            </div>
            <div className="flex-1">
               <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">AI Insights</span>
                  <span className="text-sm font-bold text-slate-800">Отчет Агента-Менеджера</span>
               </div>
               {isAnalyzing ? (
                 <div className="flex items-center gap-2 text-slate-400">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span className="text-sm italic">Агент анализирует показатели системы...</span>
                 </div>
               ) : (
                 <p className="text-slate-700 font-medium leading-relaxed italic text-lg">
                   "{aiInsight || 'Все системы работают в штатном режиме. Конфликтов между парсерами не обнаружено.'}"
                 </p>
               )}
            </div>
            <button 
              onClick={runAiAnalysis}
              className="px-6 py-3 border border-indigo-100 bg-indigo-50 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-100 transition-all flex items-center gap-2"
            >
              Обновить отчет
              <ChevronRight className="w-4 h-4" />
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Uptime', value: stats.uptime, icon: Clock, color: 'text-emerald-500' },
          { label: 'API Quota', value: stats.quota, icon: Zap, color: 'text-amber-500' },
          { label: 'Active Proxies', value: '18 / 20', icon: Globe, color: 'text-blue-500' },
          { label: 'DB Health', value: stats.dbHealth, icon: ShieldCheck, color: 'text-indigo-500' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-3xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 glass-panel rounded-[2.5rem] p-8 border border-white/50 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <Cpu className="w-6 h-6 text-indigo-600" />
              Инфраструктура и Ресурсы
            </h3>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">Real-time stats</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-bold text-slate-600">Нагрузка CPU</span>
                  <span className="text-sm font-black text-indigo-600">24%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-bold text-slate-600">Использование RAM</span>
                  <span className="text-sm font-black text-blue-600">1.2 GB / 4.0 GB</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-bold text-slate-600">API Latency (Gemini)</span>
                  <span className="text-sm font-black text-emerald-600">{stats.latency}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/5 rounded-3xl p-6 border border-slate-200/50 flex flex-col justify-between">
               <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <Server className="w-6 h-6 text-slate-700" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">Node Cluster: EU-1</div>
                    <div className="text-[10px] font-bold text-emerald-500 uppercase">Operational</div>
                  </div>
               </div>
               <div className="space-y-2">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Threads</div>
                  <div className="flex gap-1">
                    {[80, 40, 60, 90, 30, 50, 70, 40, 60, 80].map((h, i) => (
                      <div key={i} className="flex-1 bg-indigo-200 rounded-sm hover:bg-indigo-500 transition-colors cursor-help" style={{ height: `${h / 2}px` }}></div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-[2.5rem] p-8 border border-white/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                <Database className="w-6 h-6 text-emerald-600" />
                DB Admin
              </h3>
            </div>
            <div className="space-y-4">
               <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HardDrive className="w-5 h-5 text-slate-400" />
                    <div>
                      <div className="text-sm font-bold text-slate-800">Total Entries</div>
                      <div className="text-xs text-slate-500">12,402 records</div>
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>
               <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="text-sm font-bold text-slate-800 mb-2">Storage Usage</div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: '42%' }}></div>
                    </div>
                    <span className="text-xs font-black text-slate-600">42%</span>
                  </div>
               </div>
            </div>
          </div>
          <button className="mt-8 w-full py-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 font-bold hover:bg-emerald-100 transition-all flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Оптимизировать индексы
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelView;
