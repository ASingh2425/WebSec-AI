import React from 'react';
import { ScanResult } from '../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { ShieldAlert, FileText, Code, Network, Download, UserCheck, Briefcase, ExternalLink, Activity, Layers, Target } from 'lucide-react';
import { VulnerabilityList } from './VulnerabilityList';
import { TechStack } from './TechStack';
import ReactMarkdown from 'react-markdown';

interface DashboardProps {
  data: ScanResult;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  // Defensive check for empty data
  if (!data) return null;

  const severityCounts = {
    Critical: data.vulnerabilities?.filter(v => v.severity === 'Critical').length || 0,
    High: data.vulnerabilities?.filter(v => v.severity === 'High').length || 0,
    Medium: data.vulnerabilities?.filter(v => v.severity === 'Medium').length || 0,
    Low: data.vulnerabilities?.filter(v => v.severity === 'Low').length || 0,
  };

  const pieData = [
    { name: 'Critical', value: severityCounts.Critical, color: '#f43f5e' },
    { name: 'High', value: severityCounts.High, color: '#f59e0b' },
    { name: 'Medium', value: severityCounts.Medium, color: '#fbbf24' },
    { name: 'Low', value: severityCounts.Low, color: '#10b981' },
  ].filter(d => d.value > 0);

  // Fallback for empty pie chart to show "Secure"
  if (pieData.length === 0) {
    pieData.push({ name: 'Secure', value: 1, color: '#334155' });
  }

  // Defensive check for Security Metrics
  const radarData = [
    { subject: 'Auth', A: data.securityMetrics?.authScore || 0, fullMark: 100 },
    { subject: 'Database', A: data.securityMetrics?.dbScore || 0, fullMark: 100 },
    { subject: 'Network', A: data.securityMetrics?.networkScore || 0, fullMark: 100 },
    { subject: 'Client', A: data.securityMetrics?.clientScore || 0, fullMark: 100 },
    { subject: 'Compl.', A: data.securityMetrics?.complianceScore || 0, fullMark: 100 },
  ];

  // Defensive check for OWASP data
  const barData = (data.owaspDistribution && data.owaspDistribution.length > 0) 
    ? data.owaspDistribution 
    : [{ category: 'No Risks', count: 0 }];

  const getRiskColor = (score: number) => {
    if (score >= 90) return 'text-cyber-success';
    if (score >= 70) return 'text-cyber-gold';
    if (score >= 50) return 'text-cyber-warning';
    return 'text-cyber-danger';
  };

  const handleDownloadPDF = () => {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.html2pdf) {
      const element = document.getElementById('report-container');
      const btn = document.getElementById('download-btn');
      
      if (!element) return;
      
      const originalText = btn ? btn.innerText : 'Export PDF';
      if(btn) btn.innerText = "Generating...";
      
      const opt = {
        margin: [0.3, 0.3],
        filename: `WebSec_Report_${data.target.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().slice(0,10)}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: '#0f172a' },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };
      
      // @ts-ignore
      window.html2pdf().set(opt).from(element).save().then(() => {
        if(btn) btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg> Export PDF';
      }).catch((err: any) => {
        console.error("PDF generation failed", err);
        if(btn) btn.innerText = "Error - Retry";
      });
    } else {
      alert("PDF Module not loaded yet. Please wait a moment.");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-20">
      
      {/* Controls & Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-cyber-panel/50 p-6 rounded-xl border border-cyber-border/50 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 bg-cyber-gold/10 rounded-lg">
                <Target className="text-cyber-gold" size={24}/>
             </div>
             <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
               {data.scanType === 'code' ? 'Code Audit Report' : 'Pentest Report'}
             </h2>
          </div>
          <p className="text-cyber-textDim font-mono text-sm pl-1 flex items-center gap-2">
            <span className="uppercase font-bold text-cyber-gold">{data.scanType} TARGET:</span> 
            {data.target}
          </p>
        </div>
        <button 
          id="download-btn"
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-6 py-2.5 bg-cyber-dark hover:bg-cyber-panel border border-cyber-border hover:border-cyber-gold text-cyber-gold rounded-lg transition-all text-sm font-bold uppercase tracking-wider shadow-md active:scale-95"
        >
          <Download size={16} />
          Export PDF
        </button>
      </div>

      {/* Main Report Container */}
      <div id="report-container" className="space-y-8">
        
        {/* Site Description */}
        <div className="glass-panel p-8 rounded-xl border-l-4 border-cyber-gold shadow-lg">
          <h3 className="text-sm font-mono text-cyber-gold uppercase tracking-widest mb-3 flex items-center gap-2">
            <Briefcase size={16} />
            Target Reconnaissance
          </h3>
          <p className="text-lg text-gray-200 leading-relaxed font-light font-sans">
            {data.siteDescription}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-6 rounded-xl relative overflow-hidden border-t border-t-transparent hover:border-t-cyber-gold/50 transition-all">
            <div className="absolute right-2 top-2 opacity-5 text-cyber-gold transform scale-150"><ShieldAlert size={80} /></div>
            <h3 className="text-cyber-textDim text-xs font-mono uppercase tracking-widest font-semibold">Security Score</h3>
            <div className={`text-6xl font-bold mt-2 font-serif tracking-tighter ${getRiskColor(data.riskScore)}`}>
              {data.riskScore}
            </div>
            <div className="w-full bg-gray-800 h-1.5 mt-4 rounded-full overflow-hidden">
               <div className={`h-full ${data.riskScore >= 70 ? 'bg-cyber-gold' : 'bg-cyber-danger'}`} style={{ width: `${data.riskScore}%` }}></div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-cyber-textDim text-xs font-mono uppercase tracking-widest font-semibold">Vulnerabilities</h3>
            <div className="text-5xl font-bold text-white mt-2 font-serif">{data.vulnerabilities.length}</div>
            <div className="flex gap-4 text-xs mt-4 font-mono">
              <span className="text-cyber-danger font-bold">● {severityCounts.Critical} CRIT</span>
              <span className="text-orange-500 font-bold">● {severityCounts.High} HIGH</span>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-cyber-textDim text-xs font-mono uppercase tracking-widest font-semibold">Vectors Mapped</h3>
            <div className="text-5xl font-bold text-white mt-2 font-serif">{(data.sitemap?.length || 0) + (data.apiEndpoints?.length || 0)}</div>
            <p className="text-[10px] text-cyber-textDim mt-4 uppercase">Attack Surface Nodes</p>
          </div>

          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-cyber-textDim text-xs font-mono uppercase tracking-widest font-semibold">Tech Fingerprints</h3>
            <div className="text-5xl font-bold text-white mt-2 font-serif">{data.techStack?.length || 0}</div>
            <p className="text-[10px] text-cyber-textDim mt-4 uppercase">Identified Stacks</p>
          </div>
        </div>

        {/* Visualizations Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 page-break-inside-avoid">
          {/* Radar Chart: Security Posture */}
          <div className="glass-panel p-6 rounded-xl border border-cyber-border">
             <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 font-serif">
                <Activity size={18} className="text-cyber-gold"/>
                Security Posture Matrix
             </h3>
             <div className="h-72 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                   <PolarGrid stroke="#334155" />
                   <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                   <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                   <Radar name="Score" dataKey="A" stroke="#fbbf24" strokeWidth={2} fill="#fbbf24" fillOpacity={0.3} />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#1e293b', borderColor: '#fbbf24', color: '#f1f5f9' }}
                     itemStyle={{ color: '#fbbf24' }}
                   />
                 </RadarChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Bar Chart: OWASP Distribution */}
          <div className="glass-panel p-6 rounded-xl border border-cyber-border">
             <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 font-serif">
                <Layers size={18} className="text-cyber-gold"/>
                OWASP Top 10 Distribution
             </h3>
             <div className="h-72 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                   <XAxis type="number" hide />
                   <YAxis type="category" dataKey="category" width={150} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                   <Tooltip 
                     cursor={{fill: 'transparent'}}
                     contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                   />
                   <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#60a5fa'} />
                      ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Executive Report */}
        <div className="glass-panel p-8 rounded-xl border border-cyber-border bg-cyber-dark/40 shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-6 border-b border-cyber-border pb-4 flex items-center gap-3 font-serif">
            <FileText size={20} className="text-cyber-gold" />
            Executive Summary
          </h3>
          <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-cyber-goldLight prose-a:text-cyber-gold">
             <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/20 mb-6 flex gap-3 items-start">
                <Briefcase className="text-blue-400 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-blue-200 m-0">
                  <strong className="text-blue-100">C-Level View:</strong> High-level business risks, financial exposure, and compliance status.
                </p>
             </div>
             <ReactMarkdown>{data.executiveSummary}</ReactMarkdown>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tech Stack Column */}
          <div className="lg:col-span-1 space-y-6">
             <TechStack stack={data.techStack || []} headers={data.headers || []} />
             
             {/* Risk Pie Chart */}
             <div className="glass-panel p-6 rounded-xl border border-cyber-border">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-serif">
                  <Target size={18} className="text-cyber-gold"/>
                  Risk Severity Split
                </h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}/>
                      <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
             </div>

             {/* Pro Connect */}
             <div className="glass-panel p-6 rounded-xl border border-cyber-gold/30 bg-gradient-to-br from-cyber-gold/10 to-transparent">
               <div className="flex items-start gap-4">
                 <div className="bg-cyber-gold p-3 rounded-xl text-cyber-darker shadow-lg">
                   <UserCheck size={28} />
                 </div>
                 <div>
                   <h4 className="text-white font-bold text-lg mb-1 font-serif">Manual Audit</h4>
                   <p className="text-xs text-gray-300 mb-4">
                     Request a manual Deep Dive by certified OSCE/OSCP engineers.
                   </p>
                   <button className="w-full py-2 bg-cyber-gold hover:bg-white text-cyber-darker font-bold rounded-lg text-xs transition-all uppercase tracking-widest">
                     Request Specialist
                   </button>
                 </div>
               </div>
             </div>
          </div>

          {/* Vulnerabilities Column */}
          <div className="lg:col-span-2 space-y-6">
             <VulnerabilityList vulnerabilities={data.vulnerabilities || []} />
          </div>
        </div>

        {/* Sitemap / API Routes (Only for URL scans) */}
        {data.scanType === 'url' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 page-break-inside-avoid">
             <div className="glass-panel p-6 rounded-xl border border-cyber-border max-h-96 overflow-y-auto custom-scrollbar">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2 font-serif sticky top-0 bg-cyber-panel/95 backdrop-blur py-2 z-10">
                  <Network size={16} className="text-cyber-gold" />
                  Topology Map <span className="text-xs font-mono font-normal text-gray-500 ml-auto">{data.sitemap?.length || 0} Nodes</span>
                </h4>
                <ul className="space-y-2 font-mono text-sm text-gray-400">
                   {(data.sitemap || []).map((url, i) => (
                     <li key={i} className="flex items-center gap-2 hover:text-cyber-gold transition-colors p-1 rounded hover:bg-white/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyber-gold/50"></div>
                        <span className="truncate">{url}</span>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="ml-auto opacity-0 group-hover:opacity-100"><ExternalLink size={12}/></a>
                     </li>
                   ))}
                </ul>
             </div>

             <div className="glass-panel p-6 rounded-xl border border-cyber-border max-h-96 overflow-y-auto custom-scrollbar">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2 font-serif sticky top-0 bg-cyber-panel/95 backdrop-blur py-2 z-10">
                  <Code size={16} className="text-cyber-warning" />
                  API Surface <span className="text-xs font-mono font-normal text-gray-500 ml-auto">{data.apiEndpoints?.length || 0} Routes</span>
                </h4>
                 <ul className="space-y-2 font-mono text-sm text-gray-400">
                   {(data.apiEndpoints || []).map((url, i) => (
                     <li key={i} className="flex items-center gap-2 hover:text-cyber-warning transition-colors p-1 rounded hover:bg-white/5">
                        <div className="px-1.5 py-0.5 bg-cyber-warning/10 text-cyber-warning text-[10px] rounded border border-cyber-warning/20 font-bold">GET</div>
                        <span className="truncate">{url}</span>
                     </li>
                   ))}
                </ul>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};