
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Layout/Sidebar';
import DashboardView from './components/Views/DashboardView';
import AgentView from './components/Views/AgentView';
import SettingsView from './components/Views/SettingsView';
import AgentsManagementView from './components/Views/AgentsManagementView';
import DatabaseView from './components/Views/DatabaseView';
import ReportsView from './components/Views/ReportsView';
import AdminPanelView from './components/Views/AdminPanelView';
import { AppView, ExchangeSettings } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Default Settings
  const [settings, setSettings] = useState<ExchangeSettings>({
    usdBuyRate: 41.5, // Approx current UAH rate
    ronToUsdFactor: 0.22,
    romanianDeliveryRate: 400 // Default ~10 EUR/USD fixed delivery for lists
  });

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <DashboardView settings={settings} />;
      case AppView.AGENT:
        return <AgentView settings={settings} />;
      case AppView.AGENTS_MANAGEMENT:
        return <AgentsManagementView />;
      case AppView.DATABASE:
        return <DatabaseView settings={settings} />;
      case AppView.REPORTS:
        return <ReportsView />;
      case AppView.ADMIN_PANEL:
        return <AdminPanelView />;
      case AppView.SETTINGS:
        return <SettingsView settings={settings} onUpdateSettings={setSettings} />;
      default:
        return <DashboardView settings={settings} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView}
        isMobileMenuOpen={isMobileMenuOpen}
        closeMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 h-16 flex items-center px-4 flex-shrink-0 z-30">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-4 font-bold text-slate-800">LaptOptimus</span>
        </header>

        <main className="flex-1 overflow-auto relative">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
