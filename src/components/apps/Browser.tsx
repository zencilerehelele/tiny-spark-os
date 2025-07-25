import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Browser = () => {
  const [url, setUrl] = useState("https://www.example.com");
  const [currentPage, setCurrentPage] = useState("home");

  const pages = {
    home: {
      title: "TinySparkOS Browser - Home",
      content: (
        <div className="p-8 space-y-6">
          <h1 className="text-3xl font-bold text-window-foreground">Welcome to TinySparkOS Browser</h1>
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
      title: "TinySparkOS Search",
      content: (
        <div className="p-8 space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-os-primary">TinySparkSearch</h1>
            <div className="max-w-md mx-auto">
              <Input placeholder="Search the web..." className="text-center" />
            </div>
          </div>
        </div>
      )
    },
    news: {
      title: "TinySparkOS News",
      content: (
        <div className="p-8 space-y-6">
          <h1 className="text-2xl font-bold text-window-foreground">Latest News</h1>
          <div className="space-y-4">
            <article className="border-b border-border pb-4">
              <h3 className="font-semibold text-window-foreground">TinySparkOS v1.0 Released</h3>
              <p className="text-sm text-muted-foreground">New features include improved terminal and file manager</p>
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
      title: "TinySparkOS Documentation",
      content: (
        <div className="p-8 space-y-6">
          <h1 className="text-2xl font-bold text-window-foreground">Documentation</h1>
          <div className="space-y-4">
            <section>
              <h3 className="font-semibold text-window-foreground">Getting Started</h3>
              <p className="text-sm text-muted-foreground">Learn how to use TinySparkOS</p>
            </section>
            <section>
              <h3 className="font-semibold text-window-foreground">Terminal Commands</h3>
              <p className="text-sm text-muted-foreground">Complete list of available commands</p>
            </section>
          </div>
        </div>
      )
    },
    apps: {
      title: "TinySparkOS App Store",
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