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
          "    Available apps: browser, files, editor, calculator, music, youtube, games, settings",
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
            output = [`Unknown app: ${appName}`, "Available apps: browser, files, editor, calculator, music, youtube, games, settings", ""];
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
    <div 
      className="h-full bg-terminal-bg text-terminal-text font-mono text-sm p-4 overflow-auto"
      ref={terminalRef}
      onClick={() => inputRef.current?.focus()}
    >
      {commands.map((command, index) => (
        <div key={index}>
          {command.input && (
            <div className="flex">
              <span className="text-terminal-prompt">user@tinyspark-midnight:~$ </span>
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
        <span className="text-terminal-prompt">user@tinyspark-midnight:~$ </span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-transparent outline-none text-terminal-text"
          autoFocus
        />
      </div>
    </div>
  );
};