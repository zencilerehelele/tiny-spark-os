import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Folder, 
  File, 
  Home, 
  ArrowLeft, 
  Plus, 
  Search, 
  Grid, 
  List,
  Download,
  Image,
  Music,
  Video,
  Archive
} from "lucide-react";

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified: string;
  icon?: string;
}

const FileSystem = () => {
  const [currentPath, setCurrentPath] = useState("/home/kali");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const fileStructure: { [key: string]: FileItem[] } = {
    "/home/kali": [
      { name: "Desktop", type: 'folder', modified: "2024-01-15 14:30" },
      { name: "Documents", type: 'folder', modified: "2024-01-15 14:25" },
      { name: "Downloads", type: 'folder', modified: "2024-01-15 16:45" },
      { name: "Music", type: 'folder', modified: "2024-01-15 12:00" },
      { name: "Pictures", type: 'folder', modified: "2024-01-15 13:15" },
      { name: "Videos", type: 'folder', modified: "2024-01-15 11:30" },
      { name: "tools", type: 'folder', modified: "2024-01-15 10:00" },
      { name: ".bashrc", type: 'file', size: "3.1 KB", modified: "2024-01-15 09:45" }
    ],
    "/home/kali/Documents": [
      { name: "passwords.txt", type: 'file', size: "1.2 KB", modified: "2024-01-15 14:00" },
      { name: "notes.md", type: 'file', size: "5.4 KB", modified: "2024-01-15 13:30" },
      { name: "exploits", type: 'folder', modified: "2024-01-15 12:45" },
      { name: "research.pdf", type: 'file', size: "2.8 MB", modified: "2024-01-14 16:20" }
    ],
    "/home/kali/Documents/exploits": [
      { name: "buffer_overflow.py", type: 'file', size: "8.9 KB", modified: "2024-01-15 11:15" },
      { name: "sql_injection.sh", type: 'file', size: "3.4 KB", modified: "2024-01-15 10:30" },
      { name: "reverse_shell.c", type: 'file', size: "6.7 KB", modified: "2024-01-14 15:45" }
    ],
    "/home/kali/Downloads": [
      { name: "metasploit.tar.gz", type: 'file', size: "45.2 MB", modified: "2024-01-15 16:45" },
      { name: "nmap_scan.txt", type: 'file', size: "12.3 KB", modified: "2024-01-15 15:30" },
      { name: "wordlist.txt", type: 'file', size: "89.1 MB", modified: "2024-01-15 14:15" }
    ],
    "/home/kali/Music": [
      { name: "Girls Last Tour", type: 'folder', modified: "2024-01-15 12:00" },
      { name: "Lo-fi Beats", type: 'folder', modified: "2024-01-15 11:45" }
    ],
    "/home/kali/Music/Girls Last Tour": [
      { name: "01 - Ugoku, Ugoku.mp3", type: 'file', size: "3.4 MB", modified: "2024-01-15 12:00" },
      { name: "02 - More Life, More Everything.mp3", type: 'file', size: "4.1 MB", modified: "2024-01-15 12:00" }
    ],
    "/home/kali/Pictures": [
      { name: "screenshots", type: 'folder', modified: "2024-01-15 13:15" },
      { name: "wallpapers", type: 'folder', modified: "2024-01-15 13:00" }
    ],
    "/home/kali/Pictures/wallpapers": [
      { name: "girls-last-tour.jpg", type: 'file', size: "2.3 MB", modified: "2024-01-15 13:00" },
      { name: "mountain-landscape.jpg", type: 'file', size: "1.8 MB", modified: "2024-01-15 12:45" },
      { name: "neon-city.jpg", type: 'file', size: "3.1 MB", modified: "2024-01-15 12:30" }
    ]
  };

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'folder') return <Folder className="w-4 h-4 text-blue-500" />;
    
    const ext = item.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="w-4 h-4 text-green-500" />;
      case 'mp3':
      case 'wav':
      case 'flac':
        return <Music className="w-4 h-4 text-purple-500" />;
      case 'mp4':
      case 'avi':
      case 'mkv':
        return <Video className="w-4 h-4 text-red-500" />;
      case 'zip':
      case 'tar':
      case 'gz':
        return <Archive className="w-4 h-4 text-yellow-500" />;
      default:
        return <File className="w-4 h-4 text-gray-400" />;
    }
  };

  const navigateToPath = (path: string) => {
    setCurrentPath(path);
    setSelectedItems([]);
  };

  const handleItemDoubleClick = (item: FileItem) => {
    if (item.type === 'folder') {
      const newPath = currentPath === '/' ? `/${item.name}` : `${currentPath}/${item.name}`;
      navigateToPath(newPath);
    }
  };

  const goBack = () => {
    const pathParts = currentPath.split('/').filter(p => p);
    pathParts.pop();
    const newPath = pathParts.length === 0 ? '/home/kali' : '/' + pathParts.join('/');
    navigateToPath(newPath);
  };

  const toggleItemSelection = (itemName: string) => {
    setSelectedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const currentItems = fileStructure[currentPath] || [];
  const filteredItems = currentItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full bg-background text-foreground flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">File Manager</h2>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigateToPath('/home/kali')}>
            <Home className="w-4 h-4" />
          </Button>
          <div className="flex-1 bg-muted rounded px-3 py-1 text-sm font-mono">
            {currentPath}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            placeholder="Search files and folders..."
          />
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-auto p-4">
        {filteredItems.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            {searchQuery ? 'No files found matching your search' : 'This folder is empty'}
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 p-2 text-sm font-medium text-muted-foreground border-b border-border">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-4">Modified</div>
            </div>
            
            {/* Files */}
            {filteredItems.map((item) => (
              <div
                key={item.name}
                className={`
                  grid grid-cols-12 gap-4 p-2 rounded hover:bg-muted cursor-pointer
                  ${selectedItems.includes(item.name) ? 'bg-primary/20' : ''}
                `}
                onClick={() => toggleItemSelection(item.name)}
                onDoubleClick={() => handleItemDoubleClick(item)}
              >
                <div className="col-span-6 flex items-center gap-2">
                  {getFileIcon(item)}
                  <span className="truncate">{item.name}</span>
                </div>
                <div className="col-span-2 text-sm text-muted-foreground">
                  {item.size || '-'}
                </div>
                <div className="col-span-4 text-sm text-muted-foreground">
                  {item.modified}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.name}
                className={`
                  p-4 rounded-lg border border-border hover:bg-muted cursor-pointer text-center
                  ${selectedItems.includes(item.name) ? 'bg-primary/20' : ''}
                `}
                onClick={() => toggleItemSelection(item.name)}
                onDoubleClick={() => handleItemDoubleClick(item)}
              >
                <div className="mb-2 flex justify-center">
                  <div className="text-3xl">
                    {getFileIcon(item)}
                  </div>
                </div>
                <div className="text-sm font-medium truncate">{item.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {item.size || 'Folder'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="p-2 border-t border-border bg-muted text-sm text-muted-foreground">
        <div className="flex justify-between">
          <span>{filteredItems.length} items</span>
          <span>{selectedItems.length} selected</span>
        </div>
      </div>
    </div>
  );
};

export default FileSystem;