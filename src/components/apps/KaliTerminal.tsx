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
        const target = args[0];
        return `Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toISOString().slice(0, 19)} UTC
Nmap scan report for ${target}
Host is up (0.00050s latency).
Not shown: 996 closed ports
PORT     STATE SERVICE    VERSION
21/tcp   open  ftp        vsftpd 3.0.3
22/tcp   open  ssh        OpenSSH 8.2p1 Ubuntu 4ubuntu0.5
53/tcp   open  domain     ISC BIND 9.16.1-Ubuntu
80/tcp   open  http       Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-title: Apache2 Ubuntu Default Page
443/tcp  open  ssl/http   Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-title: Apache2 Ubuntu Default Page
8080/tcp open  http-proxy Squid http proxy 4.10
|_http-server-header: squid/4.10
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 15.84 seconds`;

      case 'hydra':
        if (!args[0] || !args[1]) {
          return `Hydra v9.4 (c) 2022 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes.

Syntax: hydra [[[-l LOGIN|-L FILE] [-p PASS|-P FILE]] | [-C FILE]] [-e nsr] [-o FILE] [-t TASKS] [-M FILE [-T TASKS]] [-w TIME] [-W TIME] [-f] [-s PORT] [-x MIN:MAX:CHARSET] [-c TIME] [-ISOuvVd46] [-m MODULE_OPT] [service://server[:PORT][/OPT]]

Example: hydra -l user -P passlist.txt 192.168.1.1 ssh`;
        }
        return `Hydra v9.4 (c) 2022 by van Hauser/THC & David Maciejak
[INFO] Starting attack on ${args[0]}
[DATA] max 16 tasks, attacking ssh://192.168.1.1:22/
[ATTEMPT] target 192.168.1.1 - login "admin" - pass "123456" - 1 of 100 [child 0] (0/0)
[ATTEMPT] target 192.168.1.1 - login "admin" - pass "password" - 2 of 100 [child 1] (0/0)
[ATTEMPT] target 192.168.1.1 - login "admin" - pass "admin" - 3 of 100 [child 2] (0/0)
[22][ssh] host: 192.168.1.1   login: admin   password: admin
1 of 1 target successfully completed, 1 valid password found`;

      case 'john':
        if (!args[0]) {
          return `John the Ripper 1.9.0-jumbo-1+bleeding-aee1328d6c 2021-11-02 10:45:52 +0100 OMP [linux-gnu 64-bit x86_64 AVX2 AC]

Usage: john [OPTIONS] [PASSWORD-FILES]
       john --single [PASSWORD-FILES]
       john --wordlist=FILE [PASSWORD-FILES]
       john --incremental [PASSWORD-FILES]

Example: john --wordlist=/usr/share/wordlists/rockyou.txt /etc/shadow`;
        }
        return `John the Ripper 1.9.0-jumbo-1+bleeding-aee1328d6c
Loaded 3 password hashes with 3 different salts (sha512crypt, crypt(3) $6$ [SHA512 256/256 AVX2 4x])
Will run 8 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
admin123         (user1)
password1        (user2)
letmein          (user3)
3g 0:00:00:42 DONE (2024-01-15 14:23) 0.07g/s 1234p/s 1234c/s 1234C/s
Use the "--show" option to display all of the cracked passwords reliably`;

      case 'sqlmap':
        if (!args[0]) {
          return `sqlmap/1.7.2#stable (http://sqlmap.org)

Usage: python3 sqlmap.py [options]

Example: sqlmap -u "http://example.com/page.php?id=1" --dbs`;
        }
        return `sqlmap/1.7.2#stable (http://sqlmap.org)

[*] starting @ ${new Date().toTimeString().slice(0, 8)}
[*] testing connection to the target URL
[*] checking if the target is protected by some kind of WAF/IPS
[*] testing if the parameter 'id' is dynamic
[*] confirming that parameter 'id' is dynamic
[*] parameter 'id' appears to be injectable
[*] testing for SQL injection on parameter 'id'
[*] the back-end DBMS is MySQL
back-end DBMS: MySQL >= 5.0
available databases [3]:
[*] information_schema
[*] mysql
[*] testdb`;

      case 'metasploit':
        return `                                                  
      .:okOOOkdc'           'cdkOOOko:.                                                                                                                         
    .xOOOOOOOOOOOOc       cOOOOOOOOOOOOx.                                                                                                                     
   :OOOOOOOOOOOOOOOk,   ,kOOOOOOOOOOOOOOO:                                                                                                                    
  'OOOOOOOOOkkkkOOOOO: :OOOOOOOOOOOOOOOOOO'                                                                                                                   
  oOOOOOOOO.MMMM.oOOOOoOOOOl.MMMM,OOOOOOOOo                                                                                                                   
  dOOOOOOOO.MMMMMM.cOOOOOc.MMMMMM,OOOOOOOOx                                                                                                                   
  lOOOOOOOO.MMMMMMMMM;d;MMMMMMMMM,OOOOOOOOl                                                                                                                   
  .OOOOOOOO.MMM.;MMMMMMMMM;MMMM.,OOOOOOOO.                                                                                                                    
   cOOOOOOO.MMM.OOc.MMMMM'oOO.MMM,OOOOOOOc                                                                                                                    
    oOOOOOO.MMM.OOOO.MMM:OOOO.MMM,OOOOOOo                                                                                                                     
     lOOOOO.MMM.OOOO.MMM:OOOO.MMM,OOOOOl                                                                                                                      
      ;OOOO'MMM.OOOO.MMM:OOOO.MMM;OOOO;                                                                                                                       
       .dOOo'WM.OOOOocccxOOOO.MX'xOOd.                                                                                                                        
         ,kOl'M.OOOOOOOOOOOOO.M'dOk,                                                                                                                          
           :kk;.OOOOOOOOOOOOO.;Od:                                                                                                                            
             ;kOOOOOOOOOOOOOOOk:                                                                                                                              
               ,xOOOOOOOOOOOx,                                                                                                                                
                 .lOOOOOOOl.                                                                                                                                  
                   ,dOd,                                                                                                                                      
                     .                   

       =[ metasploit v6.3.4-dev-                          ]
+ -- --=[ 2296 exploits - 1202 auxiliary - 409 post       ]
+ -- --=[ 951 payloads - 45 encoders - 11 nops            ]
+ -- --=[ 9 evasion                                        ]

msf6 > use exploit/multi/handler
[*] Using configured payload generic/shell_reverse_tcp
msf6 exploit(multi/handler) > set LHOST 192.168.1.100
LHOST => 192.168.1.100
msf6 exploit(multi/handler) > set LPORT 4444
LPORT => 4444
msf6 exploit(multi/handler) > exploit

[*] Started reverse TCP handler on 192.168.1.100:4444`;

      case 'wireshark':
        return `Wireshark 4.0.3 (Git v4.0.3 packaged as 4.0.3-1)
Copyright 1998-2023 Gerald Combs <gerald@wireshark.org> and contributors.

Capturing on 'eth0'
  1   0.000000 192.168.1.1  → 192.168.1.100 TCP 78 22 → 54321 [SYN] Seq=0 Win=29200 Len=0 MSS=1460 SACK_PERM=1
  2   0.000123 192.168.1.100 → 192.168.1.1  TCP 74 54321 → 22 [SYN, ACK] Seq=0 Ack=1 Win=28960 Len=0 MSS=1460
  3   0.000156 192.168.1.1  → 192.168.1.100 TCP 66 22 → 54321 [ACK] Seq=1 Ack=1 Win=29200 Len=0
  4   0.234567 192.168.1.1  → 192.168.1.100 SSH 98 Client: Protocol (SSH-2.0-OpenSSH_8.2p1)
  5   0.234890 192.168.1.100 → 192.168.1.1  SSH 98 Server: Protocol (SSH-2.0-OpenSSH_8.2p1)

Use 'tshark' for command-line packet analysis
Example: tshark -i eth0 -c 10`;

      case 'openapp':
        if (args[0]) {
          const appMap: { [key: string]: { app: string; title: string } } = {
            'terminal': { app: 'kali-terminal', title: 'Terminal' },
            'files': { app: 'filesystem', title: 'Files' },
            'editor': { app: 'editor', title: 'Text Editor' },
            'calculator': { app: 'calculator', title: 'Calculator' },
            'firefox': { app: 'browser', title: 'Spark Browser' },
            'youtube': { app: 'youtube', title: 'YouTube' },
            'spotify': { app: 'spotify', title: 'Spotify' },
            'music': { app: 'spotify', title: 'Spotify' },
            'doom': { app: 'doom', title: 'Doom Clone' },
            'games': { app: 'games', title: 'Game Library' },
            'writer': { app: 'libreoffice-writer', title: 'LibreOffice Writer' },
            'calc': { app: 'libreoffice-calc', title: 'LibreOffice Calc' },
            'programming': { app: 'programming', title: 'Programming IDE' },
            'ide': { app: 'programming', title: 'Programming IDE' },
            'tasks': { app: 'task-manager', title: 'Task Manager' },
            'drive': { app: 'google-drive', title: 'Google Drive' },
            'tupack': { app: 'tupack', title: 'Tupack Package Manager' },
            'bazaar': { app: 'bazaar', title: 'Bazaar App Store' },
            'browser': { app: 'browser', title: 'Spark Browser' },
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