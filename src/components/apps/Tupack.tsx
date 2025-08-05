import React, { useState, useEffect } from "react";
import { Package, Download, Trash2, Search, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { appStore, type InstalledApp } from "@/utils/appStore";

const Tupack = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [installedApps, setInstalledApps] = useState<InstalledApp[]>([]);
  const [installing, setInstalling] = useState<string[]>([]);

  useEffect(() => {
    setInstalledApps(appStore.getInstalledApps());
    const unsubscribe = appStore.subscribe(setInstalledApps);
    return unsubscribe;
  }, []);

  const availablePackages = [
    { name: "discord", description: "Voice and text chat for gamers", size: "85.2 MB", category: "Communication" },
    { name: "blender", description: "3D creation suite", size: "245.8 MB", category: "Graphics" },
    { name: "gimp", description: "GNU Image Manipulation Program", size: "156.4 MB", category: "Graphics" },
    { name: "vlc", description: "VLC media player", size: "64.1 MB", category: "Multimedia" },
    { name: "code", description: "Visual Studio Code", size: "89.7 MB", category: "Development" },
    { name: "docker", description: "Container platform", size: "125.3 MB", category: "Development" },
    { name: "thunderbird", description: "Email client", size: "78.9 MB", category: "Communication" },
    { name: "steam", description: "Gaming platform", size: "189.4 MB", category: "Games" },
    { name: "obs-studio", description: "Recording and streaming", size: "167.2 MB", category: "Multimedia" },
    { name: "telegram", description: "Messaging app", size: "45.6 MB", category: "Communication" }
  ];

  const filteredPackages = availablePackages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const installPackage = (packageName: string) => {
    setInstalling(prev => [...prev, packageName]);
    setTimeout(() => {
      // Create app object for installation
      const newApp: InstalledApp = {
        id: packageName,
        name: packageName,
        title: packageName,
        app: packageName,
        icon: 'Download',
        size: availablePackages.find(p => p.name === packageName)?.size || '0 MB',
        installedAt: new Date().toISOString()
      };
      
      appStore.installApp(newApp);
      setInstalling(prev => prev.filter(p => p !== packageName));
    }, 2000 + Math.random() * 3000);
  };

  const removePackage = (packageId: string) => {
    appStore.removeApp(packageId);
  };

  return (
    <div className="h-full bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Tupack Package Manager</h1>
            <p className="text-blue-200">Manage your system packages</p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700 mb-2">Categories</h3>
            {["All", "Development", "Graphics", "Multimedia", "Communication", "Games"].map(category => (
              <button
                key={category}
                className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-700 mb-2">Installed ({installedApps.length})</h3>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {installedApps.slice(0, 10).map(app => (
                <div key={app.id} className="flex items-center justify-between text-sm">
                  <div>
                    <div className="text-gray-600">{app.name}</div>
                    <div className="text-xs text-gray-400">{app.size}</div>
                  </div>
                  <button
                    onClick={() => removePackage(app.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Available Packages</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          <div className="grid gap-4">
            {filteredPackages.map(pkg => {
              const isInstalled = installedApps.some(app => app.id === pkg.name);
              const isInstalling = installing.includes(pkg.name);

              return (
                <div key={pkg.name} className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{pkg.name}</h3>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">{pkg.category}</span>
                      </div>
                      <p className="text-gray-600 mb-2">{pkg.description}</p>
                      <p className="text-sm text-gray-500">Size: {pkg.size}</p>
                    </div>
                    
                    <div className="ml-4">
                      {isInstalled ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Installed</span>
                        </div>
                      ) : isInstalling ? (
                        <div className="flex items-center gap-2 text-blue-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-sm">Installing...</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => installPackage(pkg.name)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          <Download className="w-4 h-4" />
                          Install
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tupack;