import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Globe, BrainCircuit, Sparkles, ExternalLink } from 'lucide-react';
import { ChatMessage, Goal, ChatMode } from '../types';
import { sendChatMessage } from '../services/geminiService';

interface ChatViewProps {
  goals: Goal[];
}

const ChatView: React.FC<ChatViewProps> = ({ goals }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<ChatMode>('STANDARD');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Call service with selected mode
    const { text, sources } = await sendChatMessage(messages, input, goals, mode);
    
    const aiMsg: ChatMessage = { role: 'model', text: text, sources };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const ModeButton = ({ m, icon: Icon, label }: { m: ChatMode, icon: any, label: string }) => (
    <button
      onClick={() => setMode(m)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        mode === m 
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
          : 'text-slate-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-white/5 border border-transparent'
      }`}
    >
      <Icon size={12} />
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0f1115]">
      {/* Header with Mode Selection */}
      <div className="p-6 border-b border-gray-100 dark:border-white/5 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">AI Assistent</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Stel vragen over je doelen of vraag om advies.</p>
        </div>
        
        <div className="flex gap-2">
          <ModeButton m="STANDARD" icon={Sparkles} label="Standaard" />
          <ModeButton m="RESEARCH" icon={Globe} label="Research" />
          <ModeButton m="THINKING" icon={BrainCircuit} label="Deep Think" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <Bot size={48} className="mb-4 opacity-20" />
            <p className="text-sm">
              {mode === 'STANDARD' && "Begin een gesprek..."}
              {mode === 'RESEARCH' && "Stel vragen over actualiteiten..."}
              {mode === 'THINKING' && "Stel complexe vragen die denkwerk vereisen..."}
            </p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             {msg.role === 'model' && (
               <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 mt-1">
                 <Bot size={16} className="text-slate-600 dark:text-slate-300" />
               </div>
             )}
             
             <div className={`max-w-[75%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white dark:bg-[#1c1e24] text-slate-700 dark:text-slate-200 border border-gray-100 dark:border-white/5 rounded-bl-none'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>

                {/* Render Sources if available */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="bg-gray-50 dark:bg-[#16181d] border border-gray-100 dark:border-white/5 rounded-xl p-3 w-full text-xs">
                    <div className="font-semibold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-2">
                      <Globe size={10} /> Bronnen
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {msg.sources.map((src, i) => (
                        <a 
                          key={i} 
                          href={src.uri} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline truncate"
                        >
                          <ExternalLink size={10} flex-shrink-0 />
                          <span className="truncate">{src.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
             </div>

             {msg.role === 'user' && (
               <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                 <User size={16} className="text-blue-600 dark:text-blue-400" />
               </div>
             )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 justify-start">
             <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                 <Bot size={16} className="text-slate-600 dark:text-slate-300" />
             </div>
             <div className="bg-white dark:bg-[#1c1e24] border border-gray-100 dark:border-white/5 p-4 rounded-2xl rounded-bl-none flex gap-1 items-center">
               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></div>
               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></div>
               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></div>
               {mode === 'THINKING' && <span className="text-xs text-slate-400 ml-2 animate-pulse">Thinking...</span>}
               {mode === 'RESEARCH' && <span className="text-xs text-slate-400 ml-2 animate-pulse">Searching...</span>}
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-50 dark:bg-[#16181d] border-t border-gray-200 dark:border-white/5">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Type een bericht (${mode === 'THINKING' ? 'Deep Think' : mode === 'RESEARCH' ? 'Search' : 'Standard'})...`}
            className="w-full pl-4 pr-12 py-3 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-800 dark:text-white placeholder-slate-400 text-sm transition-all"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;