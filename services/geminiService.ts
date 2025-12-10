import { GoogleGenAI, Type } from "@google/genai";
import { LaptopProduct } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

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
  if (!apiKey) {
    throw new Error("API Key отсутствует. Пожалуйста, проверьте переменные окружения.");
  }

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
         "modelName": "Строка (Название модели)",
         "specs": { "cpu": "Строка", "ram": "Строка", "storage": "Строка", "gpu": "Строка", "screen": "Строка" },
         "priceOriginal": Число (только цифра цены в исходной валюте),
         "currency": "RON" или "UAH",
         "storeName": "Строка (Название магазина)",
         "country": "RO" или "UA",
         "link": "Строка (URL)",
         "notes": "Краткий анализ или комментарий на русском языке"
       }
    5. Приоритет — найти точную модель, но если её нет, предложи близких конкурентов.
    6. Весь текстовый ответ перед JSON должен быть на русском языке.
  `;

  try {
    const model = 'gemini-2.5-flash';
    
    // We use a simpler approach: asking for text explanation + JSON block
    const response = await ai.models.generateContent({
      model: model,
      contents: query,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    const text = response.text || "Ответ не сгенерирован.";
    
    // Extract sources
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map(chunk => chunk.web ? { title: chunk.web.title || 'Источник', uri: chunk.web.uri || '#' } : null)
      .filter((s): s is { title: string; uri: string } => s !== null) || [];

    // Attempt to extract JSON block from the text response
    let products: LaptopProduct[] = [];
    const jsonMatch = text.match(/\[\s*\{.*\}\s*\]/s);
    
    if (jsonMatch) {
      try {
        const jsonStr = cleanJsonString(jsonMatch[0]);
        const parsedData = JSON.parse(jsonStr);
        // Map to ensure IDs exist
        products = parsedData.map((item: any, index: number) => ({
          ...item,
          id: `gen-${Date.now()}-${index}`,
        }));
      } catch (e) {
        console.warn("Failed to parse extracted JSON", e);
      }
    }

    return { text, products, sources };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};