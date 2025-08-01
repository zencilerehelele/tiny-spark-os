import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface Player {
  x: number;
  y: number;
  direction: number;
  health: number;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  health: number;
  patrol: { startX: number; endX: number };
  direction: number;
}

const HotlineMiami = () => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [player, setPlayer] = useState<Player>({ x: 50, y: 50, direction: 0, health: 100 });
  const [enemies, setEnemies] = useState<Enemy[]>([
    { id: 1, x: 200, y: 150, health: 50, patrol: { startX: 150, endX: 250 }, direction: 1 },
    { id: 2, x: 400, y: 200, health: 50, patrol: { startX: 350, endX: 450 }, direction: 1 },
    { id: 3, x: 300, y: 300, health: 50, patrol: { startX: 250, endX: 350 }, direction: -1 }
  ]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [keys, setKeys] = useState<Set<string>>(new Set());

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(e.key.toLowerCase()));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(e.key.toLowerCase());
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      // Update player position
      setPlayer(prevPlayer => {
        let newX = prevPlayer.x;
        let newY = prevPlayer.y;
        
        if (keys.has('w') && newY > 0) newY -= 3;
        if (keys.has('s') && newY < 350) newY += 3;
        if (keys.has('a') && newX > 0) newX -= 3;
        if (keys.has('d') && newX < 550) newX += 3;

        return { ...prevPlayer, x: newX, y: newY };
      });

      // Update enemies
      setEnemies(prevEnemies => 
        prevEnemies.map(enemy => {
          let newX = enemy.x + (enemy.direction * 1);
          
          if (newX <= enemy.patrol.startX || newX >= enemy.patrol.endX) {
            enemy.direction *= -1;
            newX = enemy.x + (enemy.direction * 1);
          }

          return { ...enemy, x: newX };
        })
      );

      // Check collisions
      setPlayer(prevPlayer => {
        const currentEnemies = enemies;
        for (const enemy of currentEnemies) {
          const distance = Math.sqrt(
            Math.pow(prevPlayer.x - enemy.x, 2) + Math.pow(prevPlayer.y - enemy.y, 2)
          );
          
          if (distance < 25) {
            return { ...prevPlayer, health: Math.max(0, prevPlayer.health - 10) };
          }
        }
        return prevPlayer;
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameState, keys, enemies]);

  // Check game over
  useEffect(() => {
    if (player.health <= 0) {
      setGameState('gameOver');
    }
  }, [player.health]);

  // Attack function
  const attack = useCallback(() => {
    if (gameState !== 'playing') return;

    setEnemies(prevEnemies => 
      prevEnemies.filter(enemy => {
        const distance = Math.sqrt(
          Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2)
        );
        
        if (distance < 40) {
          setScore(prev => prev + 100);
          return false;
        }
        return true;
      })
    );
  }, [gameState, player.x, player.y]);

  // Handle spacebar for attack
  useEffect(() => {
    if (keys.has(' ')) {
      attack();
    }
  }, [keys, attack]);

  const startGame = () => {
    setGameState('playing');
    setPlayer({ x: 50, y: 50, direction: 0, health: 100 });
    setScore(0);
    setLevel(1);
    setEnemies([
      { id: 1, x: 200, y: 150, health: 50, patrol: { startX: 150, endX: 250 }, direction: 1 },
      { id: 2, x: 400, y: 200, health: 50, patrol: { startX: 350, endX: 450 }, direction: 1 },
      { id: 3, x: 300, y: 300, health: 50, patrol: { startX: 250, endX: 350 }, direction: -1 }
    ]);
  };

  const resetGame = () => {
    setGameState('menu');
    setKeys(new Set());
  };

  if (gameState === 'menu') {
    return (
      <div className="h-full bg-black text-green-400 flex flex-col items-center justify-center font-mono">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-red-500">HOTLINE SPARK</h1>
          <p className="text-lg mb-2">A brutal top-down action game</p>
          <p className="text-sm text-muted-foreground">Use WASD to move, SPACE to attack</p>
        </div>
        <Button onClick={startGame} className="bg-red-600 hover:bg-red-700 text-white">
          START GAME
        </Button>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className="h-full bg-black text-red-500 flex flex-col items-center justify-center font-mono">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">GAME OVER</h1>
          <p className="text-2xl mb-2">Score: {score}</p>
          <p className="text-lg">Level: {level}</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={startGame} className="bg-green-600 hover:bg-green-700 text-white">
            RESTART
          </Button>
          <Button onClick={resetGame} variant="outline">
            MAIN MENU
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-black relative overflow-hidden font-mono">
      {/* HUD */}
      <div className="absolute top-2 left-2 z-10 text-green-400">
        <div>Health: {player.health}%</div>
        <div>Score: {score}</div>
        <div>Level: {level}</div>
        <div className="text-xs mt-2">WASD: Move | SPACE: Attack</div>
      </div>

      {/* Game Area */}
      <div className="relative w-full h-full bg-gradient-to-br from-purple-900/20 to-pink-900/20">
        {/* Player */}
        <div
          className="absolute w-6 h-6 bg-blue-500 rounded-full border-2 border-blue-300 transition-all duration-75"
          style={{
            left: player.x,
            top: player.y,
            transform: `rotate(${player.direction}deg)`
          }}
        />

        {/* Enemies */}
        {enemies.map((enemy) => (
          <div
            key={enemy.id}
            className="absolute w-5 h-5 bg-red-500 rounded-sm border border-red-300 transition-all duration-75"
            style={{
              left: enemy.x,
              top: enemy.y
            }}
          />
        ))}

        {/* Walls/Obstacles */}
        <div className="absolute w-20 h-4 bg-gray-600" style={{ left: 150, top: 100 }} />
        <div className="absolute w-4 h-20 bg-gray-600" style={{ left: 300, top: 150 }} />
        <div className="absolute w-30 h-4 bg-gray-600" style={{ left: 400, top: 250 }} />
      </div>

      {/* Pause Menu */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded border border-gray-700 text-center">
            <h2 className="text-2xl mb-4 text-green-400">PAUSED</h2>
            <Button onClick={() => setGameState('playing')} className="mr-2">
              Resume
            </Button>
            <Button onClick={resetGame} variant="outline">
              Quit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotlineMiami;