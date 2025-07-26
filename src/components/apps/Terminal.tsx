import React, { useState, useRef, useEffect } from "react";

interface Command {
  input: string;
  output: string[];
}

export const Terminal = () => {
  const [commands, setCommands] = useState<Command[]>([
    { input: "", output: ["Welcome to TinySpark Midnight Terminal", "Type 'help' for available commands", ""] }
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const executeCommand = (input: string) => {
    const cmd = input.trim().toLowerCase();
    let output: string[] = [];

    switch (cmd) {
      case "help":
        output = [
          "Available commands:",
          "  help      - Show this help message",
          "  ls        - List directory contents",
          "  pwd       - Print working directory",
          "  date      - Show current date and time",
          "  whoami    - Show current user",
          "  clear     - Clear terminal",
          "  uname     - System information",
          "  echo [text] - Echo text",
          "  openapp [app] - Open an application",
          "    Available apps: browser, files, editor, word, spreadsheet, calculator, music, youtube, games, settings",
          ""
        ];
        break;
      case "ls":
        output = ["Documents/", "Downloads/", "Pictures/", "Desktop/", "Music/", "Videos/", ""];
        break;
      case "pwd":
        output = ["/home/user", ""];
        break;
      case "date":
        output = [new Date().toString(), ""];
        break;
      case "whoami":
        output = ["user", ""];
        break;
      case "clear":
        setCommands([{ input: "", output: [] }]);
        setCurrentInput("");
        return;
      case "uname":
        output = ["TinySpark Midnight 2.0.0", ""];
        break;
      default:
        if (cmd.startsWith("echo ")) {
          output = [input.slice(5), ""];
        } else if (cmd.startsWith("openapp ")) {
          const appName = input.slice(8).trim().toLowerCase();
          const appMap: { [key: string]: { app: string; title: string } } = {
            'browser': { app: 'browser', title: 'Browser' },
            'files': { app: 'files', title: 'Files' },
            'editor': { app: 'editor', title: 'Text Editor' },
            'word': { app: 'word', title: 'Word Processor' },
            'spreadsheet': { app: 'spreadsheet', title: 'Spreadsheet' },
            'calculator': { app: 'calculator', title: 'Calculator' },
            'music': { app: 'music', title: 'Music' },
            'youtube': { app: 'youtube', title: 'YouTube' },
            'games': { app: 'games', title: 'Games' },
            'settings': { app: 'settings', title: 'Settings' }
          };
          
          if (appMap[appName]) {
            window.dispatchEvent(new CustomEvent('openApp', { 
              detail: appMap[appName]
            }));
            output = [`Opening ${appMap[appName].title}...`, ""];
          } else {
            output = [`Unknown app: ${appName}`, "Available apps: browser, files, editor, word, spreadsheet, calculator, music, youtube, games, settings", ""];
          }
        } else if (cmd === "") {
          output = [""];
        } else {
          output = [`Command not found: ${cmd}`, "Type 'help' for available commands", ""];
        }
    }

    setCommands(prev => [...prev, { input, output }]);
    setCurrentInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(currentInput);
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="h-full bg-black text-green-400 font-mono text-sm flex flex-col">
      {/* Header */}
      <div className="bg-slate-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <div className="flex items-center justify-center w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded text-white text-xs font-bold">
              TS
            </div>
            <span className="text-white text-sm font-medium">Terminal</span>
          </div>
        </div>
      </div>
      
      {/* Terminal Content */}
      <div 
        className="flex-1 bg-black text-green-400 font-mono text-sm p-4 overflow-auto"
        ref={terminalRef}
        onClick={() => inputRef.current?.focus()}
        style={{ fontFamily: 'monospace' }}
      >
      {commands.map((command, index) => (
        <div key={index}>
          {command.input && (
            <div className="flex">
              <span className="text-green-300">user@tinyspark-midnight</span>
              <span className="text-white">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-white">$ </span>
              <span>{command.input}</span>
            </div>
          )}
          {command.output.map((line, lineIndex) => (
            <div key={lineIndex} className="whitespace-pre-wrap">
              {line}
            </div>
          ))}
        </div>
      ))}
      
      <div className="flex">
        <span className="text-green-300">user@tinyspark-midnight</span>
        <span className="text-white">:</span>
        <span className="text-blue-400">~</span>
        <span className="text-white">$ </span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-transparent outline-none text-green-400"
          autoFocus
        />
      </div>
      </div>
    </div>
  );
};