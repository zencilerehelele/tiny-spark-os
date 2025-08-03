import React, { useState, useRef } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Home, Search, Lock, Globe, Bookmark, MoreVertical, Download, Star } from "lucide-react";

const Browser = () => {
  const [url, setUrl] = useState("https://lovable.dev");
  const [currentPage, setCurrentPage] = useState("home");
  const [history, setHistory] = useState<string[]>(["home"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [bookmarks, setBookmarks] = useState<string[]>(["https://lovable.dev", "https://github.com", "https://stackoverflow.com"]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const navigate = (page: string, addToHistory = true) => {
    setCurrentPage(page);
    if (addToHistory) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(page);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentPage(history[newIndex]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentPage(history[newIndex]);
    }
  };

  const refresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.startsWith("http")) {
      navigate("external");
    } else {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      setUrl(searchUrl);
      navigate("external");
    }
  };

  const quickLinks = [
    { name: "GitHub", url: "https://github.com", icon: "💻" },
    { name: "Stack Overflow", url: "https://stackoverflow.com", icon: "📚" },
    { name: "YouTube", url: "https://youtube.com", icon: "🎥" },
    { name: "Wikipedia", url: "https://wikipedia.org", icon: "📖" },
    { name: "Reddit", url: "https://reddit.com", icon: "🔗" },
    { name: "Hacker News", url: "https://news.ycombinator.com", icon: "🔥" }
  ];

  const renderHomePage = () => (
    <div className="p-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Spark Browser</h1>
          <p className="text-gray-600">Fast, secure, and private browsing experience</p>
        </div>

        <div className="mb-8">
          <form onSubmit={handleUrlSubmit} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Search the web or enter a URL..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
            </div>
          </form>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {quickLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => {
                setUrl(link.url);
                navigate("external");
              }}
              className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors"
            >
              <div className="text-3xl mb-2">{link.icon}</div>
              <div className="font-medium text-gray-800">{link.name}</div>
            </button>
          ))}
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Bookmarks</h3>
          <div className="space-y-2">
            {bookmarks.slice(0, 5).map((bookmark, index) => (
              <button
                key={index}
                onClick={() => {
                  setUrl(bookmark);
                  navigate("external");
                }}
                className="flex items-center gap-3 w-full p-2 hover:bg-blue-100 rounded text-left"
              >
                <Bookmark className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700">{bookmark}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderExternalPage = () => (
    <div className="h-full bg-white">
      <iframe
        ref={iframeRef}
        src={url}
        className="w-full h-full border-0"
        title="Browser Content"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );

  const renderContent = () => {
    switch (currentPage) {
      case "home":
        return renderHomePage();
      case "external":
        return renderExternalPage();
      default:
        return renderHomePage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Browser Controls */}
      <div className="bg-white border-b flex items-center px-4 py-2 gap-2">
        {/* Navigation buttons */}
        <button
          onClick={goBack}
          disabled={historyIndex <= 0}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <button onClick={refresh} className="p-2 rounded hover:bg-gray-100">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button onClick={() => navigate("home")} className="p-2 rounded hover:bg-gray-100">
          <Home className="w-4 h-4" />
        </button>

        {/* URL Bar */}
        <form onSubmit={handleUrlSubmit} className="flex-1 mx-4">
          <div className="relative flex items-center">
            <div className="absolute left-3 flex items-center">
              <Lock className="w-4 h-4 text-green-600" />
            </div>
            <input
              type="text"
              value={currentPage === "home" ? "" : url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Search or enter web address"
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-3 p-1 text-gray-400 hover:text-gray-600"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Action buttons */}
        <button
          onClick={() => setBookmarks(prev => prev.includes(url) ? prev : [...prev, url])}
          className="p-2 rounded hover:bg-gray-100"
        >
          <Star className={`w-4 h-4 ${bookmarks.includes(url) ? 'text-yellow-500 fill-current' : ''}`} />
        </button>
        <button className="p-2 rounded hover:bg-gray-100">
          <Download className="w-4 h-4" />
        </button>
        <button className="p-2 rounded hover:bg-gray-100">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};

export default Browser;