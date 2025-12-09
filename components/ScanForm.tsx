import React, { useState } from 'react';
import { Search, Globe, AlertCircle, Play, Code, FileCode, Zap } from 'lucide-react';

interface ScanFormProps {
  onScan: (target: string, type: 'url' | 'code') => void;
  isScanning: boolean;
}

export const ScanForm: React.FC<ScanFormProps> = ({ onScan, isScanning }) => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'url' | 'code'>('url');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      setError(mode === 'url' ? 'Target URL is required' : 'Source code is required');
      return;
    }
    if (mode === 'url' && !input.startsWith('http')) {
      setError('URL must start with http:// or https://');
      return;
    }
    setError('');
    onScan(input, mode);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-16 relative group perspective-1000">
      {/* Glow Effect behind panel */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyber-goldDim via-cyber-gold to-cyber-goldDim rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-1000"></div>
      
      <div className="glass-panel p-8 md:p-10 rounded-2xl shadow-2xl relative overflow-hidden transition-all duration-500 transform border border-cyber-border/50">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-gold/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10 text-center mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyber-dark/50 border border-cyber-gold/20 text-cyber-gold text-xs font-mono font-bold tracking-wide shadow-sm">
             <div className="w-2 h-2 rounded-full bg-cyber-success animate-pulse"></div>
             <span>SYSTEM READY // V4.1 ENGINE</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-white tracking-tight leading-tight">
            Advanced <span className="gold-gradient-text">Security Intelligence</span>
          </h2>
          
          <p className="text-cyber-textDim text-sm md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Deploy elite-level AI agents to audit websites (DAST) or analyze source code (SAST) for critical vulnerabilities.
          </p>
        </div>

        {/* Mode Toggles */}
        <div className="flex justify-center mb-6 relative z-10">
          <div className="bg-cyber-darker/60 p-1 rounded-lg border border-cyber-border/60 inline-flex">
            <button
              onClick={() => setMode('url')}
              className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${
                mode === 'url' ? 'bg-cyber-gold text-cyber-darker shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Globe size={16} /> Website Scan
            </button>
            <button
              onClick={() => setMode('code')}
              className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${
                mode === 'code' ? 'bg-cyber-gold text-cyber-darker shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Code size={16} /> Code Audit
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 max-w-3xl mx-auto">
          <div className={`flex flex-col gap-4 p-2.5 bg-cyber-darker/60 rounded-xl border border-cyber-border/60 shadow-inner backdrop-blur-sm transition-all focus-within:border-cyber-gold/50 focus-within:shadow-[0_0_20px_rgba(251,191,36,0.1)]`}>
            
            <div className="relative group/input flex-1">
              <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                {mode === 'url' ? (
                   <Globe className="h-5 w-5 text-gray-500 group-focus-within/input:text-cyber-gold transition-colors duration-300" />
                ) : (
                   <FileCode className="h-5 w-5 text-gray-500 group-focus-within/input:text-cyber-gold transition-colors duration-300" />
                )}
              </div>
              
              {mode === 'url' ? (
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-transparent text-white placeholder-gray-500 font-mono transition-all outline-none border-none focus:ring-0 text-lg"
                  disabled={isScanning}
                />
              ) : (
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste your source code here (Python, JS, PHP, etc.)..."
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-transparent text-white placeholder-gray-500 font-mono transition-all outline-none border-none focus:ring-0 text-sm h-32 custom-scrollbar resize-none"
                  disabled={isScanning}
                />
              )}
            </div>

            <button
              type="submit"
              disabled={isScanning}
              className={`w-full py-4 rounded-lg font-bold text-cyber-darker flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg ${
                isScanning 
                  ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
                  : 'btn-gold'
              }`}
            >
              {isScanning ? (
                <>
                  <div className="w-5 h-5 border-2 border-cyber-darker/30 border-t-cyber-darker rounded-full animate-spin"></div>
                  <span className="font-mono text-sm tracking-widest">EXECUTING ANALYSIS</span>
                </>
              ) : (
                <>
                  <Play size={20} fill="currentColor" />
                  <span className="tracking-widest text-sm">INITIATE {mode === 'url' ? 'SCAN' : 'AUDIT'}</span>
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="mt-4 flex items-center justify-center gap-2 text-cyber-danger bg-cyber-danger/10 py-2 rounded-lg border border-cyber-danger/20 text-sm font-medium animate-fade-in">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs text-cyber-textDim/60 font-mono uppercase tracking-widest">
          <span className="flex items-center gap-2 hover:text-cyber-gold transition-colors cursor-help"><Zap size={12} className="text-cyber-gold"/> SAST/DAST</span>
          <span className="flex items-center gap-2 hover:text-cyber-gold transition-colors cursor-help"><Zap size={12} className="text-cyber-gold"/> OWASP Top 10</span>
          <span className="flex items-center gap-2 hover:text-cyber-gold transition-colors cursor-help"><Zap size={12} className="text-cyber-gold"/> Business Logic</span>
        </div>
      </div>
    </div>
  );
};