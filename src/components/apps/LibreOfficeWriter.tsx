import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Save, FileText, Plus } from "lucide-react";

const LibreOfficeWriter = () => {
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("Untitled Document");
  const [fontSize, setFontSize] = useState("12");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');

  const handleFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="h-full bg-background text-foreground flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <Input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="text-lg font-semibold bg-transparent border-none p-0 h-auto focus-visible:ring-0"
          />
        </div>
        <div className="text-sm text-muted-foreground">LibreOffice Writer</div>
      </div>

      {/* Toolbar */}
      <div className="p-2 border-b border-border bg-muted">
        <div className="flex items-center gap-2 flex-wrap">
          {/* File Operations */}
          <div className="flex gap-1 border-r border-border pr-2">
            <Button variant="ghost" size="sm">
              <Plus className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Save className="w-4 h-4" />
            </Button>
          </div>

          {/* Font Controls */}
          <div className="flex gap-1 border-r border-border pr-2">
            <select 
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="px-2 py-1 bg-background border border-border rounded text-sm"
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Courier New">Courier New</option>
            </select>
            <select 
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="px-2 py-1 bg-background border border-border rounded text-sm w-16"
            >
              <option value="8">8</option>
              <option value="10">10</option>
              <option value="12">12</option>
              <option value="14">14</option>
              <option value="16">16</option>
              <option value="18">18</option>
              <option value="24">24</option>
              <option value="36">36</option>
            </select>
          </div>

          {/* Text Formatting */}
          <div className="flex gap-1 border-r border-border pr-2">
            <Button
              variant={isBold ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setIsBold(!isBold);
                handleFormatting('bold');
              }}
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant={isItalic ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setIsItalic(!isItalic);
                handleFormatting('italic');
              }}
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              variant={isUnderline ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setIsUnderline(!isUnderline);
                handleFormatting('underline');
              }}
            >
              <Underline className="w-4 h-4" />
            </Button>
          </div>

          {/* Alignment */}
          <div className="flex gap-1">
            <Button
              variant={alignment === 'left' ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setAlignment('left');
                handleFormatting('justifyLeft');
              }}
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              variant={alignment === 'center' ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setAlignment('center');
                handleFormatting('justifyCenter');
              }}
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              variant={alignment === 'right' ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setAlignment('right');
                handleFormatting('justifyRight');
              }}
            >
              <AlignRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Document Editor */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto bg-white min-h-full p-8 shadow-lg border border-gray-200">
          <div
            contentEditable
            className="min-h-full outline-none text-black leading-relaxed"
            style={{
              fontFamily: fontFamily,
              fontSize: `${fontSize}px`,
              textAlign: alignment,
              fontWeight: isBold ? 'bold' : 'normal',
              fontStyle: isItalic ? 'italic' : 'normal',
              textDecoration: isUnderline ? 'underline' : 'none'
            }}
            suppressContentEditableWarning={true}
            onInput={(e) => setContent(e.currentTarget.textContent || "")}
          >
            {content || "Start typing your document here..."}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-2 border-t border-border bg-muted text-sm text-muted-foreground">
        <div className="flex justify-between">
          <span>Words: {content.split(/\s+/).filter(word => word.length > 0).length}</span>
          <span>Characters: {content.length}</span>
        </div>
      </div>
    </div>
  );
};

export default LibreOfficeWriter;