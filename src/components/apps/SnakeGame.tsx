import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };

export const SnakeGame = ({ onClose }: { onClose: () => void }) => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection({ x: 0, y: 0 });
    setGameOver(false);
    setScore(0);
    setIsPlaying(false);
  };

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { 
        x: newSnake[0].x + direction.x, 
        y: newSnake[0].y + direction.y 
      };

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPlaying, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      switch (e.key) {
        case 'ArrowUp':
          setDirection(prev => prev.y !== 1 ? { x: 0, y: -1 } : prev);
          break;
        case 'ArrowDown':
          setDirection(prev => prev.y !== -1 ? { x: 0, y: 1 } : prev);
          break;
        case 'ArrowLeft':
          setDirection(prev => prev.x !== 1 ? { x: -1, y: 0 } : prev);
          break;
        case 'ArrowRight':
          setDirection(prev => prev.x !== -1 ? { x: 1, y: 0 } : prev);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  const startGame = () => {
    setIsPlaying(true);
    setDirection({ x: 1, y: 0 });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-background p-4">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Snake Game</h2>
        <p className="text-lg">Score: {score}</p>
      </div>

      <div 
        className="grid bg-muted border-2 border-border"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: '400px',
          height: '400px'
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          const isSnake = snake.some(segment => segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;
          const isHead = snake[0]?.x === x && snake[0]?.y === y;

          return (
            <div
              key={index}
              className={`border border-border/20 ${
                isSnake 
                  ? isHead 
                    ? 'bg-green-500' 
                    : 'bg-green-400'
                  : isFood 
                    ? 'bg-red-500' 
                    : 'bg-background'
              }`}
            />
          );
        })}
      </div>

      <div className="mt-4 space-y-2">
        {!isPlaying && !gameOver && (
          <Button onClick={startGame} className="w-32">
            Start Game
          </Button>
        )}
        
        {gameOver && (
          <div className="text-center space-y-2">
            <p className="text-red-500 font-semibold">Game Over!</p>
            <Button onClick={resetGame} className="w-32">
              Play Again
            </Button>
          </div>
        )}
        
        <Button onClick={onClose} variant="outline" className="w-32">
          Close Game
        </Button>
      </div>

      {isPlaying && (
        <p className="text-sm text-muted-foreground mt-2">
          Use arrow keys to control the snake
        </p>
      )}
    </div>
  );
};