import React, { useState, useRef } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Home, Search, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Firefox = () => {
  const [url, setUrl] = useState("https://www.google.com");
  const [tabs, setTabs] = useState([
    { id: 1, title: "New Tab", url: "https://www.google.com", active: true }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleNavigate = () => {
    const currentTab = tabs.find(tab => tab.id === activeTabId);
    if (currentTab) {
      const updatedTabs = tabs.map(tab => 
        tab.id === activeTabId 
          ? { ...tab, url: url, title: "Loading..." }
          : tab
      );
      setTabs(updatedTabs);
    }
  };

  const addNewTab = () => {
    const newId = Math.max(...tabs.map(t => t.id)) + 1;
    const newTab = {
      id: newId,
      title: "New Tab",
      url: "https://www.google.com",
      active: true
    };
    setTabs([...tabs.map(t => ({ ...t, active: false })), newTab]);
    setActiveTabId(newId);
    setUrl("https://www.google.com");
  };

  const closeTab = (tabId: number) => {
    if (tabs.length === 1) return;
    const remainingTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(remainingTabs);
    if (activeTabId === tabId) {
      const nextTab = remainingTabs[0];
      setActiveTabId(nextTab.id);
      setUrl(nextTab.url);
    }
  };

  const switchTab = (tabId: number) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setTabs(tabs.map(t => ({ ...t, active: t.id === tabId })));
      setActiveTabId(tabId);
      setUrl(tab.url);
    }
  };

  return (
    <div className="h-full bg-background text-foreground flex flex-col">
      {/* Tab Bar */}
      <div className="flex bg-muted border-b border-border">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`
              flex items-center gap-2 px-4 py-2 border-r border-border cursor-pointer min-w-0 max-w-48
              ${tab.id === activeTabId ? 'bg-background' : 'hover:bg-background/50'}
            `}
            onClick={() => switchTab(tab.id)}
          >
            <span className="text-sm truncate flex-1">{tab.title}</span>
            {tabs.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="px-2"
          onClick={addNewTab}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center gap-2 p-2 bg-muted border-b border-border">
        <Button variant="ghost" size="sm" disabled>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" disabled>
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setUrl("https://www.google.com")}>
          <Home className="w-4 h-4" />
        </Button>
        <div className="flex-1 flex items-center gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleNavigate()}
            className="flex-1"
            placeholder="Search or enter address"
          />
          <Button size="sm" onClick={handleNavigate}>
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <iframe
          ref={iframeRef}
          src={tabs.find(t => t.id === activeTabId)?.url}
          className="w-full h-full border-0"
          title="Firefox Browser"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation allow-popups-to-escape-sandbox allow-presentation"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => {
            const currentTab = tabs.find(t => t.id === activeTabId);
            if (currentTab) {
              setTabs(prev => prev.map(tab => 
                tab.id === activeTabId 
                  ? { ...tab, title: new URL(currentTab.url).hostname }
                  : tab
              ));
            }
          }}
        />
      </div>
    </div>
  );
};

export { Firefox };