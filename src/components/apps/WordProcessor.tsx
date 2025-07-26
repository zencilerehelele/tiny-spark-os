import React, { useState } from "react";
import { Bold, Italic, Underline, Save, FileText, Type, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export const WordProcessor = () => {
  const [fileName, setFileName] = useState("Untitled Document");
  const [content, setContent] = useState("");
  const [isSaved, setIsSaved] = useState(true);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsSaved(false);
  };

  const handleSave = () => {
    // Simulate saving
    setIsSaved(true);
    console.log("Document saved:", fileName);
  };

  const formatText = (command: string) => {
    document.execCommand(command, false, undefined);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <Input 
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="text-lg font-semibold border-none p-0 h-auto bg-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {isSaved ? "Saved" : "Unsaved changes"}
            </span>
            <Button onClick={handleSave} size="sm" disabled={isSaved}>
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('bold')}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('italic')}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('underline')}
          >
            <Underline className="w-4 h-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('justifyLeft')}
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('justifyCenter')}
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('justifyRight')}
          >
            <AlignRight className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <select className="px-2 py-1 border border-border rounded text-sm bg-background">
            <option>Arial</option>
            <option>Times New Roman</option>
            <option>Helvetica</option>
            <option>Georgia</option>
          </select>

          <select className="px-2 py-1 border border-border rounded text-sm bg-background">
            <option>12px</option>
            <option>14px</option>
            <option>16px</option>
            <option>18px</option>
            <option>24px</option>
          </select>
        </div>
      </div>

      {/* Document Area */}
      <div className="flex-1 p-8 bg-background">
        <div className="max-w-4xl mx-auto bg-white min-h-full shadow-lg p-12 border border-border">
          <textarea
            value={content}
            onChange={handleTextChange}
            placeholder="Start typing your document..."
            className="w-full h-full min-h-[600px] resize-none border-none outline-none text-black leading-6"
            style={{ fontFamily: 'Arial', fontSize: '14px' }}
          />
        </div>
      </div>
    </div>
  );
};