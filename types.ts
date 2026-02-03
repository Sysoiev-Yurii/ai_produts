
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
  usdBuyRate: number; 
  ronToUsdFactor: number; 
  romanianDeliveryRate: number; 
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
  keywords?: string[];
  excludeKeywords?: string[];
  minPrice?: number;
  maxPrice?: number;
  frequencyMinutes?: number;
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
  priceHistory?: { date: string; price: number }[];
}

export interface ReportItem {
  id: string;
  title: string;
  date: string;
  type: 'PDF' | 'EXCEL' | 'TELEGRAM' | 'CSV';
  size: string;
}
