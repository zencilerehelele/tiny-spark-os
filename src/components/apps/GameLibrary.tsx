import { useState } from "react";
import { Play, Star, Download, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Game {
  id: string;
  title: string;
  genre: string;
  rating: number;
  description: string;
  installed: boolean;
}

export const GameLibrary = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [activeTab, setActiveTab] = useState<"library" | "store">("library");

  const installedGames: Game[] = [
    {
      id: "1",
      title: "Terminal Snake",
      genre: "Arcade",
      rating: 4.5,
      description: "Classic snake game in the terminal",
      installed: true
    },
    {
      id: "2", 
      title: "File Explorer Quest",
      genre: "Adventure",
      rating: 4.2,
      description: "Navigate through directories to find treasures",
      installed: true
    }
  ];

  const storeGames: Game[] = [
    {
      id: "3",
      title: "Code Warrior",
      genre: "Strategy",
      rating: 4.8,
      description: "Battle using programming languages",
      installed: false
    },
    {
      id: "4",
      title: "System Admin Simulator",
      genre: "Simulation", 
      rating: 4.3,
      description: "Manage servers and fix system issues",
      installed: false
    },
    {
      id: "5",
      title: "Pixel Penguin",
      genre: "Platform",
      rating: 4.6,
      description: "Help Tux the penguin save the open-source world",
      installed: false
    }
  ];

  const currentGames = activeTab === "library" ? installedGames : storeGames;

  return (
    <div className="h-full flex bg-window">
      {/* Sidebar */}
      <div className="w-64 border-r border-border p-4 space-y-4">
        <div className="space-y-2">
          <Button
            variant={activeTab === "library" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("library")}
          >
            <Gamepad2 className="w-4 h-4 mr-2" />
            My Library ({installedGames.length})
          </Button>
          <Button
            variant={activeTab === "store" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("store")}
          >
            <Download className="w-4 h-4 mr-2" />
            Game Store
          </Button>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="font-semibold text-window-foreground mb-2">Categories</h3>
          <div className="space-y-1 text-sm">
            <div className="text-muted-foreground cursor-pointer hover:text-window-foreground">Arcade</div>
            <div className="text-muted-foreground cursor-pointer hover:text-window-foreground">Strategy</div>
            <div className="text-muted-foreground cursor-pointer hover:text-window-foreground">Adventure</div>
            <div className="text-muted-foreground cursor-pointer hover:text-window-foreground">Simulation</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Games grid */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-window-foreground">
              {activeTab === "library" ? "My Games" : "Game Store"}
            </h2>
            <p className="text-muted-foreground">
              {activeTab === "library" 
                ? "Games you have installed" 
                : "Discover new games to play"
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentGames.map((game) => (
              <div
                key={game.id}
                className="border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => setSelectedGame(game)}
              >
                <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center">
                  <Gamepad2 className="w-8 h-8 text-muted-foreground" />
                </div>
                
                <h3 className="font-semibold text-window-foreground mb-1">{game.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{game.genre}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">{game.rating}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{game.description}</p>
                
                <Button size="sm" className="w-full">
                  {game.installed ? (
                    <>
                      <Play className="w-3 h-3 mr-1" />
                      Play
                    </>
                  ) : (
                    <>
                      <Download className="w-3 h-3 mr-1" />
                      Install
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Game details sidebar */}
        {selectedGame && (
          <div className="w-80 border-l border-border p-6">
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <Gamepad2 className="w-12 h-12 text-muted-foreground" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-window-foreground">{selectedGame.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{selectedGame.genre}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{selectedGame.rating}/5</span>
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground">{selectedGame.description}</p>
              
              <Button className="w-full">
                {selectedGame.installed ? (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Play Game
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Install Game
                  </>
                )}
              </Button>
              
              <div className="pt-4 border-t border-border">
                <h4 className="font-semibold text-window-foreground mb-2">System Requirements</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>OS: TinySparkOS 1.0+</div>
                  <div>Memory: 512MB RAM</div>
                  <div>Storage: 100MB</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};