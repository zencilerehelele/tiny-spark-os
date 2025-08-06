import React, { useState, useEffect, useCallback, useRef } from "react";
import { Rocket, Compass, MapPin, Zap, Settings, Globe } from "lucide-react";

interface Planet {
  id: number;
  name: string;
  type: string;
  color: string;
  size: number;
  distance: number;
  resources: string[];
  discovered: boolean;
}

const PlanetExplorationSimulator = () => {
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 });
  const [fuel, setFuel] = useState(100);
  const [oxygen, setOxygen] = useState(100);
  const [energy, setEnergy] = useState(100);
  const [currentPlanet, setCurrentPlanet] = useState(0);
  const [gameState, setGameState] = useState<'exploration' | 'landed' | 'scanning'>('exploration');
  const [discoveredPlanets, setDiscoveredPlanets] = useState<number[]>([0]);
  const [scanResults, setScanResults] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const planets: Planet[] = [
    { id: 0, name: "Earth Base", type: "Home", color: "#4f94cd", size: 30, distance: 0, resources: ["Water", "Oxygen"], discovered: true },
    { id: 1, name: "Mars", type: "Rocky", color: "#cd5c5c", size: 25, distance: 150, resources: ["Iron", "Ice"], discovered: false },
    { id: 2, name: "Europa", type: "Ice Moon", color: "#e6e6fa", size: 20, distance: 300, resources: ["Water", "Methane"], discovered: false },
    { id: 3, name: "Titan", type: "Gas Moon", color: "#ffa500", size: 22, distance: 400, resources: ["Hydrocarbons", "Nitrogen"], discovered: false },
    { id: 4, name: "Proxima B", type: "Exoplanet", color: "#32cd32", size: 28, distance: 600, resources: ["Unknown Elements", "Energy Crystals"], discovered: false },
    { id: 5, name: "Kepler-452b", type: "Super Earth", color: "#20b2aa", size: 35, distance: 800, resources: ["Rare Metals", "Exotic Matter"], discovered: false }
  ];

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'exploration') return;
    
    const step = 3;
    switch (e.key.toLowerCase()) {
      case 'w':
        setPlayerPosition(prev => ({ ...prev, y: Math.max(5, prev.y - step) }));
        setFuel(prev => Math.max(0, prev - 0.5));
        break;
      case 's':
        setPlayerPosition(prev => ({ ...prev, y: Math.min(90, prev.y + step) }));
        setFuel(prev => Math.max(0, prev - 0.5));
        break;
      case 'a':
        setPlayerPosition(prev => ({ ...prev, x: Math.max(5, prev.x - step) }));
        setFuel(prev => Math.max(0, prev - 0.5));
        break;
      case 'd':
        setPlayerPosition(prev => ({ ...prev, x: Math.min(90, prev.x + step) }));
        setFuel(prev => Math.max(0, prev - 0.5));
        break;
      case ' ':
        scanArea();
        break;
      case 'e':
        checkForPlanetLanding();
        break;
    }
  }, [gameState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOxygen(prev => Math.max(0, prev - 0.1));
      setEnergy(prev => Math.max(0, prev - 0.05));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    renderStarfield();
  }, [playerPosition, currentPlanet]);

  const renderStarfield = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 200; i++) {
      const x = (i * 37) % canvas.width;
      const y = (i * 67) % canvas.height;
      const size = Math.random() * 2;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw planets
    planets.forEach((planet, index) => {
      const angle = (index * 60 + Date.now() * 0.001) * Math.PI / 180;
      const x = canvas.width / 2 + Math.cos(angle) * planet.distance;
      const y = canvas.height / 2 + Math.sin(angle) * planet.distance;
      
      ctx.fillStyle = planet.color;
      ctx.beginPath();
      ctx.arc(x, y, planet.size, 0, Math.PI * 2);
      ctx.fill();
      
      if (planet.discovered) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.fillText(planet.name, x - 20, y - planet.size - 10);
      }
    });

    // Draw player ship
    const shipX = (playerPosition.x / 100) * canvas.width;
    const shipY = (playerPosition.y / 100) * canvas.height;
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.moveTo(shipX, shipY - 8);
    ctx.lineTo(shipX - 6, shipY + 8);
    ctx.lineTo(shipX + 6, shipY + 8);
    ctx.closePath();
    ctx.fill();
  };

  const scanArea = () => {
    setGameState('scanning');
    setEnergy(prev => Math.max(0, prev - 10));
    
    setTimeout(() => {
      const results = [];
      if (Math.random() > 0.7) {
        results.push("Energy signature detected");
      }
      if (Math.random() > 0.8) {
        results.push("Unknown mineral deposits found");
      }
      if (Math.random() > 0.9) {
        results.push("Alien technology signature");
      }
      if (results.length === 0) {
        results.push("No significant readings");
      }
      setScanResults(results);
      setGameState('exploration');
    }, 2000);
  };

  const checkForPlanetLanding = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const shipX = (playerPosition.x / 100) * canvas.width;
    const shipY = (playerPosition.y / 100) * canvas.height;

    planets.forEach((planet, index) => {
      const angle = (index * 60 + Date.now() * 0.001) * Math.PI / 180;
      const planetX = canvas.width / 2 + Math.cos(angle) * planet.distance;
      const planetY = canvas.height / 2 + Math.sin(angle) * planet.distance;
      
      const distance = Math.sqrt((shipX - planetX) ** 2 + (shipY - planetY) ** 2);
      
      if (distance < planet.size + 20) {
        landOnPlanet(index);
      }
    });
  };

  const landOnPlanet = (planetIndex: number) => {
    setCurrentPlanet(planetIndex);
    setGameState('landed');
    setFuel(prev => Math.max(0, prev - 5));
    
    if (!discoveredPlanets.includes(planetIndex)) {
      setDiscoveredPlanets(prev => [...prev, planetIndex]);
    }
  };

  const takeOff = () => {
    setGameState('exploration');
    setFuel(prev => Math.max(0, prev - 10));
  };

  const refuel = () => {
    if (planets[currentPlanet].resources.includes("Water") || planets[currentPlanet].resources.includes("Hydrocarbons")) {
      setFuel(100);
      setEnergy(prev => Math.max(0, prev - 20));
    }
  };

  const restoreOxygen = () => {
    if (planets[currentPlanet].resources.includes("Oxygen") || planets[currentPlanet].resources.includes("Water")) {
      setOxygen(100);
      setEnergy(prev => Math.max(0, prev - 15));
    }
  };

  if (gameState === 'landed') {
    const planet = planets[currentPlanet];
    return (
      <div className="h-full bg-gradient-to-b from-purple-900 to-black text-white font-mono relative">
        <div className="absolute top-4 left-4 right-4 bg-black/80 p-4 rounded">
          <h2 className="text-xl font-bold text-yellow-400 mb-2">{planet.name}</h2>
          <p className="text-gray-300 mb-2">Type: {planet.type}</p>
          <p className="text-gray-300 mb-4">Resources: {planet.resources.join(", ")}</p>
          
          <div className="flex gap-4 mb-4">
            <button 
              onClick={refuel}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
              disabled={!planet.resources.some(r => r === "Water" || r === "Hydrocarbons")}
            >
              Refuel
            </button>
            <button 
              onClick={restoreOxygen}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              disabled={!planet.resources.some(r => r === "Oxygen" || r === "Water")}
            >
              Restore O2
            </button>
            <button 
              onClick={takeOff}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Take Off
            </button>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-64 h-64 rounded-full"
            style={{ backgroundColor: planet.color, opacity: 0.7 }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-black text-white font-mono relative">
      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 bg-gray-900/90 p-2 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-blue-500" />
            <span className="text-blue-500">{fuel.toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Globe className="w-4 h-4 text-green-500" />
            <span className="text-green-500">{oxygen.toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Settings className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-500">{energy.toFixed(0)}%</span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-yellow-500">EXPLORER VESSEL</div>
          <div className="text-green-500">PLANETS: {discoveredPlanets.length}/{planets.length}</div>
        </div>
      </div>

      {/* Space Canvas */}
      <canvas 
        ref={canvasRef}
        width={800}
        height={600}
        className="absolute inset-0 w-full h-full"
      />

      {/* Scanning Overlay */}
      {gameState === 'scanning' && (
        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl text-blue-400 mb-4">SCANNING...</div>
            <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      )}

      {/* Scan Results */}
      {scanResults.length > 0 && gameState === 'exploration' && (
        <div className="absolute bottom-20 left-4 bg-black/80 p-4 rounded max-w-md">
          <h3 className="text-yellow-400 font-bold mb-2">SCAN RESULTS:</h3>
          {scanResults.map((result, i) => (
            <div key={i} className="text-green-400">{result}</div>
          ))}
          <button 
            onClick={() => setScanResults([])}
            className="mt-2 text-gray-400 hover:text-white"
          >
            [CLEAR]
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-4 right-4 text-center bg-black/80 p-2 rounded">
        <div className="text-sm text-gray-400 mb-2">
          Controls: WASD to move | SPACE to scan | E to land/interact
        </div>
        <div className="text-xs text-gray-500">
          Navigate to planets and press E when close to land
        </div>
      </div>
    </div>
  );
};

export default PlanetExplorationSimulator;