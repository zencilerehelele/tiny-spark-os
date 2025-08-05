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
    if (url.includes('google.com') || url.includes('search')) {
      navigate('google');
    } else if (url.includes('youtube.com')) {
      navigate('youtube');
    } else if (url.includes('github.com')) {
      navigate('github');
    } else if (url.includes('stackoverflow.com')) {
      navigate('stackoverflow');
    } else if (url.includes('reddit.com')) {
      navigate('reddit');
    } else if (url.includes('wikipedia.org')) {
      navigate('wikipedia');
    } else if (url.includes('news.ycombinator.com')) {
      navigate('hackernews');
    } else if (url.startsWith("http")) {
      navigate("external");
    } else {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      setUrl(searchUrl);
      navigate("google");
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
                if (link.url.includes('github.com')) {
                  navigate('github');
                } else if (link.url.includes('stackoverflow.com')) {
                  navigate('stackoverflow');
                } else if (link.url.includes('youtube.com')) {
                  navigate('youtube');
                } else if (link.url.includes('wikipedia.org')) {
                  navigate('wikipedia');
                } else if (link.url.includes('reddit.com')) {
                  navigate('reddit');
                } else if (link.url.includes('news.ycombinator.com')) {
                  navigate('hackernews');
                } else {
                  navigate("external");
                }
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

  const renderWebsitePage = () => {
    const getPageContent = () => {
      switch (currentPage) {
        case 'google':
          return (
            <div className="h-full bg-white">
              <div className="max-w-xl mx-auto pt-20">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-8">Google</div>
                  <div className="relative mb-8">
                    <input
                      type="text"
                      className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Search Google or type a URL"
                    />
                    <button className="absolute right-3 top-3 text-gray-400">🔍</button>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <button className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">Google Search</button>
                    <button className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">I'm Feeling Lucky</button>
                  </div>
                </div>
              </div>
            </div>
          );
        case 'youtube':
          return (
            <div className="h-full bg-white">
              <div className="bg-red-600 text-white p-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">YouTube</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                {['Tech Review', 'Music Video', 'Tutorial', 'Gaming', 'Cooking', 'Travel'].map((title, i) => (
                  <div key={i} className="bg-gray-100 rounded-lg p-4">
                    <div className="bg-gray-300 h-32 rounded mb-3"></div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-sm text-gray-600">Sample Video Content</p>
                    <div className="text-xs text-gray-500 mt-2">👁️ {Math.floor(Math.random() * 100)}K views</div>
                  </div>
                ))}
              </div>
            </div>
          );
        case 'github':
          return (
            <div className="h-full bg-white">
              <div className="bg-gray-900 text-white p-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">GitHub</div>
                  <div className="text-sm">Where the world builds software</div>
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Trending Repositories</h2>
                <div className="space-y-4">
                  {['awesome-project', 'web-framework', 'ml-toolkit', 'react-library', 'python-scripts'].map((repo, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-blue-600">{repo}</h3>
                      <p className="text-gray-600 text-sm mt-1">A cool open source project for developers</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span>⭐ {Math.floor(Math.random() * 1000)} stars</span>
                        <span>🍴 {Math.floor(Math.random() * 100)} forks</span>
                        <span>JavaScript</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        case 'stackoverflow':
          return (
            <div className="h-full bg-white">
              <div className="bg-orange-500 text-white p-4 mb-6">
                <div className="text-2xl font-bold">Stack Overflow</div>
                <div className="text-sm">Where Developers Learn, Share, & Build Careers</div>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Top Questions</h2>
                <div className="space-y-4">
                  {[
                    'How to center a div in CSS?',
                    'What is the difference between == and === in JavaScript?',
                    'How to handle async/await in React?',
                    'Best practices for REST API design',
                    'Understanding JavaScript closures'
                  ].map((question, i) => (
                    <div key={i} className="border-b pb-4">
                      <h3 className="font-semibold text-blue-600 mb-2">{question}</h3>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>👍 {Math.floor(Math.random() * 50)} votes</span>
                        <span>💬 {Math.floor(Math.random() * 10)} answers</span>
                        <span>👁️ {Math.floor(Math.random() * 1000)} views</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        case 'reddit':
          return (
            <div className="h-full bg-white">
              <div className="bg-orange-600 text-white p-4 mb-6">
                <div className="text-2xl font-bold">Reddit</div>
                <div className="text-sm">The front page of the internet</div>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Popular Posts</h2>
                <div className="space-y-4">
                  {[
                    'TIL something amazing about programming',
                    'What\'s your favorite coding setup?',
                    'Just shipped my first app!',
                    'Life Pro Tips for developers',
                    'Funny programming memes'
                  ].map((post, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">{post}</h3>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>⬆️ {Math.floor(Math.random() * 1000)} upvotes</span>
                        <span>💬 {Math.floor(Math.random() * 100)} comments</span>
                        <span>🏆 r/programming</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        case 'wikipedia':
          return (
            <div className="h-full bg-white">
              <div className="border-b pb-4 mb-6 p-4">
                <h1 className="text-3xl font-bold">Wikipedia</h1>
                <p className="text-gray-600">The Free Encyclopedia</p>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Featured Article</h2>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <h3 className="font-semibold mb-2">Computer Programming</h3>
                  <p className="text-gray-700">
                    Computer programming is the process of creating and building an executable computer program 
                    to accomplish a specific computing result or to perform a specific task. Programming involves 
                    tasks such as analysis, generating algorithms, profiling algorithms' accuracy...
                  </p>
                </div>
                <h3 className="font-semibold mb-2">Today's Featured Topics</h3>
                <ul className="list-disc list-inside space-y-1 text-blue-600">
                  <li>Artificial Intelligence</li>
                  <li>Web Development</li>
                  <li>Open Source Software</li>
                  <li>Machine Learning</li>
                  <li>Data Science</li>
                </ul>
              </div>
            </div>
          );
        case 'hackernews':
          return (
            <div className="h-full bg-white">
              <div className="bg-orange-600 text-white p-4 mb-6">
                <div className="text-2xl font-bold">Hacker News</div>
                <div className="text-sm">Tech news and discussion</div>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Top Stories</h2>
                <div className="space-y-4">
                  {[
                    'New JavaScript framework revolutionizes web development',
                    'AI breakthrough in code generation',
                    'Open source project gains 10k GitHub stars',
                    'Startup raises $50M for developer tools',
                    'Tech giant releases new programming language'
                  ].map((story, i) => (
                    <div key={i} className="border-b pb-4">
                      <h3 className="font-semibold text-black mb-2">{story}</h3>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>📈 {Math.floor(Math.random() * 500)} points</span>
                        <span>💬 {Math.floor(Math.random() * 50)} comments</span>
                        <span>⏰ {Math.floor(Math.random() * 12)} hours ago</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        default:
          return (
            <div className="h-full flex items-center justify-center bg-gray-50">
              <div className="text-center p-8">
                <Globe className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Website Preview</h3>
                <p className="text-gray-600 mb-4">Simulated content for: {url}</p>
                <div className="bg-white border rounded-lg p-6 max-w-md">
                  <h4 className="font-bold mb-2">Sample Website Content</h4>
                  <p className="text-sm text-gray-600">This is a simulated website view. In a real browser, you would see the actual website content here.</p>
                </div>
              </div>
            </div>
          );
      }
    };

    return getPageContent();
  };

  const renderContent = () => {
    switch (currentPage) {
      case "home":
        return renderHomePage();
      case "external":
        return renderWebsitePage();
      case "google":
      case "youtube": 
      case "github":
      case "stackoverflow":
      case "reddit":
      case "wikipedia":
      case "hackernews":
        return renderWebsitePage();
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