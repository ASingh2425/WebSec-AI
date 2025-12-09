
import React from 'react';
import { ScanResult } from '../types';
import { Clock, Globe, Code, ArrowRight, Trash2, ShieldAlert, Calendar } from 'lucide-react';

interface HistoryProps {
  history: ScanResult[];
  onLoad: (result: ScanResult) => void;
  onDelete: (timestamp: string) => void;
  onClear: () => void;
}

export const History: React.FC<HistoryProps> = ({ history, onLoad, onDelete, onClear }) => {
  const getRiskColor = (score: number) => {
    if (score >= 90) return 'text-cyber-success';
    if (score >= 70) return 'text-cyber-gold';
    if (score >= 50) return 'text-cyber-warning';
    return 'text-cyber-danger';
  };

  const getRiskBg = (score: number) => {
    if (score >= 90) return 'bg-cyber-success';
    if (score >= 70) return 'bg-cyber-gold';
    if (score >= 50) return 'bg-cyber-warning';
    return 'bg-cyber-danger';
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end bg-cyber-panel/50 p-8 rounded-2xl border border-cyber-border/50 backdrop-blur-sm">
        <div>
          <h2 className="text-3xl font-serif font-bold text-white mb-2 flex items-center gap-3">
            <Clock className="text-cyber-gold" />
            Scan History
          </h2>
          <p className="text-cyber-textDim max-w-2xl">
            Access your previous penetration testing reports. Data is stored locally in your browser.
          </p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="mt-4 md:mt-0 px-4 py-2 border border-cyber-danger/30 text-cyber-danger hover:bg-cyber-danger/10 rounded-lg text-xs font-mono uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            <Trash2 size={14} /> Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="glass-panel p-16 rounded-xl border border-cyber-border text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-cyber-dark rounded-full flex items-center justify-center mb-6 border border-cyber-border">
                <Clock className="text-gray-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-serif">No History Found</h3>
            <p className="text-gray-400 max-w-md">
                Run a scan to build your security audit history. Reports will appear here automatically.
            </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {history.map((item, index) => (
            <div 
                key={index} 
                className="glass-panel p-6 rounded-xl border border-cyber-border hover:border-cyber-gold/50 transition-all group relative overflow-hidden"
            >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-gold/5 rounded-full blur-3xl pointer-events-none group-hover:bg-cyber-gold/10 transition-all"></div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-cyber-dark rounded-lg border border-cyber-border text-cyber-gold">
                            {item.scanType === 'url' ? <Globe size={20} /> : <Code size={20} />}
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg truncate max-w-[200px] md:max-w-[250px]">
                                {item.target}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500 font-mono mt-1">
                                <Calendar size={12} />
                                {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Unknown Date'}
                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : ''}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`text-2xl font-serif font-bold ${getRiskColor(item.riskScore)}`}>
                            {item.riskScore}
                        </span>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Score</div>
                    </div>
                </div>

                <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Risk Assessment</span>
                        <span className={getRiskColor(item.riskScore)}>{item.riskScore < 50 ? 'Critical Risk' : item.riskScore < 80 ? 'Moderate Risk' : 'Secure'}</span>
                    </div>
                    <div className="w-full bg-cyber-dark h-1.5 rounded-full overflow-hidden">
                        <div 
                            className={`h-full ${getRiskBg(item.riskScore)}`} 
                            style={{ width: `${item.riskScore}%` }}
                        ></div>
                    </div>
                    
                    <div className="flex gap-4 pt-2">
                         <div className="flex flex-col">
                            <span className="text-xl font-bold text-white">{item.vulnerabilities?.length || 0}</span>
                            <span className="text-[10px] text-gray-500 uppercase">Issues</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-xl font-bold text-white">{(item.sitemap?.length || 0) + (item.apiEndpoints?.length || 0)}</span>
                            <span className="text-[10px] text-gray-500 uppercase">Nodes</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-xl font-bold text-white">{item.techStack?.length || 0}</span>
                            <span className="text-[10px] text-gray-500 uppercase">Tech</span>
                         </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-cyber-border/50 relative z-10">
                    <button 
                        onClick={() => onDelete(item.timestamp || '')}
                        className="text-gray-500 hover:text-cyber-danger transition-colors p-2"
                        title="Delete from history"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button 
                        onClick={() => onLoad(item)}
                        className="flex items-center gap-2 text-xs font-bold text-cyber-gold hover:text-white uppercase tracking-widest transition-colors group/btn"
                    >
                        View Report <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
