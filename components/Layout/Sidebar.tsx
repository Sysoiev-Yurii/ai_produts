
import React from 'react';
import { LayoutDashboard, Bot, Settings, Laptop2, Users, Database, FileText, ShieldAlert } from 'lucide-react';
import { AppView } from '../../types';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  isMobileMenuOpen: boolean;
  closeMobileMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isMobileMenuOpen, closeMobileMenu }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Дашборд', icon: LayoutDashboard },
    { id: AppView.AGENT, label: 'Чат-Агент', icon: Bot },
    { id: AppView.AGENTS_MANAGEMENT, label: 'Управление Агентами', icon: Users },
    { id: AppView.DATABASE, label: 'База Данных', icon: Database },
    { id: AppView.REPORTS, label: 'Отчеты', icon: FileText },
    { id: AppView.ADMIN_PANEL, label: 'Админ-панель', icon: ShieldAlert },
    { id: AppView.SETTINGS, label: 'Настройки', icon: Settings },
  ];

  const baseClasses = "fixed inset-y-0 left-0 z-50 w-72 bg-slate-900/95 backdrop-blur-xl text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:flex md:flex-col border-r border-slate-800";
  const mobileClasses = isMobileMenuOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <>
       {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}

      <div className={`${baseClasses} ${mobileClasses}`}>
        <div className="flex items-center h-24 px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
               <Laptop2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">LaptOptimus</h1>
              <span className="text-xs text-slate-400 font-medium tracking-wider">ИИ МОНИТОРИНГ</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onChangeView(item.id);
                  closeMobileMenu();
                }}
                className={`group flex items-center w-full px-4 py-3.5 text-sm font-medium transition-all rounded-xl relative overflow-hidden ${
                  isActive
                    ? 'text-white shadow-lg shadow-indigo-900/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-100 transition-opacity" />
                )}
                <Icon className={`w-5 h-5 mr-3 relative z-10 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-6">
          <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
               <span className="text-xs font-bold text-white">Статус системы</span>
               <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            </div>
            <div className="text-[10px] text-slate-400 leading-relaxed">
              Модули мониторинга активны.
              <br/>
              API: v2.5 Flash
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
