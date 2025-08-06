import React, { useState, useEffect } from "react";
import { Globe, Code, Database, Cpu, Monitor, Network } from "lucide-react";

interface BrowserComponent {
  name: string;
  status: 'idle' | 'active' | 'processing';
  description: string;
  icon: React.ReactNode;
}

const BrowserEngine = () => {
  const [components, setComponents] = useState<BrowserComponent[]>([
    {
      name: "HTML Parser",
      status: 'active',
      description: "Parsing DOM structure and semantic markup",
      icon: <Code className="w-5 h-5" />
    },
    {
      name: "CSS Engine",
      status: 'active', 
      description: "Processing stylesheets and computing layouts",
      icon: <Monitor className="w-5 h-5" />
    },
    {
      name: "JavaScript V8",
      status: 'processing',
      description: "Executing scripts and handling dynamic content",
      icon: <Cpu className="w-5 h-5" />
    },
    {
      name: "Networking",
      status: 'active',
      description: "Managing HTTP/HTTPS requests and responses",
      icon: <Network className="w-5 h-5" />
    },
    {
      name: "Rendering Engine",
      status: 'active',
      description: "Painting pixels and compositing layers",
      icon: <Globe className="w-5 h-5" />
    },
    {
      name: "Data Storage",
      status: 'idle',
      description: "LocalStorage, SessionStorage, IndexedDB management",
      icon: <Database className="w-5 h-5" />
    }
  ]);

  const [logs, setLogs] = useState<string[]>([
    "[INFO] Browser engine initialized",
    "[INFO] Security sandbox activated",
    "[INFO] Ready for page requests"
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = [
        "[DEBUG] Garbage collection completed",
        "[INFO] Cache updated for improved performance", 
        "[DEBUG] DOM mutation observed",
        "[INFO] Network request completed in 45ms",
        "[DEBUG] JavaScript execution context created",
        "[INFO] CSS reflow triggered by viewport change"
      ][Math.floor(Math.random() * 6)];
      
      setLogs(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()} ${newLog}`]);
      
      // Randomly update component statuses
      setComponents(prev => prev.map(comp => ({
        ...comp,
        status: Math.random() > 0.8 ? 'processing' : Math.random() > 0.3 ? 'active' : 'idle'
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'processing': return 'text-yellow-400 bg-yellow-400/20';
      case 'idle': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="h-full bg-black text-white font-mono p-4 overflow-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-400 mb-2">Browser Engine Status</h1>
        <p className="text-gray-400">Real-time monitoring of browser components</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {components.map((component, index) => (
          <div key={index} className="bg-gray-900 border border-gray-700 rounded p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {component.icon}
                <span className="font-bold">{component.name}</span>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(component.status)}`}>
                {component.status.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-400">{component.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded p-4">
        <h2 className="text-lg font-bold text-green-400 mb-3">Engine Logs</h2>
        <div className="bg-black rounded p-3 max-h-64 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="text-sm text-green-300 font-mono mb-1">
              {log}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-gray-900 border border-gray-700 rounded p-4">
        <h2 className="text-lg font-bold text-blue-400 mb-3">Performance Metrics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-400">DOM Nodes:</span>
            <span className="ml-2 text-white">{Math.floor(Math.random() * 1000 + 500)}</span>
          </div>
          <div>
            <span className="text-gray-400">JS Heap:</span>
            <span className="ml-2 text-white">{(Math.random() * 50 + 10).toFixed(1)} MB</span>
          </div>
          <div>
            <span className="text-gray-400">Render Time:</span>
            <span className="ml-2 text-white">{(Math.random() * 100 + 20).toFixed(0)} ms</span>
          </div>
          <div>
            <span className="text-gray-400">Cache Size:</span>
            <span className="ml-2 text-white">{(Math.random() * 200 + 50).toFixed(1)} MB</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserEngine;