import { useState } from "react";
import { FolderOpen, File, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileItem {
  name: string;
  type: "file" | "folder";
  size?: string;
  modified: string;
}

export const FileManager = () => {
  const [currentPath, setCurrentPath] = useState("/home/user");
  const [files] = useState<FileItem[]>([
    { name: "Documents", type: "folder", modified: "2024-01-15 10:30" },
    { name: "Downloads", type: "folder", modified: "2024-01-14 16:45" },
    { name: "Pictures", type: "folder", modified: "2024-01-13 09:20" },
    { name: "Desktop", type: "folder", modified: "2024-01-12 14:10" },
    { name: "Music", type: "folder", modified: "2024-01-11 11:25" },
    { name: "Videos", type: "folder", modified: "2024-01-10 08:30" },
    { name: "readme.txt", type: "file", size: "1.2 KB", modified: "2024-01-09 13:45" },
    { name: "config.conf", type: "file", size: "856 B", modified: "2024-01-08 12:15" }
  ]);

  const navigateHome = () => {
    setCurrentPath("/home/user");
  };

  const navigateUp = () => {
    const pathParts = currentPath.split("/").filter(p => p);
    if (pathParts.length > 1) {
      setCurrentPath("/" + pathParts.slice(0, -1).join("/"));
    }
  };

  return (
    <div className="h-full bg-window text-window-foreground flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={navigateUp}
          className="h-8 px-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={navigateHome}
          className="h-8 px-2"
        >
          <Home className="w-4 h-4" />
        </Button>
        <div className="flex-1 bg-input rounded px-3 py-1 text-sm font-mono">
          {currentPath}
        </div>
      </div>

      {/* File listing */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 gap-1 p-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 rounded hover:bg-os-primary/10 cursor-pointer transition-colors"
            >
              {file.type === "folder" ? (
                <FolderOpen className="w-5 h-5 text-os-primary" />
              ) : (
                <File className="w-5 h-5 text-muted-foreground" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{file.name}</div>
                <div className="text-xs text-muted-foreground">
                  {file.size && `${file.size} • `}{file.modified}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
        {files.length} items
      </div>
    </div>
  );
};