import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, RotateCcw } from "lucide-react";

interface Process {
  id: number;
  name: string;
  cpu: number;
  memory: number;
  status: 'Running' | 'Sleeping' | 'Stopped';
}

const TaskManager = () => {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 1, name: "Firefox Browser", cpu: 15.2, memory: 512, status: 'Running' },
    { id: 2, name: "Terminal", cpu: 2.1, memory: 64, status: 'Running' },
    { id: 3, name: "File Manager", cpu: 1.8, memory: 128, status: 'Running' },
    { id: 4, name: "Music Player", cpu: 8.5, memory: 256, status: 'Running' },
    { id: 5, name: "Text Editor", cpu: 0.5, memory: 32, status: 'Sleeping' },
    { id: 6, name: "Calculator", cpu: 0.1, memory: 16, status: 'Sleeping' },
    { id: 7, name: "Hotline Spark", cpu: 12.3, memory: 384, status: 'Running' },
    { id: 8, name: "Spotify", cpu: 6.7, memory: 298, status: 'Running' }
  ]);

  const [sortBy, setSortBy] = useState<'name' | 'cpu' | 'memory'>('cpu');
  const [systemStats, setSystemStats] = useState({
    totalCpu: 0,
    totalMemory: 0,
    availableMemory: 8192
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setProcesses(prev => prev.map(process => ({
        ...process,
        cpu: Math.max(0, process.cpu + (Math.random() - 0.5) * 2),
        memory: Math.max(16, process.memory + (Math.random() - 0.5) * 10)
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Calculate system stats
  useEffect(() => {
    const totalCpu = processes.reduce((sum, p) => sum + p.cpu, 0);
    const totalMemory = processes.reduce((sum, p) => sum + p.memory, 0);
    setSystemStats({
      totalCpu: Math.min(100, totalCpu),
      totalMemory,
      availableMemory: 8192
    });
  }, [processes]);

  const killProcess = (id: number) => {
    setProcesses(prev => prev.filter(p => p.id !== id));
  };

  const sortedProcesses = [...processes].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'cpu':
        return b.cpu - a.cpu;
      case 'memory':
        return b.memory - a.memory;
      default:
        return 0;
    }
  });

  return (
    <div className="h-full bg-background text-foreground flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold">System Monitor</h2>
        <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
          <div className="bg-muted p-2 rounded">
            <div className="text-xs text-muted-foreground">CPU Usage</div>
            <div className="text-lg font-mono">{systemStats.totalCpu.toFixed(1)}%</div>
            <div className="w-full bg-background rounded-full h-2 mt-1">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${Math.min(100, systemStats.totalCpu)}%` }}
              />
            </div>
          </div>
          <div className="bg-muted p-2 rounded">
            <div className="text-xs text-muted-foreground">Memory Usage</div>
            <div className="text-lg font-mono">{systemStats.totalMemory} MB</div>
            <div className="w-full bg-background rounded-full h-2 mt-1">
              <div 
                className="bg-secondary h-2 rounded-full transition-all"
                style={{ width: `${(systemStats.totalMemory / systemStats.availableMemory) * 100}%` }}
              />
            </div>
          </div>
          <div className="bg-muted p-2 rounded">
            <div className="text-xs text-muted-foreground">Processes</div>
            <div className="text-lg font-mono">{processes.length}</div>
            <div className="text-xs mt-1">{processes.filter(p => p.status === 'Running').length} running</div>
          </div>
        </div>
      </div>

      {/* Process Table Header */}
      <div className="flex items-center justify-between p-2 bg-muted border-b border-border">
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'name' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSortBy('name')}
          >
            Process Name
          </Button>
          <Button
            variant={sortBy === 'cpu' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSortBy('cpu')}
          >
            CPU %
          </Button>
          <Button
            variant={sortBy === 'memory' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSortBy('memory')}
          >
            Memory
          </Button>
        </div>
        <Button variant="ghost" size="sm">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Process List */}
      <div className="flex-1 overflow-auto">
        {sortedProcesses.map((process) => (
          <div
            key={process.id}
            className="flex items-center justify-between p-3 border-b border-border hover:bg-muted/50"
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{process.name}</div>
              <div className={`text-xs ${
                process.status === 'Running' ? 'text-green-500' :
                process.status === 'Sleeping' ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {process.status}
              </div>
            </div>
            <div className="text-right min-w-16">
              <div className="font-mono text-sm">{process.cpu.toFixed(1)}%</div>
            </div>
            <div className="text-right min-w-20">
              <div className="font-mono text-sm">{process.memory.toFixed(0)} MB</div>
            </div>
            <div className="ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => killProcess(process.id)}
                className="h-6 w-6 p-0 hover:bg-red-500/20"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;