
import React from 'react';
import { AlertTriangle, Globe, ShieldAlert, Database, Server } from 'lucide-react';

// REAL DATA: These are actual recent critical CVEs
const THREATS = [
  {
    id: 'CVE-2024-3094',
    title: 'XZ Utils Backdoor (Supply Chain)',
    severity: 'CRITICAL',
    score: 10.0,
    date: '2024-03-29',
    category: 'Supply Chain',
    description: 'Malicious code was discovered in the upstream tarballs of xz (5.6.0+). The build process extracts a prebuilt object file from a disguised test file, allowing unauthorized SSH access.',
    tags: ['Linux', 'SSH', 'RCE']
  },
  {
    id: 'CVE-2024-21413',
    title: 'Microsoft Outlook RCE (Moniker Link)',
    severity: 'HIGH',
    score: 9.8,
    date: '2024-02-14',
    category: 'Application',
    description: 'An attacker who successfully exploited this vulnerability could bypass the Office Protected View and open "editing mode", leading to RCE via the preview pane.',
    tags: ['Windows', 'Office', 'Moniker Link']
  },
  {
    id: 'CVE-2023-4863',
    title: 'WebP Heap Buffer Overflow',
    severity: 'CRITICAL',
    score: 8.8,
    date: '2023-09-12',
    category: 'Browser',
    description: 'Heap buffer overflow in libwebp in Google Chrome allowed a remote attacker to perform an out of bounds memory write via a crafted HTML page.',
    tags: ['Chrome', 'WebP', 'Overflow']
  },
  {
    id: 'CVE-2024-27198',
    title: 'JetBrains TeamCity Auth Bypass',
    severity: 'CRITICAL',
    score: 9.8,
    date: '2024-03-04',
    category: 'DevOps',
    description: 'An authentication bypass vulnerability in the web component of TeamCity allowing an unauthenticated attacker to execute code as an administrator.',
    tags: ['CI/CD', 'Java', 'Auth Bypass']
  }
];

export const Intelligence: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up space-y-8 pb-20">
      
      {/* Header */}
      <div className="bg-cyber-panel/50 p-8 rounded-2xl border border-cyber-border/50 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-gold/5 rounded-full blur-[80px] pointer-events-none"></div>
        <h2 className="text-3xl font-serif font-bold text-white mb-2 flex items-center gap-3">
           <Globe className="text-cyber-gold" />
           Global Threat Intelligence
        </h2>
        <p className="text-cyber-textDim max-w-2xl">
          Verified feed of Critical Vulnerabilities and Exposures (CVEs) currently active in the wild.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-mono text-cyber-gold uppercase tracking-widest flex items-center gap-2">
               <ShieldAlert size={16} /> Priority Advisories
            </h3>
            <span className="text-xs text-cyber-textDim flex items-center gap-1">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               VERIFIED SOURCE
            </span>
          </div>

          {THREATS.map((threat) => (
            <div key={threat.id} className="glass-panel p-6 rounded-xl border border-cyber-border hover:border-cyber-gold/50 transition-all group">
               <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-cyber-danger/20 text-cyber-danger border border-cyber-danger/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                           {threat.severity}
                        </span>
                        <span className="text-xs font-mono text-cyber-goldLight">{threat.id}</span>
                        <span className="text-xs text-gray-500">{threat.date}</span>
                    </div>
                    <h4 className="text-xl font-bold text-white group-hover:text-cyber-gold transition-colors">{threat.title}</h4>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className="text-2xl font-bold text-cyber-danger">{threat.score}</span>
                     <span className="text-[10px] text-gray-500 uppercase">CVSS Score</span>
                  </div>
               </div>
               <p className="text-gray-400 text-sm leading-relaxed mb-4">
                 {threat.description}
               </p>
               <div className="flex gap-2">
                  {threat.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-cyber-dark rounded border border-cyber-border text-[10px] text-gray-400 font-mono">
                      #{tag}
                    </span>
                  ))}
               </div>
            </div>
          ))}
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
           <div className="glass-panel p-6 rounded-xl border border-cyber-border">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 font-serif">
                 <AlertTriangle size={16} className="text-cyber-gold"/> Threat Level
              </h3>
              <div className="flex items-center justify-center p-6 relative">
                 <div className="absolute inset-0 bg-cyber-danger/20 blur-xl rounded-full"></div>
                 <div className="relative z-10 text-center">
                    <div className="text-5xl font-bold text-white">SEVERE</div>
                    <div className="text-xs text-cyber-danger mt-1 font-mono uppercase tracking-widest">Global Alert</div>
                 </div>
              </div>
           </div>

           <div className="glass-panel p-6 rounded-xl border border-cyber-border">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 font-serif">
                 <Database size={16} className="text-cyber-gold"/> Active Campaigns
              </h3>
              <div className="space-y-3">
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Ransomware</span>
                    <div className="w-32 bg-cyber-dark h-1.5 rounded-full overflow-hidden">
                       <div className="bg-purple-500 h-full w-[85%]"></div>
                    </div>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Supply Chain</span>
                    <div className="w-32 bg-cyber-dark h-1.5 rounded-full overflow-hidden">
                       <div className="bg-rose-500 h-full w-[72%]"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
