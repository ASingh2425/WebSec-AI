
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ScanForm } from './components/ScanForm';
import { Dashboard } from './components/Dashboard';
import { Intelligence } from './components/Intelligence';
import { LiveMonitor } from './components/LiveMonitor';
import { History } from './components/History';
import { AgentChat } from './components/AgentChat';
import { runScan } from './services/geminiService';
import { ScanResult, ScanModule } from './types';
import { Terminal, Lock, ChevronLeft, Command, AlertCircle } from 'lucide-react';

type ViewState = 'scanner' | 'intelligence' | 'monitor' | 'history';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('scanner');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanLog, setScanLog] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('websec_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  const saveToHistory = (result: ScanResult) => {
    try {
      const newResult = { ...result, timestamp: new Date().toISOString() };
      // Keep last 10 items to prevent localStorage quota issues
      const newHistory = [newResult, ...history].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem('websec_history', JSON.stringify(newHistory));
      return newResult; // Return with timestamp
    } catch (e) {
      console.error("Failed to save history", e);
      return result;
    }
  };

  const handleClearHistory = () => {
    if(window.confirm('Are you sure you want to clear all scan history?')) {
        setHistory([]);
        localStorage.removeItem('websec_history');
    }
  };

  const handleDeleteHistoryItem = (timestamp: string) => {
      const newHistory = history.filter(h => h.timestamp !== timestamp);
      setHistory(newHistory);
      localStorage.setItem('websec_history', JSON.stringify(newHistory));
  };

  const handleLoadHistory = (result: ScanResult) => {
      setScanResult(result);
      setCurrentView('scanner');
      setScanLog([]); // Clear logs as this is a loaded report
  };

  const addLog = (msg: string) => {
    setScanLog(prev => [...prev, `[${new Date().toISOString().split('T')[1].slice(0,8)}] ${msg}`]);
  };

  const handleScan = async (target: string, type: 'url' | 'code', modules: ScanModule[] = []) => {
    setIsScanning(true);
    setError(null);
    setScanLog([]);
    setScanResult(null);

    const activeModules = modules.filter(m => m.enabled).map(m => m.name);

    // Advanced Simulation Logs with variable timing
    addLog(`TARGET_ACQUIRED: ${target.slice(0,30)}... [Type: ${type.toUpperCase()}]`);
    await new Promise(r => setTimeout(r, 600));
    
    if (activeModules.length > 0) {
      addLog(`MODULES_ENGAGED: ${activeModules.join(', ')}`);
      await new Promise(r => setTimeout(r, 600));
    }

    if (type === 'url') {
      addLog('INITIATING_HANDSHAKE: SSL/TLS Negotiation & Certificate Pinning check...');
      await new Promise(r => setTimeout(r, 800));
      
      if (activeModules.includes('Nmap Port Scanner')) {
         addLog('NMAP_SCRIPT_ENGINE: Scanning top 1000 ports (TCP/SYN)...');
         await new Promise(r => setTimeout(r, 1200));
      }
      
      addLog('THREAT_INTEL: Querying CVE Databases for known domain signatures...');
      await new Promise(r => setTimeout(r, 800));
    } else {
      addLog('PARSING_SYNTAX: Building Abstract Syntax Tree (AST)...');
      await new Promise(r => setTimeout(r, 800));
    }
    
    await new Promise(r => setTimeout(r, 1000));
    
    if (activeModules.includes('Burp Suite Pro')) {
      addLog('BURP_REPEATER: Fuzzing parameters for SQLi/XSS...');
      await new Promise(r => setTimeout(r, 1000));
    }

    addLog('LOGIC_PROBE: Analyzing Authentication & IDOR vulnerability surfaces...');
    await new Promise(r => setTimeout(r, 1500));
    addLog('VALIDATION: Cross-referencing findings with false-positive reduction filter...');
    
    try {
      const result = await runScan(target, type, activeModules);
      addLog('SUCCESS: Analysis Complete. Generating Executive Report.');
      await new Promise(r => setTimeout(r, 500));
      
      // Save to history and set state
      const timestampedResult = saveToHistory(result);
      setScanResult(timestampedResult);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during the analysis.");
      addLog('CRITICAL_FAILURE: Engine timeout or API rejection.');
    } finally {
      setIsScanning(false);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'intelligence':
        return <Intelligence />;
      case 'monitor':
        return <LiveMonitor />;
      case 'history':
        return <History history={history} onLoad={handleLoadHistory} onClear={handleClearHistory} onDelete={handleDeleteHistoryItem} />;
      case 'scanner':
      default:
        return (
          <>
            {!scanResult && (
              <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in w-full">
                 <ScanForm onScan={handleScan} isScanning={isScanning} />
                 
                 {/* Terminal Output */}
                 {(isScanning || scanLog.length > 0) && (
                    <div className="w-full max-w-3xl mt-8 rounded-xl overflow-hidden shadow-2xl border border-cyber-border/50 animate-fade-in-up">
                       <div className="bg-cyber-darker px-4 py-2 flex items-center justify-between border-b border-cyber-border/30">
                          <div className="flex items-center gap-2">
                            <Terminal size={14} className="text-cyber-gold" />
                            <span className="text-cyber-textDim text-xs font-mono font-bold uppercase tracking-wider">Live Kernel Shell</span>
                          </div>
                          <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-cyber-border"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-cyber-border"></div>
                          </div>
                       </div>
                       <div className="bg-[#02040a]/90 p-6 font-mono text-xs md:text-sm h-64 overflow-y-auto custom-scrollbar backdrop-blur-md">
                          <div className="space-y-2">
                             {scanLog.map((log, i) => (
                               <div key={i} className="text-cyber-textDim/80 font-light flex gap-3">
                                  <span className="text-cyber-border select-none">{(i+1).toString().padStart(2, '0')}</span>
                                  <span className="text-emerald-500/80 mr-2">➜</span>
                                  <span>{log}</span>
                               </div>
                             ))}
                             {isScanning && (
                                <div className="flex gap-3 text-cyber-gold/80 animate-pulse">
                                   <span className="text-cyber-border select-none">{(scanLog.length + 1).toString().padStart(2, '0')}</span>
                                   <span className="text-emerald-500/80 mr-2">➜</span>
                                   <span className="w-2 h-4 bg-cyber-gold/80 inline-block align-middle"></span>
                                </div>
                             )}
                          </div>
                       </div>
                    </div>
                 )}

                 {error && (
                    <div className="mt-8 p-6 bg-rose-950/20 border border-rose-500/30 rounded-xl text-rose-300 max-w-2xl text-center backdrop-blur-sm shadow-[0_0_30px_rgba(244,63,94,0.1)]">
                       <div className="flex items-center justify-center gap-2 mb-2">
                         <AlertCircle className="text-rose-500" />
                         <p className="font-bold font-serif text-lg text-rose-100">Execution Error</p>
                       </div>
                       <p className="text-sm font-mono opacity-80">{error}</p>
                    </div>
                 )}
              </div>
            )}

            {scanResult && (
              <div className="animate-fade-in-up w-full">
                <div className="flex items-center justify-between mb-8 sticky top-24 z-20 pointer-events-none">
                   <button 
                     onClick={() => setScanResult(null)}
                     className="pointer-events-auto bg-cyber-dark/80 backdrop-blur border border-cyber-border hover:border-cyber-gold text-xs text-cyber-textDim hover:text-white flex items-center gap-2 px-5 py-2.5 rounded-full transition-all shadow-lg hover:shadow-cyber-gold/20 font-mono uppercase tracking-widest group"
                   >
                     <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform"/> New Target
                   </button>
                </div>
                <Dashboard data={scanResult} />
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-gray-200 font-sans selection:bg-cyber-gold/30 selection:text-white flex flex-col">
      <Navbar currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative w-full">
        {renderContent()}
      </main>

      {/* Footer / Disclaimer */}
      <footer className="border-t border-cyber-border/30 bg-cyber-darker py-12 mt-auto relative z-10">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <h4 className="text-white font-serif font-bold mb-3 tracking-wide flex items-center justify-center gap-2">
               <Command size={18} className="text-cyber-gold"/>
               WEBSEC.AI
            </h4>
            <p className="text-cyber-textDim/50 text-xs mb-6 max-w-2xl mx-auto leading-relaxed">
               DISCLAIMER: 'Scanner' uses AI for educational simulation. 'Live Monitor' displays real-time local client telemetry.
               Always verify findings with dedicated tools (Burp Suite, OWASP ZAP) before remediation.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-cyber-textDim/40 text-[10px] font-mono uppercase tracking-widest">
               <span className="flex items-center gap-2"><Lock size={10} /> 256-bit Encrypted Tunnel</span>
               <span className="hidden md:inline">•</span>
               <span>v4.2.0-STABLE</span>
               <span className="hidden md:inline">•</span>
               <span>LATENCY: {Math.floor(Math.random() * 20) + 10}ms</span>
            </div>
         </div>
      </footer>

      {/* AI Agent Chat Module */}
      <AgentChat />
    </div>
  );
};

export default App;
