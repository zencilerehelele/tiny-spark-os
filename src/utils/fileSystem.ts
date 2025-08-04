// Simple file system simulation
interface FileSystemItem {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileSystemItem[];
  lastModified: Date;
}

class FileSystemStorage {
  private storage: Storage;
  private key = 'spark-os-filesystem';

  constructor() {
    this.storage = localStorage;
  }

  getFileSystem(): FileSystemItem {
    const stored = this.storage.getItem(this.key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        this.convertDates(parsed);
        return parsed;
      } catch {
        return this.getDefaultFileSystem();
      }
    }
    return this.getDefaultFileSystem();
  }

  private convertDates(item: any): void {
    if (item.lastModified && typeof item.lastModified === 'string') {
      item.lastModified = new Date(item.lastModified);
    }
    if (item.children) {
      item.children.forEach((child: any) => this.convertDates(child));
    }
  }

  saveFileSystem(fileSystem: FileSystemItem): void {
    this.storage.setItem(this.key, JSON.stringify(fileSystem));
  }

  private getDefaultFileSystem(): FileSystemItem {
    return {
      name: 'root',
      type: 'folder',
      lastModified: new Date(),
      children: [
        {
          name: 'Documents',
          type: 'folder',
          lastModified: new Date(),
          children: [
            {
              name: 'Welcome.txt',
              type: 'file',
              content: 'Welcome to SparkOS!\n\nThis is your personal file system where you can save and organize your documents.',
              lastModified: new Date()
            }
          ]
        },
        {
          name: 'Downloads',
          type: 'folder',
          lastModified: new Date(),
          children: []
        },
        {
          name: 'Pictures',
          type: 'folder',
          lastModified: new Date(),
          children: []
        }
      ]
    };
  }

  saveFile(path: string, filename: string, content: string): boolean {
    try {
      const fileSystem = this.getFileSystem();
      const pathParts = path === '/' ? [] : path.split('/').filter(Boolean);
      
      let currentDir = fileSystem;
      
      // Navigate to the target directory
      for (const part of pathParts) {
        const found = currentDir.children?.find(child => child.name === part && child.type === 'folder');
        if (!found) {
          // Create the directory if it doesn't exist
          if (!currentDir.children) currentDir.children = [];
          const newDir: FileSystemItem = {
            name: part,
            type: 'folder',
            lastModified: new Date(),
            children: []
          };
          currentDir.children.push(newDir);
          currentDir = newDir;
        } else {
          currentDir = found;
        }
      }

      if (!currentDir.children) currentDir.children = [];
      
      // Check if file already exists
      const existingFile = currentDir.children.find(child => child.name === filename && child.type === 'file');
      
      if (existingFile) {
        // Update existing file
        existingFile.content = content;
        existingFile.lastModified = new Date();
      } else {
        // Create new file
        currentDir.children.push({
          name: filename,
          type: 'file',
          content,
          lastModified: new Date()
        });
      }

      this.saveFileSystem(fileSystem);
      return true;
    } catch {
      return false;
    }
  }

  loadFile(path: string, filename: string): string | null {
    try {
      const fileSystem = this.getFileSystem();
      const pathParts = path === '/' ? [] : path.split('/').filter(Boolean);
      
      let currentDir = fileSystem;
      
      // Navigate to the target directory
      for (const part of pathParts) {
        const found = currentDir.children?.find(child => child.name === part && child.type === 'folder');
        if (!found) return null;
        currentDir = found;
      }

      // Find the file
      const file = currentDir.children?.find(child => child.name === filename && child.type === 'file');
      return file?.content || null;
    } catch {
      return null;
    }
  }

  listDirectory(path: string): FileSystemItem[] {
    try {
      const fileSystem = this.getFileSystem();
      const pathParts = path === '/' ? [] : path.split('/').filter(Boolean);
      
      let currentDir = fileSystem;
      
      // Navigate to the target directory
      for (const part of pathParts) {
        const found = currentDir.children?.find(child => child.name === part && child.type === 'folder');
        if (!found) return [];
        currentDir = found;
      }

      return currentDir.children || [];
    } catch {
      return [];
    }
  }
}

export const fileSystemStorage = new FileSystemStorage();