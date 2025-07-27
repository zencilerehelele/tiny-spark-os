import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SearchPage = ({ onNavigate }: { onNavigate: (url: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchUrl, setSearchUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    // Load Google search results in iframe within the browser
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&igu=1`;
    setSearchUrl(googleSearchUrl);
  };

  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    try {
      const iframe = e.currentTarget;
      const iframeUrl = iframe.contentWindow?.location.href;
      if (iframeUrl && iframeUrl !== searchUrl && !iframeUrl.includes('google.com/search')) {
        // User clicked on a search result link, navigate the main browser to that URL
        onNavigate(iframeUrl);
      }
    } catch (error) {
      // Cross-origin restrictions, ignore
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-os-primary">TinySparkSearch</h1>
        <div className="max-w-2xl mx-auto flex gap-2">
          <Input 
            placeholder="Search the web..." 
            className="text-center flex-1" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {searchUrl ? (
        <div className="w-full h-[600px] border border-border rounded-lg overflow-hidden">
          <iframe 
            src={searchUrl}
            className="w-full h-full"
            title="Google Search Results"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
            onLoad={handleIframeLoad}
          />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-center text-muted-foreground">
            Enter a search term above to search the web with Google
          </div>
        </div>
      )}
    </div>
  );
};

const DocsPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const docs = {
    "getting-started": {
      title: "Getting Started with TinySpark Midnight",
      content: `
# Getting Started with TinySpark Midnight

Welcome to TinySpark Midnight 2.0.0! This guide will help you get familiar with your new operating system.

## Desktop Environment
- **Desktop Icons**: Double-click any icon to open an application
- **Draggable Icons**: You can drag icons around the desktop to organize them
- **Taskbar**: Located at the bottom, shows running applications

## Applications
- **Terminal**: Access via desktop icon or taskbar. Supports Linux-like commands
- **Browser**: Full web browsing with Google search integration
- **Music Player**: Listen to your favorite tracks with full playback controls
- **Game Library**: Play built-in games like Snake
- **File Manager**: Navigate and manage your files
- **Text Editor**: Create and edit documents
- **Calculator**: Perform calculations
- **YouTube**: Watch videos in a dedicated app

## Terminal Commands
- \`ls\` - List directory contents
- \`pwd\` - Print working directory  
- \`whoami\` - Show current user
- \`date\` - Show current date and time
- \`openapp [appname]\` - Open applications (browser, music, youtube, etc.)
- \`help\` - Show all available commands

## Window Management
- **Minimize**: Click the minus button in the window title bar
- **Maximize**: Click the square button to fullscreen
- **Close**: Click the X button to close the window
- **Drag**: Click and drag the title bar to move windows

## Customization
- **Backgrounds**: Use the Settings app to change your wallpaper
- **Themes**: Dark and light mode support built-in

Have fun exploring TinySpark Midnight!
      `
    }
  };

  if (selectedDoc && docs[selectedDoc as keyof typeof docs]) {
    const doc = docs[selectedDoc as keyof typeof docs];
    return (
      <div className="p-8 space-y-6 max-w-4xl">
        <Button variant="ghost" onClick={() => setSelectedDoc(null)}>
          ← Back to Documentation
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-window-foreground mb-4">{doc.title}</h1>
          <div className="prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-window-foreground">
              {doc.content}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-window-foreground">Documentation</h1>
      <div className="space-y-4">
        <section className="border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer"
                 onClick={() => setSelectedDoc("getting-started")}>
          <h3 className="font-semibold text-window-foreground">Getting Started</h3>
          <p className="text-sm text-muted-foreground">Learn how to use TinySpark Midnight 2.0.0</p>
        </section>
        <section className="border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
          <h3 className="font-semibold text-window-foreground">Terminal Commands</h3>
          <p className="text-sm text-muted-foreground">Complete list of available commands</p>
        </section>
        <section className="border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
          <h3 className="font-semibold text-window-foreground">Application Guide</h3>
          <p className="text-sm text-muted-foreground">How to use built-in applications</p>
        </section>
      </div>
    </div>
  );
};

export const Browser = () => {
  const [url, setUrl] = useState("https://www.example.com");
  const [currentPage, setCurrentPage] = useState("home");

  const handleNavigateToUrl = (newUrl: string) => {
    setUrl(newUrl);
    setCurrentPage("external");
  };

  const pages = {
    home: {
      title: "TinySpark Browser - Home",
      content: (
        <div className="p-8 space-y-6">
          <h1 className="text-3xl font-bold text-window-foreground">Welcome to TinySpark Browser</h1>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer"
                 onClick={() => { setCurrentPage("search"); setUrl("https://search.tinyspark.com"); }}>
              <h3 className="font-semibold text-window-foreground">Search Engine</h3>
              <p className="text-sm text-muted-foreground">Search the web</p>
            </div>
            <div className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer"
                 onClick={() => { setCurrentPage("news"); setUrl("https://news.tinyspark.com"); }}>
              <h3 className="font-semibold text-window-foreground">TinySpark News</h3>
              <p className="text-sm text-muted-foreground">Latest tech news</p>
            </div>
            <div className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer"
                 onClick={() => { setCurrentPage("docs"); setUrl("https://docs.tinyspark.com"); }}>
              <h3 className="font-semibold text-window-foreground">Documentation</h3>
              <p className="text-sm text-muted-foreground">OS documentation</p>
            </div>
            <div className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer"
                 onClick={() => { setCurrentPage("apps"); setUrl("https://apps.tinyspark.com"); }}>
              <h3 className="font-semibold text-window-foreground">App Store</h3>
              <p className="text-sm text-muted-foreground">Download applications</p>
            </div>
          </div>
        </div>
      )
    },
    search: {
      title: "TinySpark Search",
      content: (
        <SearchPage onNavigate={handleNavigateToUrl} />
      )
    },
    news: {
      title: "TinySpark News",
      content: (
        <div className="p-8 space-y-6">
          <h1 className="text-2xl font-bold text-window-foreground">Latest News</h1>
          <div className="space-y-4">
            <article className="border-b border-border pb-4">
              <h3 className="font-semibold text-window-foreground">TinySpark v2.0 Released</h3>
              <p className="text-sm text-muted-foreground">Major update with browser, game library and background customization</p>
            </article>
            <article className="border-b border-border pb-4">
              <h3 className="font-semibold text-window-foreground">Game Library Now Available</h3>
              <p className="text-sm text-muted-foreground">Play classic games directly in your browser</p>
            </article>
          </div>
        </div>
      )
    },
    docs: {
      title: "TinySpark Documentation",
      content: (
        <DocsPage onNavigate={(page) => { setCurrentPage(page); setUrl(`https://docs.tinyspark.com/${page}`); }} />
      )
    },
    apps: {
      title: "TinySpark App Store",
      content: (
        <div className="p-8 space-y-6">
          <h1 className="text-2xl font-bold text-window-foreground">App Store</h1>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold text-window-foreground">Code Editor Pro</h3>
              <p className="text-sm text-muted-foreground">Advanced code editing</p>
              <Button size="sm" className="mt-2">Install</Button>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold text-window-foreground">Media Player</h3>
              <p className="text-sm text-muted-foreground">Play audio and video</p>
              <Button size="sm" className="mt-2">Install</Button>
            </div>
          </div>
        </div>
      )
    },
    external: {
      title: "External Website",
      content: (
        <div className="w-full h-full">
          <iframe 
            src={url}
            className="w-full h-full border-0"
            title="External Website"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
          />
        </div>
      )
    }
  };

  return (
    <div className="h-full flex flex-col bg-window">
      {/* Browser toolbar */}
      <div className="border-b border-border p-2 flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => { setCurrentPage("home"); setUrl("https://www.example.com"); }}
        >
          <Home className="w-4 h-4" />
        </Button>
        <div className="flex-1 mx-2">
          <Input 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
            className="text-sm"
          />
        </div>
        <Button variant="ghost" size="sm">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Page content */}
      <div className="flex-1 overflow-auto">
        {pages[currentPage as keyof typeof pages]?.content}
      </div>
    </div>
  );
};