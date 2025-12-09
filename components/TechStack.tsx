import React from 'react';
import { TechStackItem, SecurityHeader } from '../types';
import { Database, Layout, Server, Code, Lock, ShieldCheck, AlertTriangle, Cpu } from 'lucide-react';

interface Props {
  stack: TechStackItem[];
  headers: SecurityHeader[];
}

export const TechStack: React.FC<Props> = ({ stack, headers }) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'Frontend': return <Layout size={14} />;
      case 'Backend': return <Code size={14} />;
      case 'Database': return <Database size={14} />;
      case 'Server': return <Server size={14} />;
      default: return <Cpu size={14} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tech Stack */}
      <div className="glass-panel p-6 rounded-xl border border-cyber-border">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2 font-serif">
           <Cpu className="text-cyber-gold" size={18} />
           Technology Fingerprint
        </h3>
        <div className="flex flex-wrap gap-2">
          {stack.map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-dark border border-cyber-border text-xs text-gray-300 hover:border-cyber-gold/50 transition-colors">
               <span className="text-cyber-goldDim">{getIcon(item.category)}</span>
               <span className="font-semibold text-white">{item.name}</span>
               {item.version && <span className="text-cyber-goldLight ml-1 text-[10px] opacity-70">v{item.version}</span>}
            </div>
          ))}
          {stack.length === 0 && <span className="text-gray-500 text-sm italic">No specific technologies identified.</span>}
        </div>
      </div>

      {/* Headers */}
      <div className="glass-panel p-6 rounded-xl border border-cyber-border">
         <h3 className="text-white font-bold mb-4 flex items-center gap-2 font-serif">
           <Lock className="text-cyber-gold" size={18} />
           Security Headers
        </h3>
        <div className="space-y-3">
          {headers.map((header, i) => (
             <div key={i} className="flex items-center justify-between text-xs md:text-sm p-2 hover:bg-white/5 rounded transition-colors">
                <span className="text-gray-400 font-mono truncate mr-2">{header.name}</span>
                <div className="flex items-center gap-2 shrink-0">
                   {header.status === 'secure' && <ShieldCheck size={14} className="text-cyber-success" />}
                   {header.status === 'warning' && <AlertTriangle size={14} className="text-cyber-warning" />}
                   {header.status === 'missing' && <AlertTriangle size={14} className="text-cyber-danger" />}
                   <span className={`text-[10px] uppercase font-bold tracking-wider ${
                      header.status === 'secure' ? 'text-cyber-success' : 
                      header.status === 'warning' ? 'text-cyber-warning' : 'text-cyber-danger'
                   }`}>
                      {header.status}
                   </span>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};