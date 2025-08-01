import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Save, FileSpreadsheet } from "lucide-react";

interface Cell {
  value: string;
  formula?: string;
}

const LibreOfficeCalc = () => {
  const [fileName, setFileName] = useState("Untitled Spreadsheet");
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const [cells, setCells] = useState<{ [key: string]: Cell }>({});
  const [formulaBar, setFormulaBar] = useState("");

  const columns = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const rows = Array.from({ length: 20 }, (_, i) => i + 1);

  const getCellKey = (row: number, col: number) => `${row}-${col}`;

  const getCellValue = (row: number, col: number) => {
    const key = getCellKey(row, col);
    return cells[key]?.value || "";
  };

  const updateCell = (row: number, col: number, value: string) => {
    const key = getCellKey(row, col);
    setCells(prev => ({
      ...prev,
      [key]: { value, formula: value.startsWith('=') ? value : undefined }
    }));
  };

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
    const key = getCellKey(row, col);
    setFormulaBar(cells[key]?.value || "");
  };

  const handleCellChange = (value: string) => {
    updateCell(selectedCell.row, selectedCell.col, value);
    setFormulaBar(value);
  };

  const evaluateFormula = (formula: string): string => {
    if (!formula.startsWith('=')) return formula;
    
    try {
      // Simple formula evaluation (basic math operations)
      const expression = formula.slice(1).replace(/[A-Z]\d+/g, (match) => {
        const col = match.charCodeAt(0) - 65;
        const row = parseInt(match.slice(1)) - 1;
        const cellValue = getCellValue(row, col);
        return cellValue || '0';
      });
      
      // Basic safety check - only allow numbers, operators, and parentheses
      if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
        return '#ERROR';
      }
      
      const result = eval(expression);
      return isNaN(result) ? '#ERROR' : result.toString();
    } catch {
      return '#ERROR';
    }
  };

  return (
    <div className="h-full bg-background text-foreground flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <FileSpreadsheet className="w-5 h-5 text-green-600" />
          <Input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="text-lg font-semibold bg-transparent border-none p-0 h-auto focus-visible:ring-0"
          />
        </div>
        <div className="text-sm text-muted-foreground">LibreOffice Calc</div>
      </div>

      {/* Toolbar */}
      <div className="p-2 border-b border-border bg-muted">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Plus className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Save className="w-4 h-4" />
          </Button>
          
          <div className="border-l border-border mx-2 h-6" />
          
          {/* Cell Reference */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono">
              {columns[selectedCell.col]}{selectedCell.row + 1}
            </span>
            <Input
              value={formulaBar}
              onChange={(e) => setFormulaBar(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCellChange(formulaBar);
                }
              }}
              className="w-64 h-8"
              placeholder="Enter value or formula (=A1+B1)"
            />
          </div>
        </div>
      </div>

      {/* Spreadsheet Grid */}
      <div className="flex-1 overflow-auto">
        <div className="inline-block min-w-full">
          {/* Column Headers */}
          <div className="flex bg-muted border-b border-border sticky top-0 z-10">
            <div className="w-12 h-8 bg-muted border-r border-border" />
            {columns.map((col, colIndex) => (
              <div
                key={col}
                className="w-20 h-8 flex items-center justify-center font-semibold text-sm border-r border-border bg-muted"
              >
                {col}
              </div>
            ))}
          </div>

          {/* Rows */}
          {rows.map((row, rowIndex) => (
            <div key={row} className="flex border-b border-border">
              {/* Row Header */}
              <div className="w-12 h-8 flex items-center justify-center font-semibold text-sm bg-muted border-r border-border">
                {row}
              </div>

              {/* Cells */}
              {columns.map((col, colIndex) => {
                const isSelected = selectedCell.row === rowIndex && selectedCell.col === colIndex;
                const cellValue = getCellValue(rowIndex, colIndex);
                const displayValue = cellValue.startsWith('=') ? evaluateFormula(cellValue) : cellValue;

                return (
                  <div
                    key={`${row}-${col}`}
                    className={`
                      w-20 h-8 border-r border-border cursor-cell relative
                      ${isSelected ? 'bg-primary/20 border-primary' : 'hover:bg-muted/50'}
                    `}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    <input
                      type="text"
                      value={displayValue}
                      onChange={(e) => handleCellChange(e.target.value)}
                      className="w-full h-full px-1 bg-transparent text-xs outline-none"
                      onFocus={() => handleCellClick(rowIndex, colIndex)}
                    />
                    {isSelected && (
                      <div className="absolute inset-0 border-2 border-primary pointer-events-none" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-2 border-t border-border bg-muted text-sm text-muted-foreground">
        <div className="flex justify-between">
          <span>Sheet1</span>
          <span>Ready</span>
        </div>
      </div>
    </div>
  );
};

export default LibreOfficeCalc;