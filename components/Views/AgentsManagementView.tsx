import React, { useState } from 'react';
import { Plus, Play, Pause, Trash2, Settings2, Activity, Save, X, Globe, Clock, Bell, ListFilter } from 'lucide-react';
import { AgentConfig } from '../../types';

interface AgentEditorProps {
  agent: AgentConfig | null;
  onClose: () => void;
  onSave: (agent: AgentConfig) => void;
}

// Complex Editor Component for "Max Settings"
const AgentEditor: React.FC<AgentEditorProps> = ({ agent, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'rules' | 'sources' | 'schedule'>('general');
  const [formData, setFormData] = useState<Partial<AgentConfig>>(agent || {
    name: 'Новый Агент',
    type: 'search',
    targetMarket: 'BOTH',
    status: 'active',
    description: ''
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {agent ? `Настройка: ${agent.name}` : 'Создание нового агента'}
            </h3>
            <p className="text-sm text-slate-500 mt-1">Полная конфигурация параметров поиска и мониторинга</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {/* Tabs & Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-64 bg-slate-50 border-r border-slate-100 p-6 flex flex-col gap-2">
            {[
              { id: 'general', label: 'Общие настройки', icon: Settings2 },
              { id: 'rules', label: 'Правила поиска', icon: ListFilter },
              { id: 'sources', label: 'Источники', icon: Globe },
              { id: 'schedule', label: 'Расписание и Уведомления', icon: Clock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                    : 'text-slate-600 hover:bg-white hover:shadow-sm'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Area */}
          <div className="flex-1 overflow-y-auto p-8 bg-white custom-scrollbar">
            {activeTab === 'general' && (
              <div className="space-y-6 max-w-2xl animate-in fade-in duration-300">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Название агента</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Например: Мониторинг RTX 4060"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Тип агента</label>
                      <select 
                        value={formData.type} 
                        onChange={e => setFormData({...formData, type: e.target.value as any})}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      >
                        <option value="monitor">Мониторинг цен</option>
                        <option value="search">Глубокий поиск</option>
                        <option value="analyst">Аналитик конкурентов</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Целевой рынок</label>
                      <select 
                        value={formData.targetMarket} 
                        onChange={e => setFormData({...formData, targetMarket: e.target.value as any})}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      >
                        <option value="RO">Румыния (RO)</option>
                        <option value="UA">Украина (UA)</option>
                        <option value="BOTH">Оба рынка (RO + UA)</option>
                      </select>
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Описание задачи</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Опишите, что именно должен делать этот агент..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'rules' && (
               <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                       <ListFilter className="w-5 h-5 text-blue-500" />
                       Ключевые слова
                    </h4>
                    <div className="space-y-4">
                       <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Включать (AND)</label>
                          <input type="text" placeholder="RTX 4060, Legion, 16GB..." className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
                          <p className="text-xs text-slate-400 mt-1">Товары должны содержать эти слова.</p>
                       </div>
                       <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Исключать (NOT)</label>
                          <input type="text" placeholder="Refurbished, Used, Second hand..." className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-red-500" />
                          <p className="text-xs text-slate-400 mt-1">Игнорировать товары с этими словами.</p>
                       </div>
                    </div>
                  </div>

                  <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50">
                    <h4 className="font-bold text-slate-800 mb-4">Ценовой диапазон</h4>
                    <div className="flex items-center gap-4">
                       <div className="flex-1">
                          <label className="block text-xs font-bold text-slate-500 mb-1">Мин. цена</label>
                          <div className="relative">
                             <input type="number" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none" placeholder="0" />
                             <span className="absolute right-3 top-2 text-xs text-slate-400">USD</span>
                          </div>
                       </div>
                       <span className="text-slate-400 mt-5">—</span>
                       <div className="flex-1">
                          <label className="block text-xs font-bold text-slate-500 mb-1">Макс. цена</label>
                          <div className="relative">
                             <input type="number" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none" placeholder="5000" />
                             <span className="absolute right-3 top-2 text-xs text-slate-400">USD</span>
                          </div>
                       </div>
                    </div>
                  </div>
               </div>
            )}

            {activeTab === 'sources' && (
              <div className="animate-in fade-in duration-300">
                 <h4 className="font-bold text-slate-800 mb-6">Выбор площадок для мониторинга</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['eMAG.ro', 'Altex.ro', 'PCGarage.ro', 'F64.ro', 'Rozetka.ua', 'Moyo.ua', 'Citrus.ua', 'Telemart.ua'].map((site) => (
                       <label key={site} className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-blue-300 transition-all">
                          <input type="checkbox" className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 mr-3" defaultChecked />
                          <div className="flex items-center gap-2">
                             <Globe className="w-4 h-4 text-slate-400" />
                             <span className="font-medium text-slate-700">{site}</span>
                          </div>
                       </label>
                    ))}
                 </div>
                 <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800">
                    <InfoIcon /> Внимание: Некоторые сайты могут требовать использования Proxy-серверов. Настройте их в разделе "Прокси".
                 </div>
              </div>
            )}

            {activeTab === 'schedule' && (
               <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50">
                     <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-indigo-500" />
                        Периодичность запуска
                     </h4>
                     <div className="space-y-4">
                        <input type="range" min="5" max="1440" step="5" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                        <div className="flex justify-between text-xs text-slate-500 font-medium">
                           <span>5 мин</span>
                           <span>30 мин</span>
                           <span>1 час</span>
                           <span>6 часов</span>
                           <span>24 часа</span>
                        </div>
                        <div className="text-center font-bold text-blue-600 text-lg">Каждые 30 минут</div>
                     </div>
                  </div>

                  <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50">
                     <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-amber-500" />
                        Каналы уведомлений
                     </h4>
                     <div className="space-y-3">
                        <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                           <span className="text-slate-700">Telegram Bot</span>
                           <input type="checkbox" className="w-5 h-5 text-blue-600 rounded toggle-checkbox" defaultChecked />
                        </label>
                         <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                           <span className="text-slate-700">Email Отчет</span>
                           <input type="checkbox" className="w-5 h-5 text-blue-600 rounded toggle-checkbox" />
                        </label>
                        <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                           <span className="text-slate-700">Push в браузере</span>
                           <input type="checkbox" className="w-5 h-5 text-blue-600 rounded toggle-checkbox" defaultChecked />
                        </label>
                     </div>
                  </div>
               </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 backdrop-blur-md">
           <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-medium hover:bg-slate-100 transition-colors">
              Отмена
           </button>
           <button 
             onClick={() => { onSave(formData as AgentConfig); onClose(); }} 
             className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2"
           >
              <Save className="w-4 h-4" />
              Сохранить конфигурацию
           </button>
        </div>
      </div>
    </div>
  );
};

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
);


const AgentsManagementView: React.FC = () => {
  const [agents, setAgents] = useState<AgentConfig[]>([
    {
      id: '1',
      name: 'Romanian Price Monitor',
      type: 'monitor',
      targetMarket: 'RO',
      status: 'active',
      lastRun: '10 минут назад',
      description: 'Мониторит eMAG и Altex каждые 30 минут. Сравнивает цены с базой, обновляет таблицу, уведомляет о скидках > 10%.'
    },
    {
      id: '2',
      name: 'UA Competitor Analyzer',
      type: 'analyst',
      targetMarket: 'UA',
      status: 'paused',
      lastRun: '2 дня назад',
      description: 'Ищет аналогичные модели на Rozetka для товаров из Румынского списка.'
    }
  ]);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AgentConfig | null>(null);

  const toggleStatus = (id: string) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id === id) {
        return { ...agent, status: agent.status === 'active' ? 'paused' : 'active' };
      }
      return agent;
    }));
  };

  const deleteAgent = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этого агента?')) {
      setAgents(prev => prev.filter(a => a.id !== id));
    }
  };

  const openEditor = (agent?: AgentConfig) => {
    setEditingAgent(agent || null);
    setIsEditorOpen(true);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {isEditorOpen && (
        <AgentEditor 
          agent={editingAgent} 
          onClose={() => setIsEditorOpen(false)} 
          onSave={(updatedAgent) => {
             // Mock save logic
             if (updatedAgent.id) {
                setAgents(prev => prev.map(a => a.id === updatedAgent.id ? updatedAgent : a));
             } else {
                setAgents(prev => [...prev, { ...updatedAgent, id: Date.now().toString(), lastRun: 'Никогда' }]);
             }
          }}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Управление Агентами</h2>
          <p className="text-slate-500 mt-2 text-lg">Настройка автоматических парсеров, расписаний и правил.</p>
        </div>
        <button 
          onClick={() => openEditor()}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Создать агента
        </button>
      </div>

      <div className="grid gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="glass-panel p-6 rounded-3xl transition-all hover:shadow-xl hover:shadow-slate-200/50 group">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                <div className={`p-4 rounded-2xl shadow-inner ${
                  agent.type === 'monitor' ? 'bg-purple-50 text-purple-600' :
                  agent.type === 'analyst' ? 'bg-orange-50 text-orange-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  <Activity className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-xl text-slate-900">{agent.name}</h3>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${
                       agent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {agent.status === 'active' ? 'Активен' : 'Пауза'}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-2 max-w-3xl leading-relaxed">{agent.description}</p>
                  
                  <div className="flex flex-wrap gap-4 mt-4">
                     <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-500 font-medium">
                        <Globe className="w-3 h-3" />
                        Рынок: {agent.targetMarket === 'BOTH' ? 'RO + UA' : agent.targetMarket}
                     </div>
                     <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-500 font-medium">
                        <Clock className="w-3 h-3" />
                        Посл. запуск: {agent.lastRun}
                     </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => toggleStatus(agent.id)}
                  className={`p-3 rounded-xl border transition-all ${
                    agent.status === 'active' 
                      ? 'border-yellow-200 text-yellow-600 hover:bg-yellow-50' 
                      : 'border-green-200 text-green-600 hover:bg-green-50'
                  }`}
                  title={agent.status === 'active' ? "Приостановить" : "Запустить"}
                >
                  {agent.status === 'active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => openEditor(agent)}
                  className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all" 
                  title="Настройки"
                >
                  <Settings2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => deleteAgent(agent.id)}
                  className="p-3 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 transition-all" 
                  title="Удалить"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentsManagementView;