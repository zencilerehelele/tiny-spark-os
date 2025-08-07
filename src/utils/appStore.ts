// Shared app state management
interface InstalledApp {
  id: string;
  name: string;
  title: string;
  app: string;
  icon: string;
  size: string;
  installedAt: string;
}

class AppStore {
  private installedApps: InstalledApp[] = [];
  private listeners: ((apps: InstalledApp[]) => void)[] = [];

  constructor() {
    // Load initial state from localStorage
    const stored = localStorage.getItem('installedApps');
    if (stored) {
      this.installedApps = JSON.parse(stored);
    } else {
      this.installedApps = [
        { id: 'browser', name: 'Spark Browser', title: 'Spark Browser', app: 'browser', icon: 'Globe', size: '45.2 MB', installedAt: new Date().toISOString() },
        { id: 'files', name: 'Files', title: 'Files', app: 'filesystem', icon: 'FolderOpen', size: '23.1 MB', installedAt: new Date().toISOString() },
        { id: 'terminal', name: 'Terminal', title: 'Terminal', app: 'kali-terminal', icon: 'Terminal', size: '12.8 MB', installedAt: new Date().toISOString() },
        { id: 'calculator', name: 'Calculator', title: 'Calculator', app: 'calculator', icon: 'Calculator', size: '8.5 MB', installedAt: new Date().toISOString() },
        { id: 'editor', name: 'Text Editor', title: 'Text Editor', app: 'editor', icon: 'FileText', size: '15.2 MB', installedAt: new Date().toISOString() },
        { id: 'music', name: 'Music Player', title: 'Music Player', app: 'music', icon: 'Music', size: '32.4 MB', installedAt: new Date().toISOString() },
        { id: 'games', name: 'Games', title: 'Games', app: 'games', icon: 'Gamepad2', size: '50.0 MB', installedAt: new Date().toISOString() },
        { id: 'wallpaper', name: 'Wallpaper Downloader', title: 'Wallpaper Downloader', app: 'wallpaper', icon: 'Palette', size: '10.5 MB', installedAt: new Date().toISOString() },
        { id: 'tupack', name: 'Tupack', title: 'Tupack', app: 'tupack', icon: 'Settings', size: '18.7 MB', installedAt: new Date().toISOString() },
        { id: 'bazaar', name: 'Bazaar', title: 'Bazaar', app: 'bazaar', icon: 'Download', size: '25.6 MB', installedAt: new Date().toISOString() }
      ];
      this.saveToStorage();
    }
  }

  private saveToStorage() {
    localStorage.setItem('installedApps', JSON.stringify(this.installedApps));
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.installedApps]));
  }

  getInstalledApps(): InstalledApp[] {
    return [...this.installedApps];
  }

  isAppInstalled(appId: string): boolean {
    return this.installedApps.some(app => app.id === appId);
  }

  installApp(app: InstalledApp): boolean {
    if (this.isAppInstalled(app.id)) {
      return false; // Already installed
    }
    this.installedApps.push({
      ...app,
      installedAt: new Date().toISOString()
    });
    this.saveToStorage();
    this.notifyListeners();
    
    // Dispatch event to update desktop icons
    window.dispatchEvent(new CustomEvent('appInstalled', { detail: app }));
    return true;
  }

  removeApp(appId: string): boolean {
    const initialLength = this.installedApps.length;
    this.installedApps = this.installedApps.filter(app => app.id !== appId);
    
    if (this.installedApps.length < initialLength) {
      this.saveToStorage();
      this.notifyListeners();
      
      // Dispatch event to update desktop icons
      window.dispatchEvent(new CustomEvent('appRemoved', { detail: { appId } }));
      return true;
    }
    return false;
  }

  subscribe(listener: (apps: InstalledApp[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}

export const appStore = new AppStore();
export type { InstalledApp };