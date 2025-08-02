import React, { useState } from "react";
import { Play, Save, FolderOpen, Code, Terminal as TerminalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProgrammingApp = () => {
  const [code, setCode] = useState(`// Welcome to Spark IDE
console.log("Hello, World!");

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci(10):", fibonacci(10));`);
  
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running code...\n");
    
    // Simulate code execution
    setTimeout(() => {
      try {
        if (language === "javascript") {
          // Create a simple sandbox to execute JavaScript
          let consoleOutput = "";
          const mockConsole = {
            log: (...args: any[]) => {
              consoleOutput += args.join(" ") + "\n";
            }
          };
          
          // Simple eval with console.log capture
          const wrappedCode = `
            (function() {
              const console = arguments[0];
              ${code}
            })
          `;
          
          eval(wrappedCode)(mockConsole);
          setOutput(consoleOutput || "Code executed successfully (no output)");
        } else {
          setOutput(`${language} execution simulated:\nCode compiled and executed successfully!`);
        }
      } catch (error) {
        setOutput(`Error: ${error}`);
      }
      setIsRunning(false);
    }, 1000);
  };

  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language === 'javascript' ? 'js' : language}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full bg-background text-foreground flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-muted border-b border-border">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-os-primary" />
          <span className="font-semibold">Spark IDE</span>
        </div>
        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="java">Java</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={saveCode}>
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button variant="default" size="sm" onClick={runCode} disabled={isRunning}>
            <Play className="w-4 h-4 mr-1" />
            {isRunning ? "Running..." : "Run"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="p-2 bg-muted/50 border-b border-border">
            <span className="text-sm font-medium">Editor</span>
          </div>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 border-0 rounded-none resize-none font-mono text-sm"
            placeholder="Write your code here..."
          />
        </div>

        {/* Output Panel */}
        <div className="w-80 flex flex-col border-l border-border">
          <div className="p-2 bg-muted/50 border-b border-border flex items-center gap-2">
            <TerminalIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Output</span>
          </div>
          <div className="flex-1 p-3 bg-terminal-bg text-terminal-text font-mono text-sm overflow-y-auto whitespace-pre-wrap">
            {output || "Ready to run code..."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgrammingApp;