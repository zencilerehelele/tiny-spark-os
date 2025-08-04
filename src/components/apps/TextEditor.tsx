import { useState, useEffect } from "react";
import { Save, FileText, Bold, Italic, Underline, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { fileSystemStorage } from "../../utils/fileSystem";

export const TextEditor = () => {
  const [content, setContent] = useState("Welcome to TinySpark Text Editor\n\nStart typing your document here...");
  const [filename, setFilename] = useState("untitled.txt");
  const [isModified, setIsModified] = useState(false);
  const [currentPath, setCurrentPath] = useState("/Documents");
  const [saveMessage, setSaveMessage] = useState("");
  const { toast } = useToast();

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsModified(true);
  };

  const handleSave = () => {
    const success = fileSystemStorage.saveFile(currentPath, filename, content);
    if (success) {
      setIsModified(false);
      setSaveMessage(`Saved: ${filename}`);
      toast({
        title: "File saved",
        description: `${filename} has been saved successfully.`,
      });
      setTimeout(() => setSaveMessage(""), 3000);
    } else {
      setSaveMessage("Error saving file");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const handleLoad = () => {
    const loadedContent = fileSystemStorage.loadFile(currentPath, filename);
    if (loadedContent !== null) {
      setContent(loadedContent);
      setIsModified(false);
      setSaveMessage(`Loaded: ${filename}`);
      toast({
        title: "File loaded",
        description: `${filename} has been loaded successfully.`,
      });
      setTimeout(() => setSaveMessage(""), 3000);
    } else {
      setSaveMessage("File not found");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const formatText = (format: string) => {
    // This is a simplified version - real implementation would handle text selection
    toast({
      title: "Format applied",
      description: `${format} formatting applied.`,
    });
  };

  return (
    <div className="h-full bg-window text-window-foreground flex flex-col">
      {/* Menu bar */}
      <div className="flex items-center gap-2 p-2 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-os-primary" />
          <input
            type="text"
            value={currentPath}
            onChange={(e) => setCurrentPath(e.target.value)}
            className="bg-transparent border-none outline-none text-xs w-24 text-muted-foreground"
            placeholder="Path"
          />
          <span className="text-muted-foreground">/</span>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-medium min-w-0"
          />
          {isModified && <span className="text-xs text-muted-foreground">•</span>}
          {saveMessage && (
            <span className="text-xs text-muted-foreground">{saveMessage}</span>
          )}
        </div>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLoad}
            className="h-7 px-2 text-green-600"
          >
            <FolderOpen className="w-3 h-3 mr-1" />
            Load
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText("Bold")}
            className="h-7 px-2"
          >
            <Bold className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText("Italic")}
            className="h-7 px-2"
          >
            <Italic className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText("Underline")}
            className="h-7 px-2"
          >
            <Underline className="w-3 h-3" />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="h-7 px-2 text-os-primary"
          >
            <Save className="w-3 h-3 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Editor */}
      <textarea
        value={content}
        onChange={handleContentChange}
        className="flex-1 p-4 bg-transparent resize-none outline-none text-sm font-mono leading-relaxed"
        placeholder="Start typing..."
      />

      {/* Status bar */}
      <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground flex items-center justify-between">
        <span>Lines: {content.split('\n').length} | Characters: {content.length}</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
};