import React, { useState } from "react";
import { Store, Download, Star, Search, Filter, Gamepad2, Image, Music, Video, Code, BookOpen } from "lucide-react";

const Bazaar = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [downloading, setDownloading] = useState<string[]>([]);

  const categories = [
    { id: "all", name: "All", icon: Store },
    { id: "games", name: "Games", icon: Gamepad2 },
    { id: "graphics", name: "Graphics", icon: Image },
    { id: "music", name: "Music", icon: Music },
    { id: "video", name: "Video", icon: Video },
    { id: "development", name: "Development", icon: Code },
    { id: "education", name: "Education", icon: BookOpen }
  ];

  const apps = [
    {
      id: "doom-clone",
      name: "Doom Clone",
      description: "Classic FPS demon fighting experience",
      category: "games",
      rating: 4.8,
      downloads: "125K",
      size: "45 MB",
      image: "🔫",
      featured: true
    },
    {
      id: "pixel-painter",
      name: "Pixel Painter",
      description: "Create pixel art masterpieces",
      category: "graphics",
      rating: 4.6,
      downloads: "89K",
      size: "12 MB",
      image: "🎨",
      featured: false
    },
    {
      id: "terminal-music",
      name: "Terminal Music Player",
      description: "Command-line music experience",
      category: "music",
      rating: 4.4,
      downloads: "67K",
      size: "8 MB",
      image: "🎵",
      featured: false
    },
    {
      id: "code-ninja",
      name: "Code Ninja IDE",
      description: "Lightweight programming environment",
      category: "development",
      rating: 4.7,
      downloads: "156K",
      size: "89 MB",
      image: "💻",
      featured: true
    },
    {
      id: "retro-calculator",
      name: "Retro Calculator",
      description: "Vintage calculator with style",
      category: "education",
      rating: 4.3,
      downloads: "45K",
      size: "3 MB",
      image: "🧮",
      featured: false
    },
    {
      id: "snake-classic",
      name: "Snake Classic",
      description: "The timeless snake game",
      category: "games",
      rating: 4.5,
      downloads: "234K",
      size: "2 MB",
      image: "🐍",
      featured: false
    },
    {
      id: "video-mixer",
      name: "Video Mixer",
      description: "Mix and edit videos easily",
      category: "video",
      rating: 4.2,
      downloads: "78K",
      size: "156 MB",
      image: "🎬",
      featured: false
    },
    {
      id: "math-tutor",
      name: "Math Tutor",
      description: "Interactive math learning",
      category: "education",
      rating: 4.9,
      downloads: "189K",
      size: "25 MB",
      image: "📐",
      featured: true
    }
  ];

  const filteredApps = apps.filter(app => {
    const matchesCategory = selectedCategory === "all" || app.category === selectedCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredApps = apps.filter(app => app.featured);

  const downloadApp = (appId: string, appName: string) => {
    setDownloading(prev => [...prev, appId]);
    
    // Simulate app opening after download
    setTimeout(() => {
      setDownloading(prev => prev.filter(id => id !== appId));
      
      // Dispatch event to open the app
      const appMapping: { [key: string]: { app: string; title: string } } = {
        "doom-clone": { app: "doom", title: "Doom Clone" },
        "pixel-painter": { app: "draw", title: "Pixel Painter" },
        "terminal-music": { app: "music", title: "Terminal Music Player" },
        "code-ninja": { app: "programming", title: "Code Ninja IDE" },
        "retro-calculator": { app: "calculator", title: "Retro Calculator" },
        "snake-classic": { app: "snake", title: "Snake Classic" },
        "video-mixer": { app: "video-editor", title: "Video Mixer" },
        "math-tutor": { app: "math-tutor", title: "Math Tutor" }
      };
      
      const appInfo = appMapping[appId];
      if (appInfo) {
        const event = new CustomEvent('openApp', { detail: appInfo });
        window.dispatchEvent(event);
      }
    }, 3000);
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-6">
        <div className="flex items-center gap-3 mb-4">
          <Store className="w-8 h-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Bazaar</h1>
            <p className="text-gray-600">Discover amazing apps and games</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search apps and games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 border rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r p-4">
          <h3 className="font-semibold text-gray-700 mb-4">Categories</h3>
          <div className="space-y-1">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <category.icon className="w-5 h-5" />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Featured Apps */}
          {selectedCategory === "all" && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Apps</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredApps.map(app => (
                  <div key={app.id} className="bg-white rounded-xl shadow-lg p-6 border">
                    <div className="text-center mb-4">
                      <div className="text-6xl mb-2">{app.image}</div>
                      <h3 className="text-xl font-bold text-gray-800">{app.name}</h3>
                      <p className="text-gray-600 text-sm">{app.description}</p>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{app.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">{app.downloads}</span>
                    </div>
                    <button
                      onClick={() => downloadApp(app.id, app.name)}
                      disabled={downloading.includes(app.id)}
                      className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {downloading.includes(app.id) ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Installing...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Install
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Apps */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {selectedCategory === "all" ? "All Apps" : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <div className="grid gap-4">
              {filteredApps.map(app => (
                <div key={app.id} className="bg-white rounded-lg shadow p-4 border flex items-center gap-4">
                  <div className="text-4xl">{app.image}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">{app.name}</h3>
                    <p className="text-gray-600 text-sm">{app.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{app.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">{app.downloads} downloads</span>
                      <span className="text-sm text-gray-500">{app.size}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadApp(app.id, app.name)}
                    disabled={downloading.includes(app.id)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {downloading.includes(app.id) ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Installing...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Install
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bazaar;