
import { GoogleGenAI, Type } from "@google/genai";
import { LaptopProduct } from "../types";

const apiKey = process.env.API_KEY || '';

// Helper to sanitize JSON string if the model returns markdown code blocks
const cleanJsonString = (str: string): string => {
  let clean = str.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json/, '').replace(/```$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```/, '').replace(/```$/, '');
  }
  return clean;
};

export const searchLaptops = async (
  query: string,
  onStream: (chunk: string) => void
): Promise<{ text: string; products: LaptopProduct[]; sources: { title: string; uri: string }[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `
    Ты — LaptOptimus, экспертный AI-агент, специализирующийся на поиске ноутбуков в интернет-магазинах Румынии и Украины.
    Твоя цель — находить конкретные модели ноутбуков, сравнивать цены или подбирать аналоги по запросу пользователя. Отвечай на русском языке.
    
    Целевые рынки:
    - Румынские сайты (например, eMAG.ro, Altex.ro, pcgarage.ro).
    - Украинские сайты (например, Rozetka, Citrus, Moyo).

    Правила:
    1. Ищи реальную, актуальную информацию используя Google Search.
    2. Извлекай технические характеристики и цены.
    3. В конце ответа ты ОБЯЗАН вернуть JSON-массив найденных товаров, обернутый в специальный блок.
    4. Структура JSON для каждого товара должна быть такой:
       {
         "modelName": "Строка",
         "specs": { "cpu": "Строка", "ram": "Строка", "storage": "Строка", "gpu": "Строка", "screen": "Строка" },
         "priceOriginal": Число,
         "currency": "RON" или "UAH",
         "storeName": "Строка",
         "country": "RO" или "UA",
         "link": "Строка",
         "notes": "Строка"
       }
    5. Весь текстовый ответ перед JSON должен быть на русском языке.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    const text = response.text || "Ответ не сгенерирован.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map(chunk => chunk.web ? { title: chunk.web.title || 'Источник', uri: chunk.web.uri || '#' } : null)
      .filter((s): s is { title: string; uri: string } => s !== null) || [];

    let products: LaptopProduct[] = [];
    const jsonMatch = text.match(/\[\s*\{.*\}\s*\]/s);
    if (jsonMatch) {
      try {
        const jsonStr = cleanJsonString(jsonMatch[0]);
        const parsedData = JSON.parse(jsonStr);
        products = parsedData.map((item: any, index: number) => ({
          ...item,
          id: `gen-${Date.now()}-${index}`,
        }));
      } catch (e) { console.warn("JSON parse error", e); }
    }
    return { text, products, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const getProjectManagerInsights = async (stats: any): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Проанализируй состояние системы мониторинга цен и дай краткий (2-3 предложения) отчет. 
      Данные: Uptime: ${stats.uptime}, API Quota: ${stats.quota}, Latency: ${stats.latency}, DB Health: ${stats.dbHealth}.
      Дай совет по оптимизации или похвали за стабильность. Говори от лица "Агента-Менеджера проекта LaptOptimus".`,
      config: {
        temperature: 0.8,
        maxOutputTokens: 200,
      },
    });
    return response.text || "Статус системы: Стабильно.";
  } catch (e) {
    return "Не удалось получить ИИ-аналитику статуса.";
  }
};
