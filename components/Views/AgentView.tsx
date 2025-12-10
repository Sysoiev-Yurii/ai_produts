import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, Search, Link as LinkIcon } from 'lucide-react';
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
      text: "Привет! Я ваш агент LaptOptimus. Напишите, какой ноутбук вы ищете (например, 'Asus ROG Strix G16 RTX 4060'), и я поищу его в магазинах Румынии и Украины." 
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
      const response = await searchLaptops(userMessage, (chunk) => {
        // Implementation for streaming could go here if needed later
      });

      setMessages(prev => [...prev, {
        role: 'model',
        text: response.text,
        data: response.products,
        sources: response.sources
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'model',
        text: "Произошла ошибка при поиске. Пожалуйста, проверьте API ключ и попробуйте снова."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[95%] md:max-w-[85%] lg:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === 'user' ? 'bg-blue-600 ml-3' : 'bg-emerald-600 mr-3'
              }`}>
                {msg.role === 'user' ? <span className="text-white text-xs">Я</span> : <Bot className="text-white w-5 h-5" />}
              </div>

              {/* Bubble */}
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl shadow-sm text-sm whitespace-pre-wrap leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}>
                  {msg.role === 'model' ? (
                     // Crude markdown stripping/formatting for the demo
                     <div>{msg.text.split('```json')[0]}</div> 
                  ) : (
                    msg.text
                  )}
                </div>

                {/* Sources if available */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 text-xs flex flex-wrap gap-2">
                    {msg.sources.map((src, i) => (
                      <a key={i} href={src.uri} target="_blank" rel="noreferrer" className="flex items-center bg-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-slate-300">
                        <LinkIcon className="w-3 h-3 mr-1" />
                        {src.title}
                      </a>
                    ))}
                  </div>
                )}

                {/* Data Table if available */}
                {msg.data && msg.data.length > 0 && (
                  <div className="mt-4 w-full">
                    <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Найдено моделей: {msg.data.length}</div>
                    <ResultsTable products={msg.data} settings={settings} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none ml-11 shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                <span className="text-sm text-slate-500">Поиск в магазинах (RO/UA)...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4">
        <div className="max-w-4xl mx-auto relative flex items-center gap-2">
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Спросить агента: 'Найти цены на Lenovo Legion Slim 5'..."
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none h-[50px] min-h-[50px] max-h-[120px] custom-scrollbar"
              rows={1}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/20"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <div className="max-w-4xl mx-auto mt-2 text-center">
           <p className="text-xs text-slate-400">
             ИИ может ошибаться. Перепроверяйте цены и наличие по ссылкам.
           </p>
        </div>
      </div>
    </div>
  );
};

export default AgentView;