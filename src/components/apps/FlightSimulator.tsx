import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Plane {
  x: number;
  y: number;
  velocity: { x: number; y: number };
  rotation: number;
  fuel: number;
  altitude: number;
}

interface Cloud {
  x: number;
  y: number;
  size: number;
}

export const FlightSimulator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const keysRef = useRef<Set<string>>(new Set());
  
  const [plane, setPlane] = useState<Plane>({
    x: 100,
    y: 300,
    velocity: { x: 0, y: 0 },
    rotation: 0,
    fuel: 100,
    altitude: 500
  });
  
  const [clouds] = useState<Cloud[]>(() => 
    Array.from({ length: 10 }, (_, i) => ({
      x: i * 150 + 200,
      y: Math.random() * 200 + 100,
      size: Math.random() * 30 + 20
    }))
  );

  const [score, setScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const drawPlane = (ctx: CanvasRenderingContext2D, plane: Plane) => {
    ctx.save();
    ctx.translate(plane.x, plane.y);
    ctx.rotate(plane.rotation);
    
    // Plane body
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(-15, -3, 30, 6);
    
    // Wings
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(-5, -15, 10, 30);
    
    // Nose
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(25, -3);
    ctx.lineTo(25, 3);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  };

  const drawCloud = (ctx: CanvasRenderingContext2D, cloud: Cloud) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
    ctx.arc(cloud.x + cloud.size * 0.5, cloud.y, cloud.size * 0.8, 0, Math.PI * 2);
    ctx.arc(cloud.x - cloud.size * 0.5, cloud.y, cloud.size * 0.8, 0, Math.PI * 2);
    ctx.fill();
  };

  const updateGame = () => {
    if (!gameRunning) return;

    setPlane(prevPlane => {
      const newPlane = { ...prevPlane };
      
      // Handle input
      if (keysRef.current.has('arrowup') || keysRef.current.has('w')) {
        newPlane.velocity.y -= 0.3;
        newPlane.fuel = Math.max(0, newPlane.fuel - 0.1);
      }
      if (keysRef.current.has('arrowdown') || keysRef.current.has('s')) {
        newPlane.velocity.y += 0.2;
      }
      if (keysRef.current.has('arrowleft') || keysRef.current.has('a')) {
        newPlane.velocity.x -= 0.2;
        newPlane.rotation -= 0.05;
      }
      if (keysRef.current.has('arrowright') || keysRef.current.has('d')) {
        newPlane.velocity.x += 0.2;
        newPlane.rotation += 0.05;
      }

      // Physics
      newPlane.velocity.y += 0.1; // Gravity
      newPlane.velocity.x *= 0.99; // Air resistance
      newPlane.velocity.y *= 0.99;

      // Update position
      newPlane.x += newPlane.velocity.x;
      newPlane.y += newPlane.velocity.y;
      newPlane.altitude = Math.max(0, 600 - newPlane.y);

      // Boundaries
      if (newPlane.x < 0) newPlane.x = 0;
      if (newPlane.x > 750) newPlane.x = 750;
      if (newPlane.y < 0) newPlane.y = 0;
      if (newPlane.y > 550) {
        newPlane.y = 550;
        newPlane.velocity.y = 0;
      }

      return newPlane;
    });

    setScore(prev => prev + 1);
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, 550, canvas.width, 50);

    // Draw clouds
    clouds.forEach(cloud => drawCloud(ctx, cloud));

    // Draw plane
    drawPlane(ctx, plane);

    updateGame();

    if (gameRunning) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const startGame = () => {
    setGameRunning(true);
    setScore(0);
    setPlane({
      x: 100,
      y: 300,
      velocity: { x: 0, y: 0 },
      rotation: 0,
      fuel: 100,
      altitude: 500
    });
    gameLoop();
  };

  const stopGame = () => {
    setGameRunning(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="h-full flex flex-col bg-window">
      {/* HUD */}
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>Score: {score}</div>
          <div>Altitude: {Math.round(plane.altitude)}ft</div>
          <div className="flex items-center gap-2">
            <span>Fuel:</span>
            <Progress value={plane.fuel} className="w-20" />
          </div>
        </div>
        <div className="flex gap-2">
          {!gameRunning ? (
            <Button onClick={startGame}>Start Flight</Button>
          ) : (
            <Button onClick={stopGame} variant="destructive">Land</Button>
          )}
        </div>
      </div>

      {/* Game Canvas */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border border-border rounded-lg bg-sky-200"
          />
          {!gameRunning && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <div className="text-center text-white">
                <h2 className="text-2xl font-bold mb-4">Flight Simulator</h2>
                <p className="mb-4">Use WASD or Arrow Keys to control the plane</p>
                <Button onClick={startGame} size="lg">Take Off!</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="border-t border-border p-4 text-sm text-muted-foreground">
        <p><strong>Controls:</strong> ↑/W: Thrust Up, ↓/S: Dive, ←/A: Turn Left, →/D: Turn Right</p>
      </div>
    </div>
  );
};