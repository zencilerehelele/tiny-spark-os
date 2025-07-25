import { useState } from "react";
import { Save, FileText, Bold, Italic, Underline } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const TextEditor = () => {
  const [content, setContent] = useState("Welcome to TinySpark Text Editor\n\nStart typing your document here...");
  const [filename, setFilename] = useState("untitled.txt");
  const [isModified, setIsModified] = useState(false);
  const { toast } = useToast();

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsModified(true);
  };

  const handleSave = () => {
    // Simulate saving
    toast({
      title: "File saved",
      description: `${filename} has been saved successfully.`,
    });
    setIsModified(false);
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
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-medium min-w-0"
          />
          {isModified && <span className="text-xs text-muted-foreground">•</span>}
        </div>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-1">
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