import React, { useState, useEffect, useCallback } from "react";
import { Crosshair, Heart, Shield } from "lucide-react";

const DoomClone = () => {
  const [playerHealth, setPlayerHealth] = useState(100);
  const [playerAmmo, setPlayerAmmo] = useState(50);
  const [playerArmor, setPlayerArmor] = useState(0);
  const [gameLevel, setGameLevel] = useState(1);
  const [enemies, setEnemies] = useState(5);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameOver'>('menu');
  const [playerX, setPlayerX] = useState(50);
  const [playerY, setPlayerY] = useState(50);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'playing') return;
    
    const step = 5;
    switch (e.key.toLowerCase()) {
      case 'w':
        setPlayerY(prev => Math.max(0, prev - step));
        break;
      case 's':
        setPlayerY(prev => Math.min(90, prev + step));
        break;
      case 'a':
        setPlayerX(prev => Math.max(0, prev - step));
        break;
      case 'd':
        setPlayerX(prev => Math.min(90, prev + step));
        break;
      case ' ':
        if (playerAmmo > 0) {
          setPlayerAmmo(prev => prev - 1);
          // Simulate hitting enemy
          if (Math.random() > 0.7) {
            setEnemies(prev => Math.max(0, prev - 1));
          }
        }
        break;
    }
  }, [gameState, playerAmmo]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (enemies === 0 && gameState === 'playing') {
      setGameLevel(prev => prev + 1);
      setEnemies(5 + gameLevel);
      setPlayerAmmo(prev => prev + 20);
    }
  }, [enemies, gameState, gameLevel]);

  const startGame = () => {
    setGameState('playing');
    setPlayerHealth(100);
    setPlayerAmmo(50);
    setPlayerArmor(0);
    setGameLevel(1);
    setEnemies(5);
    setPlayerX(50);
    setPlayerY(50);
  };

  const takeDamage = () => {
    if (Math.random() > 0.85) {
      const damage = Math.floor(Math.random() * 15) + 5;
      setPlayerHealth(prev => {
        const newHealth = Math.max(0, prev - damage);
        if (newHealth === 0) {
          setGameState('gameOver');
        }
        return newHealth;
      });
    }
  };

  const collectItem = () => {
    if (Math.random() > 0.9) {
      if (Math.random() > 0.5) {
        setPlayerHealth(prev => Math.min(100, prev + 20));
      } else {
        setPlayerAmmo(prev => prev + 10);
      }
    }
  };

  useEffect(() => {
    if (gameState === 'playing') {
      const damageInterval = setInterval(takeDamage, 2000);
      const itemInterval = setInterval(collectItem, 3000);
      return () => {
        clearInterval(damageInterval);
        clearInterval(itemInterval);
      };
    }
  }, [gameState]);

  if (gameState === 'menu') {
    return (
      <div className="h-full bg-black text-red-500 flex flex-col items-center justify-center font-mono">
        <div className="text-6xl font-bold mb-8 text-red-600">DOOM</div>
        <div className="text-2xl mb-4">MARS FACILITY OUTBREAK</div>
        <div className="text-lg mb-8 text-center max-w-md">
          The demons have taken over the Mars research facility. 
          You are the last marine standing. Fight your way through!
        </div>
        <button 
          onClick={startGame}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-xl font-bold"
        >
          START MISSION
        </button>
        <div className="mt-8 text-sm text-gray-400">
          Controls: WASD to move, SPACE to shoot
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className="h-full bg-black text-red-500 flex flex-col items-center justify-center font-mono">
        <div className="text-4xl font-bold mb-4 text-red-600">YOU DIED</div>
        <div className="text-xl mb-8">The demons have won...</div>
        <button 
          onClick={startGame}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-lg font-bold"
        >
          RETRY MISSION
        </button>
      </div>
    );
  }

  return (
    <div className="h-full bg-black text-white font-mono">
      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 bg-gray-900 p-2 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-red-500">{playerHealth}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-blue-500">{playerArmor}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Crosshair className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-500">{playerAmmo}</span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-yellow-500">LEVEL {gameLevel}</div>
          <div className="text-red-500">DEMONS: {enemies}</div>
        </div>
      </div>

      {/* Game Area */}
      <div className="pt-16 h-full relative bg-gradient-to-b from-red-900 to-black">
        {/* Player */}
        <div 
          className="absolute w-4 h-4 bg-green-500 rounded-full transition-all duration-100"
          style={{ 
            left: `${playerX}%`, 
            top: `${playerY}%`,
            boxShadow: '0 0 10px #10b981'
          }}
        />
        
        {/* Enemies */}
        {Array.from({ length: enemies }).map((_, i) => (
          <div
            key={i}
            className="absolute w-6 h-6 bg-red-500 rounded animate-pulse cursor-crosshair"
            style={{
              left: `${(i * 20 + 10) % 80 + 10}%`,
              top: `${(i * 15 + 20) % 60 + 20}%`,
              boxShadow: '0 0 15px #ef4444'
            }}
            onClick={() => {
              if (playerAmmo > 0) {
                setPlayerAmmo(prev => prev - 1);
                setEnemies(prev => Math.max(0, prev - 1));
              }
            }}
          />
        ))}

        {/* Items */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-yellow-400 rounded-full animate-bounce"
            style={{
              left: `${(i * 25 + 15) % 70 + 15}%`,
              top: `${(i * 30 + 25) % 50 + 30}%`,
              boxShadow: '0 0 10px #fbbf24'
            }}
          />
        ))}

        {/* Environment */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-gray-700 opacity-50"
              style={{
                left: `${(i * 37) % 90}%`,
                top: `${(i * 23) % 80 + 10}%`,
                width: '8px',
                height: '20px'
              }}
            />
          ))}
        </div>

        {/* Floor texture */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-800 to-transparent opacity-30" />
      </div>

      {/* Messages */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        {playerAmmo === 0 && (
          <div className="text-red-500 font-bold">OUT OF AMMO!</div>
        )}
        {enemies === 1 && (
          <div className="text-yellow-500 font-bold">LAST DEMON!</div>
        )}
      </div>
    </div>
  );
};

export default DoomClone;