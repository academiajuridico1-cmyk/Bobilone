import React, { useState, useEffect, useRef } from 'react';
import { generateHRContent } from '../services/geminiService';
import { AppData, ViewState } from '../types';
import { Bot, Send, Sparkles, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIAssistantProps {
  data: AppData;
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ data }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Olá! Sou seu assistente de RH Nexus AI. Posso ajudar a criar descrições de vagas, analisar dados dos funcionários ou tirar dúvidas sobre políticas. Como posso ajudar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Prepare context from app data
    const contextData = `
      Total Funcionários: ${data.employees.length}.
      Departamentos: ${data.departments.map(d => d.name).join(', ')}.
      Pedidos Pendentes: ${data.leaveRequests.filter(r => r.status === 'Pendente').length}.
      Exemplo de Funcionário: ${data.employees[0].firstName} (${data.employees[0].role}).
    `;

    const aiResponse = await generateHRContent(userMessage, contextData);

    setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    setIsLoading(false);
  };

  const suggestions = [
    "Crie uma descrição de vaga para Dev Frontend Senior",
    "Escreva um anúncio de feriado para a empresa",
    "Analise a diversidade de departamentos (baseado nos dados)",
    "Sugira perguntas para entrevista de Gerente de Vendas"
  ];

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-indigo-600 text-white flex items-center gap-3 shadow-md">
        <div className="p-2 bg-indigo-500 rounded-lg">
          <Sparkles size={24} className="text-yellow-300" />
        </div>
        <div>
          <h2 className="font-bold text-lg">Nexus AI Assistant</h2>
          <p className="text-xs text-indigo-200">Powered by Gemini 2.5 Flash</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1
                ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed
                ${msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}`}>
                 <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex items-center gap-2 text-slate-500 text-sm">
                  <Loader2 className="animate-spin" size={16} />
                  <span>Pensando...</span>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        {messages.length < 3 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {suggestions.map((s, i) => (
              <button 
                key={i} 
                onClick={() => setInput(s)}
                className="whitespace-nowrap px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input 
            type="text" 
            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50"
            placeholder="Digite sua pergunta para o RH..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;