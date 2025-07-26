import React, { useState } from "react";
import { Save, FileSpreadsheet, Plus, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Cell {
  value: string;
  formula?: string;
}

export const Spreadsheet = () => {
  const [fileName, setFileName] = useState("Untitled Spreadsheet");
  const [cells, setCells] = useState<{ [key: string]: Cell }>({});
  const [selectedCell, setSelectedCell] = useState<string>("");
  const [formulaBar, setFormulaBar] = useState("");

  const ROWS = 20;
  const COLS = 10;
  const COLUMN_LETTERS = "ABCDEFGHIJ";

  const getCellKey = (row: number, col: number) => `${COLUMN_LETTERS[col]}${row + 1}`;

  const handleCellChange = (cellKey: string, value: string) => {
    setCells(prev => ({
      ...prev,
      [cellKey]: { value, formula: value.startsWith('=') ? value : undefined }
    }));
  };

  const handleCellClick = (cellKey: string) => {
    setSelectedCell(cellKey);
    setFormulaBar(cells[cellKey]?.value || "");
  };

  const evaluateFormula = (formula: string): string => {
    if (!formula.startsWith('=')) return formula;
    
    try {
      // Simple formula evaluation (in real app, would use proper parser)
      const expression = formula.slice(1).replace(/[A-Z]\d+/g, (match) => {
        const cellValue = cells[match]?.value || "0";
        return cellValue.startsWith('=') ? "0" : (parseFloat(cellValue) || 0).toString();
      });
      
      // Basic math evaluation (unsafe in real app)
      const result = Function(`"use strict"; return (${expression})`)();
      return result.toString();
    } catch {
      return "#ERROR";
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            <Input 
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="text-lg font-semibold border-none p-0 h-auto bg-transparent"
            />
          </div>
          <Button size="sm">
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>

        {/* Formula Bar */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm min-w-[60px]">{selectedCell}</span>
          <Input 
            value={formulaBar}
            onChange={(e) => setFormulaBar(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && selectedCell) {
                handleCellChange(selectedCell, formulaBar);
              }
            }}
            placeholder="Enter formula or value..."
            className="flex-1"
          />
        </div>
      </div>

      {/* Spreadsheet Grid */}
      <div className="flex-1 overflow-auto">
        <div className="inline-block min-w-full">
          {/* Column Headers */}
          <div className="flex sticky top-0 bg-muted border-b border-border">
            <div className="w-12 h-8 border-r border-border flex items-center justify-center text-xs font-semibold">
              
            </div>
            {Array.from({ length: COLS }).map((_, col) => (
              <div 
                key={col}
                className="w-24 h-8 border-r border-border flex items-center justify-center text-xs font-semibold"
              >
                {COLUMN_LETTERS[col]}
              </div>
            ))}
          </div>

          {/* Rows */}
          {Array.from({ length: ROWS }).map((_, row) => (
            <div key={row} className="flex border-b border-border">
              {/* Row Header */}
              <div className="w-12 h-8 border-r border-border bg-muted flex items-center justify-center text-xs font-semibold">
                {row + 1}
              </div>
              
              {/* Cells */}
              {Array.from({ length: COLS }).map((_, col) => {
                const cellKey = getCellKey(row, col);
                const cell = cells[cellKey];
                const displayValue = cell?.formula 
                  ? evaluateFormula(cell.value)
                  : cell?.value || "";
                
                return (
                  <div 
                    key={col}
                    className={`w-24 h-8 border-r border-border ${
                      selectedCell === cellKey ? 'bg-primary/20' : 'hover:bg-muted/50'
                    }`}
                  >
                    <input
                      type="text"
                      value={displayValue}
                      onChange={(e) => handleCellChange(cellKey, e.target.value)}
                      onClick={() => handleCellClick(cellKey)}
                      className="w-full h-full px-1 text-xs bg-transparent border-none outline-none"
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-2 border-t border-border bg-muted text-xs text-muted-foreground flex items-center justify-between">
        <span>Ready</span>
        <span>Sheet 1 of 1</span>
      </div>
    </div>
  );
};