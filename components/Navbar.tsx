
import React from 'react';
import { Shield, Terminal, Activity, Search, Clock } from 'lucide-react';

interface NavbarProps {
  currentView: 'scanner' | 'intelligence' | 'monitor' | 'history';
  onNavigate: (view: 'scanner' | 'intelligence' | 'monitor' | 'history') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="border-b border-cyber-border bg-cyber-dark/95 backdrop-blur-md sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div 
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => onNavigate('scanner')}
          >
            <div className="bg-cyber-gold/10 p-2.5 rounded-lg border border-cyber-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:bg-cyber-gold/20 transition-all">
              <Shield className="h-6 w-6 text-cyber-gold" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
                WEBSEC<span className="text-cyber-gold">.AI</span>
              </h1>
              <p className="text-[10px] text-cyber-goldLight uppercase tracking-[0.25em] font-medium opacity-80">
                Premium Pentest Suite
              </p>
            </div>
          </div>
          
          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => onNavigate('scanner')}
              className={`flex items-center gap-2 transition-all cursor-pointer text-sm group ${
                currentView === 'scanner' ? 'text-cyber-gold' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Search size={16} className={currentView === 'scanner' ? 'text-cyber-gold' : 'group-hover:text-cyber-gold transition-colors'} />
              <span className="font-mono tracking-wide">SCANNER</span>
              {currentView === 'scanner' && <div className="absolute bottom-0 h-0.5 w-16 bg-cyber-gold shadow-[0_0_10px_#fbbf24]"></div>}
            </button>

            <button 
              onClick={() => onNavigate('intelligence')}
              className={`flex items-center gap-2 transition-all cursor-pointer text-sm group ${
                currentView === 'intelligence' ? 'text-cyber-gold' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Terminal size={16} className={currentView === 'intelligence' ? 'text-cyber-gold' : 'group-hover:text-cyber-gold transition-colors'} />
              <span className="font-mono tracking-wide">INTELLIGENCE</span>
              {currentView === 'intelligence' && <div className="absolute bottom-0 h-0.5 w-24 bg-cyber-gold shadow-[0_0_10px_#fbbf24]"></div>}
            </button>

            <button 
              onClick={() => onNavigate('monitor')}
              className={`flex items-center gap-2 transition-all cursor-pointer text-sm group ${
                currentView === 'monitor' ? 'text-cyber-gold' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Activity size={16} className={currentView === 'monitor' ? 'text-cyber-gold' : 'group-hover:text-cyber-gold transition-colors'} />
              <span className="font-mono tracking-wide">LIVE MONITORS</span>
              {currentView === 'monitor' && <div className="absolute bottom-0 h-0.5 w-24 bg-cyber-gold shadow-[0_0_10px_#fbbf24]"></div>}
            </button>

            <button 
              onClick={() => onNavigate('history')}
              className={`flex items-center gap-2 transition-all cursor-pointer text-sm group ${
                currentView === 'history' ? 'text-cyber-gold' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Clock size={16} className={currentView === 'history' ? 'text-cyber-gold' : 'group-hover:text-cyber-gold transition-colors'} />
              <span className="font-mono tracking-wide">HISTORY</span>
              {currentView === 'history' && <div className="absolute bottom-0 h-0.5 w-20 bg-cyber-gold shadow-[0_0_10px_#fbbf24]"></div>}
            </button>
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center gap-3 bg-cyber-gold/5 px-3 py-1.5 rounded-full border border-cyber-gold/20">
            <div className="h-2 w-2 rounded-full bg-cyber-gold animate-pulse"></div>
            <span className="text-xs font-mono text-cyber-gold font-bold">SECURE UPLINK</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
