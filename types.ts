export enum AppView {
  DASHBOARD = 'DASHBOARD',
  AGENT = 'AGENT',
  SETTINGS = 'SETTINGS',
  AGENTS_MANAGEMENT = 'AGENTS_MANAGEMENT',
  DATABASE = 'DATABASE',
  REPORTS = 'REPORTS',
  DELIVERY = 'DELIVERY',
}

export interface ExchangeSettings {
  usdBuyRate: number; // The rate to multiply USD by to get UAH (e.g., 41.5)
  ronToUsdFactor: number; // Default 0.22 as requested
  romanianDeliveryRate: number; // Fixed delivery cost in UAH for RO products
}

export interface LaptopProduct {
  id: string;
  modelName: string;
  specs: {
    cpu: string;
    ram: string;
    storage: string;
    gpu: string;
    screen: string;
  };
  priceOriginal: number;
  currency: string;
  storeName: string;
  country: string;
  link: string;
  notes?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  data?: LaptopProduct[];
  sources?: { title: string; uri: string }[];
}

export interface AgentConfig {
  id: string;
  name: string;
  type: 'monitor' | 'search' | 'analyst';
  targetMarket: 'RO' | 'UA' | 'BOTH';
  status: 'active' | 'paused';
  lastRun?: string;
  description?: string;
}

export interface DatabaseItem {
  id: string;
  modelName: string;
  specs: {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    screen: string;
  };
  priceOriginal: number;
  currency: string;
  storeName: string;
  country: string;
  link: string;
  status: 'new' | 'updated' | 'stable' | 'deleted';
  lastChecked: string;
  inStock: boolean;
}

export interface ReportItem {
  id: string;
  title: string;
  date: string;
  type: 'PDF' | 'EXCEL' | 'TELEGRAM';
  size: string;
}
