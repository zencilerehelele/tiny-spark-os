import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? String(num) : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return firstValue / secondValue;
      case "=":
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const buttonClass = "h-12 text-lg font-medium transition-colors";
  const numberButtonClass = `${buttonClass} bg-window hover:bg-muted`;
  const operatorButtonClass = `${buttonClass} bg-os-primary text-os-primary-foreground hover:bg-os-primary-hover`;
  const clearButtonClass = `${buttonClass} bg-destructive text-destructive-foreground hover:bg-destructive/90`;

  return (
    <div className="h-full bg-window text-window-foreground p-4">
      {/* Display */}
      <div className="bg-terminal-bg text-terminal-text p-4 rounded mb-4 text-right">
        <div className="text-3xl font-mono truncate">{display}</div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2">
        <Button className={clearButtonClass} onClick={clear}>
          C
        </Button>
        <Button className={numberButtonClass} onClick={() => inputOperation("÷")}>
          ÷
        </Button>
        <Button className={numberButtonClass} onClick={() => inputOperation("×")}>
          ×
        </Button>
        <Button className={operatorButtonClass} onClick={() => inputOperation("-")}>
          −
        </Button>

        <Button className={numberButtonClass} onClick={() => inputNumber("7")}>
          7
        </Button>
        <Button className={numberButtonClass} onClick={() => inputNumber("8")}>
          8
        </Button>
        <Button className={numberButtonClass} onClick={() => inputNumber("9")}>
          9
        </Button>
        <Button className={operatorButtonClass} onClick={() => inputOperation("+")}>
          +
        </Button>

        <Button className={numberButtonClass} onClick={() => inputNumber("4")}>
          4
        </Button>
        <Button className={numberButtonClass} onClick={() => inputNumber("5")}>
          5
        </Button>
        <Button className={numberButtonClass} onClick={() => inputNumber("6")}>
          6
        </Button>
        <Button className={operatorButtonClass} onClick={performCalculation} style={{ gridRow: "span 2" }}>
          =
        </Button>

        <Button className={numberButtonClass} onClick={() => inputNumber("1")}>
          1
        </Button>
        <Button className={numberButtonClass} onClick={() => inputNumber("2")}>
          2
        </Button>
        <Button className={numberButtonClass} onClick={() => inputNumber("3")}>
          3
        </Button>

        <Button className={numberButtonClass} onClick={() => inputNumber("0")} style={{ gridColumn: "span 2" }}>
          0
        </Button>
        <Button className={numberButtonClass} onClick={() => inputNumber(".")}>
          .
        </Button>
      </div>
    </div>
  );
};