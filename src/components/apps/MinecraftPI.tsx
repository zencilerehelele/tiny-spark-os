import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Block {
  x: number;
  y: number;
  z: number;
  type: 'grass' | 'dirt' | 'stone' | 'wood' | 'air';
}

interface Player {
  x: number;
  y: number;
  z: number;
  rotationY: number;
  rotationX: number;
}

export const MinecraftPI = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [player, setPlayer] = useState<Player>({ x: 0, y: 5, z: 0, rotationY: 0, rotationX: 0 });
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<Block['type']>('grass');
  const [isMouseLocked, setIsMouseLocked] = useState(false);
  const [keys, setKeys] = useState<Set<string>>(new Set());

  // Initialize world
  useEffect(() => {
    const initialBlocks: Block[] = [];
    // Create a simple flat world
    for (let x = -10; x <= 10; x++) {
      for (let z = -10; z <= 10; z++) {
        // Ground layer
        initialBlocks.push({ x, y: 0, z, type: 'grass' });
        initialBlocks.push({ x, y: -1, z, type: 'dirt' });
        initialBlocks.push({ x, y: -2, z, type: 'stone' });
        
        // Add some trees
        if (Math.random() < 0.05) {
          for (let h = 1; h <= 3; h++) {
            initialBlocks.push({ x, y: h, z, type: 'wood' });
          }
        }
      }
    }
    setBlocks(initialBlocks);
    toast("Minecraft PI Edition loaded! WASD to move, mouse to look, click to place/break blocks");
  }, []);

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

  // Game loop for movement
  useEffect(() => {
    const gameLoop = () => {
      setPlayer(prev => {
        let newPlayer = { ...prev };
        const speed = 0.1;

        if (keys.has('w')) {
          newPlayer.x += Math.sin(newPlayer.rotationY) * speed;
          newPlayer.z += Math.cos(newPlayer.rotationY) * speed;
        }
        if (keys.has('s')) {
          newPlayer.x -= Math.sin(newPlayer.rotationY) * speed;
          newPlayer.z -= Math.cos(newPlayer.rotationY) * speed;
        }
        if (keys.has('a')) {
          newPlayer.x += Math.cos(newPlayer.rotationY) * speed;
          newPlayer.z -= Math.sin(newPlayer.rotationY) * speed;
        }
        if (keys.has('d')) {
          newPlayer.x -= Math.cos(newPlayer.rotationY) * speed;
          newPlayer.z += Math.sin(newPlayer.rotationY) * speed;
        }
        if (keys.has(' ')) {
          newPlayer.y += speed;
        }
        if (keys.has('shift')) {
          newPlayer.y -= speed;
        }

        return newPlayer;
      });
    };

    const interval = setInterval(gameLoop, 16);
    return () => clearInterval(interval);
  }, [keys]);

  // Handle mouse movement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isMouseLocked) return;
    
    setPlayer(prev => ({
      ...prev,
      rotationY: prev.rotationY + e.movementX * 0.002,
      rotationX: Math.max(-Math.PI/2, Math.min(Math.PI/2, prev.rotationX + e.movementY * 0.002))
    }));
  }, [isMouseLocked]);

  useEffect(() => {
    if (isMouseLocked) {
      document.addEventListener('mousemove', handleMouseMove);
      return () => document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isMouseLocked, handleMouseMove]);

  // Handle pointer lock
  const requestPointerLock = () => {
    if (canvasRef.current) {
      canvasRef.current.requestPointerLock();
    }
  };

  useEffect(() => {
    const handlePointerLockChange = () => {
      setIsMouseLocked(document.pointerLockElement === canvasRef.current);
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => document.removeEventListener('pointerlockchange', handlePointerLockChange);
  }, []);

  // Simple 3D rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Simple projection
      blocks.forEach(block => {
        const dx = block.x - player.x;
        const dy = block.y - player.y;
        const dz = block.z - player.z;

        // Rotate by player rotation
        const rotatedX = dx * Math.cos(-player.rotationY) - dz * Math.sin(-player.rotationY);
        const rotatedZ = dx * Math.sin(-player.rotationY) + dz * Math.cos(-player.rotationY);
        const rotatedY = dy * Math.cos(-player.rotationX) - rotatedZ * Math.sin(-player.rotationX);

        if (rotatedZ < 0.1) return; // Behind player

        const scale = 200 / rotatedZ;
        const x = canvas.width / 2 + rotatedX * scale;
        const y = canvas.height / 2 + rotatedY * scale;
        const size = scale * 0.5;

        if (x < -size || x > canvas.width + size || y < -size || y > canvas.height + size) return;

        // Block colors
        const colors = {
          grass: '#4CAF50',
          dirt: '#8D6E63',
          stone: '#9E9E9E',
          wood: '#795548',
          air: 'transparent'
        };

        if (block.type !== 'air') {
          ctx.fillStyle = colors[block.type];
          ctx.fillRect(x - size/2, y - size/2, size, size);
          ctx.strokeStyle = '#000';
          ctx.strokeRect(x - size/2, y - size/2, size, size);
        }
      });
    };

    const animationFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrame);
  }, [player, blocks]);

  // Handle block placement/breaking
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isMouseLocked) {
      requestPointerLock();
      return;
    }

    // Simple raycast to find target block
    const targetX = Math.round(player.x + Math.sin(player.rotationY) * 3);
    const targetY = Math.round(player.y);
    const targetZ = Math.round(player.z + Math.cos(player.rotationY) * 3);

    if (e.button === 0) { // Left click - break block
      setBlocks(prev => prev.filter(block => 
        !(block.x === targetX && block.y === targetY && block.z === targetZ)
      ));
    } else if (e.button === 2) { // Right click - place block
      const exists = blocks.some(block => 
        block.x === targetX && block.y === targetY && block.z === targetZ
      );
      if (!exists) {
        setBlocks(prev => [...prev, { x: targetX, y: targetY, z: targetZ, type: selectedBlock }]);
      }
    }
  };

  const blockTypes: Block['type'][] = ['grass', 'dirt', 'stone', 'wood'];

  return (
    <div className="h-full flex flex-col bg-background">
      {/* HUD */}
      <div className="p-4 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Position: X:{player.x.toFixed(1)} Y:{player.y.toFixed(1)} Z:{player.z.toFixed(1)}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm">Block:</span>
            {blockTypes.map(type => (
              <Button
                key={type}
                variant={selectedBlock === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedBlock(type)}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="mt-2 text-xs text-muted-foreground">
          {isMouseLocked ? "WASD: Move | Mouse: Look | Left Click: Break | Right Click: Place | ESC: Release mouse" : "Click canvas to play"}
        </div>
      </div>

      {/* Game Canvas */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-full cursor-crosshair"
          onClick={handleCanvasClick}
          onContextMenu={(e) => e.preventDefault()}
        />
        
        {/* Crosshair */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-4 h-0.5 bg-white"></div>
          <div className="w-0.5 h-4 bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
    </div>
  );
};