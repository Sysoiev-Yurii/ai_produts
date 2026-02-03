
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, Search, Link as LinkIcon, Sparkles } from 'lucide-react';
import { ChatMessage, ExchangeSettings, LaptopProduct } from '../../types';
import { searchLaptops } from '../../services/geminiService';
import ResultsTable from './ResultsTable';

interface AgentViewProps {
  settings: ExchangeSettings;
}

const AgentView: React.FC<AgentViewProps> = ({ settings }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: "Привет! Я ваш ИИ-агент LaptOptimus. Моя задача — найти лучшую цену на ноутбук в Румынии и Украине.\n\nЧто именно мы ищем сегодня?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await searchLaptops(userMessage, () => {});

      setMessages(prev => [...prev, {
        role: 'model',
        text: response.text,
        data: response.products,
        sources: response.sources
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'model',
        text: "Произошла ошибка при поиске. Пожалуйста, проверьте API-ключ в настройках окружения."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Шапка чата */}
      <div className="px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between shrink-0">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
               <Bot className="text-white w-6 h-6" />
            </div>
            <div>
               <h3 className="font-bold text-slate-900">Интеллектуальный поиск</h3>
               <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Агент в сети</span>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
            <span>ЦЕЛЕВЫЕ РЫНКИ: RO / UA</span>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex max-w-[95%] md:max-w-[85%] lg:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${
                msg.role === 'user' ? 'bg-slate-900 ml-4' : 'bg-white border border-slate-200 mr-4'
              }`}>
                {msg.role === 'user' ? <span className="text-white text-xs font-bold">Я</span> : <Sparkles className="text-indigo-600 w-5 h-5" />}
              </div>

              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-5 rounded-3xl shadow-sm text-sm whitespace-pre-wrap leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}>
                  {msg.role === 'model' ? (
                     <div>{msg.text.split('```json')[0]}</div> 
                  ) : (
                    msg.text
                  )}
                </div>

                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {msg.sources.map((src, i) => (
                      <a key={i} href={src.uri} target="_blank" rel="noreferrer" className="flex items-center bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase hover:bg-slate-50 transition-colors">
                        <LinkIcon className="w-3 h-3 mr-2 text-indigo-500" />
                        {src.title.length > 20 ? src.title.substring(0, 20) + '...' : src.title}
                      </a>
                    ))}
                  </div>
                )}

                {msg.data && msg.data.length > 0 && (
                  <div className="mt-6 w-full animate-in zoom-in-95 duration-500">
                    <div className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
                       <Search className="w-3 h-3" /> Найдено предложений: {msg.data.length}
                    </div>
                    <ResultsTable products={msg.data} settings={settings} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
             <div className="bg-white border border-slate-200 p-5 rounded-3xl rounded-tl-none ml-14 shadow-sm flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                <span className="text-sm font-bold text-slate-500">Анализирую магазины RO и UA...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white/80 backdrop-blur-xl border-t border-slate-200 p-6 shrink-0">
        <div className="max-w-4xl mx-auto relative flex items-end gap-3">
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
              placeholder="Напишите: 'Найди Asus TUF с 4060 в Румынии'..."
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 focus:bg-white outline-none resize-none h-[60px] min-h-[60px] max-h-[150px] custom-scrollbar text-sm font-medium transition-all"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-5 bg-indigo-600 text-white rounded-[1.5rem] hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          </button>
        </div>
        <div className="max-w-4xl mx-auto mt-3 text-center">
           <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
             LaptOptimus AI v2.5 • Реальное время • 🇷🇴 ➔ 🇺🇦
           </p>
        </div>
      </div>
    </div>
  );
};

export default AgentView;
