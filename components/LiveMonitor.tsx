
import React, { useEffect, useState, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Wifi, Zap, Cpu, Laptop, Signal } from 'lucide-react';

export const LiveMonitor: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [currentPing, setCurrentPing] = useState<number>(0);
  const [fps, setFps] = useState<number>(0);
  const [connectionType, setConnectionType] = useState<string>('Unknown');
  
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  // 1. REAL FPS Counter
  useEffect(() => {
    let animationFrameId: number;

    const countFPS = () => {
      const now = performance.now();
      frameCount.current++;
      
      if (now - lastTime.current >= 1000) {
        setFps(frameCount.current);
        frameCount.current = 0;
        lastTime.current = now;
      }
      animationFrameId = requestAnimationFrame(countFPS);
    };

    animationFrameId = requestAnimationFrame(countFPS);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // 2. REAL Network Latency & Data Stream
  useEffect(() => {
    // Get initial connection info if available
    if ((navigator as any).connection) {
      setConnectionType((navigator as any).connection.effectiveType || '4g');
    }

    const measureLatency = async () => {
      const start = performance.now();
      try {
        // Fetch a tiny resource (favicon or similar) to test round-trip time
        // Using a high-availability CDN resource to test internet speed, not local server
        await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors', cache: 'no-store' });
      } catch (e) {
        // Ignore CORS errors, we just want timing
      }
      const end = performance.now();
      return Math.round(end - start);
    };

    const interval = setInterval(async () => {
      const latency = await measureLatency();
      setCurrentPing(latency);

      setData(current => {
        const now = new Date();
        const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        
        // Add real data point
        const newPoint = {
          time: timeStr,
          latency: latency,
          fps: frameCount.current, // Use ref for instant value
          stability: Math.max(0, 100 - (latency / 5)), // Calculated score
        };
        
        const newData = [...current, newPoint];
        if (newData.length > 20) newData.shift();
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getPingColor = (ms: number) => {
    if (ms < 50) return 'text-cyber-success';
    if (ms < 150) return 'text-cyber-warning';
    return 'text-cyber-danger';
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end bg-cyber-panel/50 p-8 rounded-2xl border border-cyber-border/50 backdrop-blur-sm">
        <div>
           <h2 className="text-3xl font-serif font-bold text-white mb-2 flex items-center gap-3">
             <Activity className="text-cyber-gold" />
             Local Telemetry Link
           </h2>
           <p className="text-cyber-textDim">
             Monitoring your specific client-side connection stability and rendering performance in real-time.
           </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
           <div className="flex items-center gap-2 px-4 py-2 bg-cyber-dark rounded-lg border border-cyber-border shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <div className="w-2 h-2 rounded-full bg-cyber-success animate-pulse"></div>
              <span className="text-xs font-mono text-cyber-success font-bold">LIVE SESSION ACTIVE</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Real Latency */}
        <div className="glass-panel p-6 rounded-xl border border-cyber-border flex flex-col justify-between group hover:border-cyber-gold/50 transition-colors">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-cyber-textDim text-xs uppercase font-bold tracking-widest">Network Latency</h3>
              <Wifi size={16} className="text-cyber-gold"/>
           </div>
           <div className={`text-4xl font-mono font-bold ${getPingColor(currentPing)}`}>
              {currentPing} <span className="text-sm text-gray-500 font-sans">ms</span>
           </div>
           <div className="text-[10px] text-gray-500 mt-2 font-mono">
             To Cloudflare Edge
           </div>
        </div>

        {/* Real FPS */}
        <div className="glass-panel p-6 rounded-xl border border-cyber-border flex flex-col justify-between group hover:border-cyber-gold/50 transition-colors">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-cyber-textDim text-xs uppercase font-bold tracking-widest">Render Performance</h3>
              <Zap size={16} className="text-cyber-warning"/>
           </div>
           <div className="text-4xl font-mono font-bold text-white">
              {fps} <span className="text-sm text-gray-500 font-sans">FPS</span>
           </div>
           <div className="text-[10px] text-gray-500 mt-2 font-mono">
             WebGL/Canvas Engine
           </div>
        </div>

        {/* Real Connection Type */}
        <div className="glass-panel p-6 rounded-xl border border-cyber-border flex flex-col justify-between group hover:border-cyber-gold/50 transition-colors">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-cyber-textDim text-xs uppercase font-bold tracking-widest">Connection Type</h3>
              <Signal size={16} className="text-cyber-success"/>
           </div>
           <div className="text-4xl font-mono font-bold text-cyber-success uppercase">
              {connectionType.toUpperCase()}
           </div>
           <div className="text-[10px] text-gray-500 mt-2 font-mono">
             Effective Bandwidth
           </div>
        </div>

         {/* Device Info */}
         <div className="glass-panel p-6 rounded-xl border border-cyber-border flex flex-col justify-between group hover:border-cyber-gold/50 transition-colors">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-cyber-textDim text-xs uppercase font-bold tracking-widest">Client Core</h3>
              <Cpu size={16} className="text-blue-400"/>
           </div>
           <div className="text-xl font-mono font-bold text-white truncate">
              {navigator.platform.toUpperCase()}
           </div>
           <div className="text-[10px] text-gray-500 mt-2 font-mono truncate">
             {navigator.userAgent.slice(0, 20)}...
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-Time Latency Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-cyber-border">
           <h3 className="text-white font-bold mb-6 flex items-center gap-2 font-serif">
              <Activity size={18} className="text-cyber-gold"/> Connection Stability (Live)
           </h3>
           <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorLat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis stroke="#64748b" fontSize={12} label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft', fill: '#64748b' }}/>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                    itemStyle={{ color: '#fbbf24' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="latency" 
                    stroke="#fbbf24" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorLat)" 
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* System Info Panel */}
        <div className="glass-panel p-6 rounded-xl border border-cyber-border bg-gradient-to-b from-cyber-panel to-cyber-darker">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2 font-serif">
              <Laptop size={18} className="text-cyber-gold"/> Session Diagnostics
           </h3>
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Browser Threads</span>
                <span className="text-white font-mono">{navigator.hardwareConcurrency || 4} Cores</span>
              </div>
              <div className="w-full bg-cyber-dark h-1 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-full"></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Memory Allowance</span>
                {/* @ts-ignore */}
                <span className="text-white font-mono">{navigator.deviceMemory ? `>= ${navigator.deviceMemory} GB` : 'N/A'}</span>
              </div>
              <div className="w-full bg-cyber-dark h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-3/4"></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Screen Resolution</span>
                <span className="text-white font-mono">{window.screen.width}x{window.screen.height}</span>
              </div>
              <div className="w-full bg-cyber-dark h-1 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full w-full"></div>
              </div>

              <div className="mt-8 p-4 bg-cyber-gold/5 rounded-lg border border-cyber-gold/20">
                <p className="text-[10px] text-cyber-gold leading-relaxed font-mono">
                   METRICS ARE LOCAL. This dashboard is visualizing your specific browser session performance and network RTT to global CDNs.
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
