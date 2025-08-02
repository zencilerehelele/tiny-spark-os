import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon } from "lucide-react";

interface Command {
  input: string;
  output: string;
}

const KaliTerminal = () => {
  const [input, setInput] = useState("");
  const [commands, setCommands] = useState<Command[]>([
    { input: "", output: "Kali GNU/Linux Rolling kali 6.1.0-kali3-amd64\nLast login: " + new Date().toLocaleDateString() + " from 127.0.0.1" }
  ]);
  const [currentDir, setCurrentDir] = useState("/home/kali");
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const fileSystem = {
    "/": {
      "home": {
        "kali": {
          "Desktop": {},
          "Documents": {
            "passwords.txt": "file",
            "exploits": {
              "buffer_overflow.py": "file",
              "sql_injection.sh": "file"
            }
          },
          "Downloads": {
            "metasploit.tar.gz": "file",
            "nmap_scan.txt": "file"
          },
          "tools": {
            "custom_scanner.py": "file",
            "hash_cracker.c": "file"
          }
        }
      },
      "usr": {
        "bin": {
          "nmap": "file",
          "hydra": "file",
          "john": "file",
          "sqlmap": "file"
        },
        "share": {
          "wordlists": {
            "rockyou.txt": "file",
            "common.txt": "file"
          }
        }
      },
      "var": {
        "log": {
          "access.log": "file",
          "error.log": "file"
        }
      },
      "etc": {
        "passwd": "file",
        "shadow": "file",
        "hosts": "file"
      }
    }
  };

  const executeCommand = (input: string): string => {
    const [cmd, ...args] = input.trim().split(' ');
    
    switch (cmd.toLowerCase()) {
      case '':
        return '';
      
      case 'help':
        return `Available commands:
ls - list directory contents
cd <directory> - change directory  
pwd - print working directory
cat <file> - display file contents
whoami - display current user
uname -a - system information
clear - clear terminal
nmap <target> - network mapping tool
hydra - password cracking tool
john - John the Ripper password cracker
sqlmap - SQL injection tool
metasploit - exploitation framework
wireshark - network protocol analyzer
openapp <name> - open application`;

      case 'ls':
        const path = currentDir.split('/').filter(p => p);
        let current: any = fileSystem["/"];
        
        for (const part of path.slice(1)) {
          current = current[part];
        }
        
        if (!current) return 'ls: cannot access directory';
        
        const items = Object.keys(current).map(key => {
          const isDir = typeof current[key] === 'object' && current[key] !== null;
          return isDir ? `\x1b[34m${key}/\x1b[0m` : `\x1b[32m${key}\x1b[0m`;
        });
        
        return items.join('  ');

      case 'pwd':
        return currentDir;

      case 'cd':
        if (!args[0]) return '';
        if (args[0] === '..') {
          const parts = currentDir.split('/').filter(p => p);
          parts.pop();
          setCurrentDir('/' + parts.join('/'));
          return '';
        }
        // Simplified cd - just update the display
        if (args[0].startsWith('/')) {
          setCurrentDir(args[0]);
        } else {
          setCurrentDir(currentDir + '/' + args[0]);
        }
        return '';

      case 'cat':
        if (!args[0]) return 'cat: missing file operand';
        return `Contents of ${args[0]}:\n[File contents would be displayed here]`;

      case 'whoami':
        return 'kali';

      case 'uname':
        if (args[0] === '-a') {
          return 'Linux kali 6.1.0-kali3-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.12-1kali1 (2023-02-16) x86_64 GNU/Linux';
        }
        return 'Linux';

      case 'clear':
        setCommands([]);
        return '';

      case 'date':
        return new Date().toString();

      case 'nmap':
        if (!args[0]) return 'nmap: missing target specification';
        return `Starting Nmap scan on ${args[0]}...
Nmap scan report for ${args[0]}
Host is up (0.00050s latency).
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
Nmap done: 1 IP address (1 host up) scanned in 2.15 seconds`;

      case 'hydra':
        return `Hydra v9.4 (c) 2022 by van Hauser/THC & David Maciejak
Syntax: hydra [[[-l LOGIN|-L FILE] [-p PASS|-P FILE]] | [-C FILE]] [-e nsr] [-o FILE] [-t TASKS] [-M FILE [-T TASKS]] [-w TIME] [-W TIME] [-f] [-s PORT] [-x MIN:MAX:CHARSET] [-c TIME] [-ISOuvVd46] [-m MODULE_OPT] [service://server[:PORT][/OPT]]`;

      case 'john':
        return `John the Ripper 1.9.0-jumbo-1+bleeding-aee1328d6c 2021-11-02 10:45:52 +0100 OMP [linux-gnu 64-bit x86_64 AVX2 AC]
Usage: john [OPTIONS] [PASSWORD-FILES]`;

      case 'sqlmap':
        return `sqlmap/1.7.2#stable (http://sqlmap.org)
Usage: python3 sqlmap.py [options]`;

      case 'metasploit':
        return `metasploit v6.3.4-dev-
       =[ metasploit v6.3.4-dev-                          ]
+ -- --=[ 2296 exploits - 1202 auxiliary - 409 post       ]
+ -- --=[ 951 payloads - 45 encoders - 11 nops            ]
+ -- --=[ 9 evasion                                        ]`;

      case 'wireshark':
        return `Wireshark 4.0.3 (Git v4.0.3 packaged as 4.0.3-1)
Copyright 1998-2023 Gerald Combs <gerald@wireshark.org> and contributors.`;

      case 'openapp':
        if (args[0]) {
          const appMap: { [key: string]: { app: string; title: string } } = {
            'terminal': { app: 'kali-terminal', title: 'Terminal' },
            'files': { app: 'filesystem', title: 'Files' },
            'editor': { app: 'editor', title: 'Text Editor' },
            'calculator': { app: 'calculator', title: 'Calculator' },
            'firefox': { app: 'firefox', title: 'Firefox' },
            'browser': { app: 'firefox', title: 'Firefox' },
            'youtube': { app: 'youtube', title: 'YouTube' },
            'spotify': { app: 'spotify', title: 'Spotify' },
            'music': { app: 'spotify', title: 'Spotify' },
            'games': { app: 'hotline-miami', title: 'Hotline Spark' },
            'hotline': { app: 'hotline-miami', title: 'Hotline Spark' },
            'writer': { app: 'libreoffice-writer', title: 'LibreOffice Writer' },
            'calc': { app: 'libreoffice-calc', title: 'LibreOffice Calc' },
            'programming': { app: 'programming', title: 'Programming IDE' },
            'ide': { app: 'programming', title: 'Programming IDE' },
            'tasks': { app: 'task-manager', title: 'Task Manager' },
            'drive': { app: 'google-drive', title: 'Google Drive' },
            'settings': { app: 'settings', title: 'Settings' }
          };
          
          const appInfo = appMap[args[0].toLowerCase()];
          if (appInfo) {
            const event = new CustomEvent('openApp', { detail: appInfo });
            window.dispatchEvent(event);
            return `Opening ${appInfo.title}...`;
          } else {
            return `openapp: application '${args[0]}' not found\nAvailable apps: ${Object.keys(appMap).join(', ')}`;
          }
        }
        return 'openapp: missing application name';

      default:
        return `bash: ${cmd}: command not found`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const output = executeCommand(input);
      setCommands(prev => [...prev, { input, output }]);
      setInput("");
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const formatOutput = (text: string) => {
    // Handle ANSI color codes
    return text
      .replace(/\x1b\[34m/g, '<span style="color: #5DADE2">')
      .replace(/\x1b\[32m/g, '<span style="color: #58D68D">')
      .replace(/\x1b\[31m/g, '<span style="color: #EC7063">')
      .replace(/\x1b\[0m/g, '</span>');
  };

  return (
    <div className="h-full bg-gray-900 text-green-400 font-mono text-sm flex flex-col">
      {/* Terminal Header */}
      <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4" />
          <span className="text-white">kali@kali: {currentDir}</span>
        </div>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto whitespace-pre-wrap"
        onClick={() => inputRef.current?.focus()}
      >
        {commands.map((command, index) => (
          <div key={index} className="mb-2">
            {command.input && (
              <div className="flex">
                <span className="text-red-400">┌──(</span>
                <span className="text-blue-400">kali@kali</span>
                <span className="text-red-400">)-[</span>
                <span className="text-white">{currentDir}</span>
                <span className="text-red-400">]</span>
                <br />
                <span className="text-red-400">└─</span>
                <span className="text-blue-400">$ </span>
                <span className="text-white">{command.input}</span>
              </div>
            )}
            {command.output && (
              <div 
                className="text-green-400 mt-1"
                dangerouslySetInnerHTML={{ __html: formatOutput(command.output) }}
              />
            )}
          </div>
        ))}
        
        {/* Current Input Line */}
        <div className="flex">
          <span className="text-red-400">┌──(</span>
          <span className="text-blue-400">kali@kali</span>
          <span className="text-red-400">)-[</span>
          <span className="text-white">{currentDir}</span>
          <span className="text-red-400">]</span>
          <br />
          <span className="text-red-400">└─</span>
          <span className="text-blue-400">$ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-transparent border-none outline-none text-white flex-1 font-mono"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default KaliTerminal;