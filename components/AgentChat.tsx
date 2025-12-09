
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, User, Shield } from 'lucide-react';
import { queryAgent } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AgentChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'ai',
      content: "Greetings! I am Sentinel, your security guide. I can help you understand vulnerabilities, interpret scan results, or navigate the WebSec platform. How can I assist?",
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for API
      const historyPayload = messages.map(m => ({ role: m.role, content: m.content }));
      
      const responseText = await queryAgent(historyPayload, userMsg.content);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "I'm having trouble connecting to the mainframe. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="pointer-events-auto w-[350px] md:w-[400px] h-[500px] bg-cyber-darker/95 backdrop-blur-xl border border-cyber-gold/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden mb-4 animate-fade-in-up origin-bottom-right">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-cyber-panel to-cyber-dark p-4 border-b border-cyber-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyber-gold/20 border border-cyber-gold/50 flex items-center justify-center text-cyber-gold shadow-lg shadow-cyber-gold/10">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold font-serif text-sm">Sentinel Guide</h3>
                <div className="flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-cyber-success animate-pulse"></span>
                   <span className="text-[10px] text-cyber-textDim uppercase tracking-wider font-mono">Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-gray-400 hover:text-white hover:rotate-90 transition-all p-1"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 border ${
                  msg.role === 'user' 
                    ? 'bg-cyber-panel border-gray-600 text-gray-300' 
                    : 'bg-cyber-gold/10 border-cyber-gold/50 text-cyber-gold'
                }`}>
                  {msg.role === 'user' ? <User size={12} /> : <Shield size={12} />}
                </div>
                
                <div className={`p-3 rounded-xl text-xs md:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-cyber-panel text-white border border-gray-600 rounded-tr-sm'
                    : 'bg-[#1e293b]/80 text-gray-200 border border-cyber-gold/20 rounded-tl-sm shadow-sm'
                }`}>
                  {msg.content}
                  <div className={`text-[9px] mt-1.5 opacity-40 font-mono text-right ${msg.role === 'user' ? 'text-gray-400' : 'text-cyber-gold'}`}>
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 max-w-[80%]">
                 <div className="w-6 h-6 rounded-full bg-cyber-gold/10 border border-cyber-gold/50 flex items-center justify-center shrink-0 mt-1 text-cyber-gold">
                    <Bot size={12} />
                 </div>
                 <div className="bg-[#1e293b]/80 p-3 rounded-xl border border-cyber-gold/20 rounded-tl-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyber-gold rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-cyber-gold rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-cyber-gold rounded-full animate-bounce delay-150"></span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-cyber-dark/95 border-t border-cyber-border/50">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about XSS, SQLi, or the platform..."
                className="w-full bg-cyber-dark border border-cyber-border rounded-lg pl-4 pr-12 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyber-gold/50 focus:ring-1 focus:ring-cyber-gold/20 transition-all shadow-inner font-sans"
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-cyber-gold text-cyber-darker rounded-md hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto group relative flex items-center justify-center w-14 h-14 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all duration-300 ${isOpen ? 'bg-cyber-darker text-gray-400 rotate-90 scale-90' : 'bg-gradient-to-br from-cyber-gold to-[#d97706] text-cyber-darker hover:scale-110'}`}
      >
        {isOpen ? (
            <X size={24} />
        ) : (
            <>
              <MessageSquare size={24} fill="currentColor" className="opacity-80" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyber-danger rounded-full border-2 border-cyber-dark flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full animate-ping opacity-75 absolute"></span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full relative z-10"></span>
              </div>
            </>
        )}
        
        {/* Hover Label */}
        {!isOpen && (
            <div className="absolute right-full mr-4 bg-cyber-darker border border-cyber-border px-3 py-1.5 rounded-lg text-xs font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                Ask Sentinel AI
                <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-cyber-darker border-t border-r border-cyber-border rotate-45"></div>
            </div>
        )}
      </button>
    </div>
  );
};
