import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

const SpotifyApp = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([50]);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<'home' | 'search' | 'library'>('home');
  const audioRef = useRef<HTMLAudioElement>(null);

  const tracks = [
    {
      id: 1,
      title: "Ugoku, Ugoku",
      artist: "Chito (Inori Minase) & Yuuri (Yurika Kubo)",
      album: "Girls' Last Tour OP",
      duration: "1:30",
      src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      image: "/src/assets/girls-last-tour-wallpaper.jpg"
    },
    {
      id: 2,
      title: "More Life, More Everything",
      artist: "Girls' Last Tour OST",
      album: "Girls' Last Tour",
      duration: "2:15",
      src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      image: "/src/assets/girls-last-tour-wallpaper.jpg"
    },
    {
      id: 3,
      title: "Amadare no Uta",
      artist: "Inori Minase",
      album: "Girls' Last Tour ED",
      duration: "3:45",
      src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      image: "/src/assets/girls-last-tour-wallpaper.jpg"
    }
  ];

  const playlists = [
    { id: 1, name: "Anime Vibes", tracks: 23, image: "/src/assets/girls-last-tour-wallpaper.jpg" },
    { id: 2, name: "Chill Lofi", tracks: 45, image: "/src/assets/mountain-wallpaper.jpg" },
    { id: 3, name: "Study Music", tracks: 67, image: "/src/assets/neon-city-wallpaper.jpg" }
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleNext);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleNext);
    };
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume[0] / 100;
  }, [volume]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const nextTrack = isShuffle 
      ? Math.floor(Math.random() * tracks.length)
      : (currentTrack + 1) % tracks.length;
    setCurrentTrack(nextTrack);
  };

  const handlePrevious = () => {
    const prevTrack = currentTrack === 0 ? tracks.length - 1 : currentTrack - 1;
    setCurrentTrack(prevTrack);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentTrackData = tracks[currentTrack];

  return (
    <div className="h-full bg-black text-white flex flex-col">
      <audio 
        ref={audioRef} 
        src={currentTrackData?.src}
        loop={isRepeat}
        autoPlay={false}
      />

      {/* Top Navigation */}
      <div className="flex items-center justify-between p-4 bg-gray-900">
        <div className="flex gap-4">
          <Button
            variant={activeView === 'home' ? 'default' : 'ghost'}
            onClick={() => setActiveView('home')}
            className="text-white"
          >
            Home
          </Button>
          <Button
            variant={activeView === 'search' ? 'default' : 'ghost'}
            onClick={() => setActiveView('search')}
            className="text-white"
          >
            Search
          </Button>
          <Button
            variant={activeView === 'library' ? 'default' : 'ghost'}
            onClick={() => setActiveView('library')}
            className="text-white"
          >
            Your Library
          </Button>
        </div>
        <div className="text-xl font-bold text-green-500">Spotify</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4 text-gray-300">Recently Played</h3>
          {playlists.map((playlist) => (
            <div key={playlist.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 cursor-pointer mb-2">
              <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-2xl">
                🎵
              </div>
              <div>
                <div className="font-medium">{playlist.name}</div>
                <div className="text-sm text-gray-400">{playlist.tracks} songs</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main View */}
        <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-green-900/20 to-black">
          {activeView === 'home' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Good evening</h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {playlists.slice(0, 4).map((playlist) => (
                  <div key={playlist.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 cursor-pointer transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-600 rounded flex items-center justify-center text-2xl">
                        🎵
                      </div>
                      <div>
                        <h3 className="font-semibold">{playlist.name}</h3>
                        <p className="text-gray-400">{playlist.tracks} songs</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <h3 className="text-2xl font-bold mb-4">Recently played</h3>
              <div className="grid grid-cols-1 gap-2">
                {tracks.map((track, index) => (
                  <div
                    key={track.id}
                    className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 cursor-pointer ${
                      index === currentTrack ? 'bg-gray-800 text-green-500' : ''
                    }`}
                    onClick={() => setCurrentTrack(index)}
                  >
                    <div className="w-12 h-12 bg-gray-600 rounded flex items-center justify-center">
                      {index === currentTrack && isPlaying ? '⏸️' : '▶️'}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{track.title}</div>
                      <div className="text-gray-400 text-sm">{track.artist}</div>
                    </div>
                    <div className="text-gray-400 text-sm">{track.duration}</div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'search' && (
            <div>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                  placeholder="What do you want to listen to?"
                />
              </div>
              <h2 className="text-2xl font-bold mb-4">Browse all</h2>
              <div className="grid grid-cols-3 gap-4">
                {['Anime', 'Lofi', 'Study', 'Chill', 'Japanese', 'Instrumental'].map((genre) => (
                  <div key={genre} className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-6 hover:scale-105 transition-transform cursor-pointer">
                    <h3 className="text-xl font-bold">{genre}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'library' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Your Library</h2>
              <div className="space-y-4">
                {playlists.map((playlist) => (
                  <div key={playlist.id} className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer">
                    <div className="w-16 h-16 bg-gray-600 rounded flex items-center justify-center text-2xl">
                      🎵
                    </div>
                    <div>
                      <h3 className="font-semibold">{playlist.name}</h3>
                      <p className="text-gray-400">Playlist • {playlist.tracks} songs</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Player */}
      <div className="bg-gray-900 border-t border-gray-700 p-4">
        <div className="flex items-center justify-between">
          {/* Now Playing */}
          <div className="flex items-center gap-4 flex-1">
            <div className="w-14 h-14 bg-gray-600 rounded flex items-center justify-center">
              🎵
            </div>
            <div>
              <div className="font-medium">{currentTrackData?.title}</div>
              <div className="text-gray-400 text-sm">{currentTrackData?.artist}</div>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Heart className="w-4 h-4" />
            </Button>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsShuffle(!isShuffle)}
                className={isShuffle ? 'text-green-500' : 'text-gray-400'}
              >
                <Shuffle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handlePrevious} className="text-white">
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button
                size="sm"
                onClick={togglePlayPause}
                className="w-8 h-8 rounded-full bg-white text-black hover:bg-gray-200"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleNext} className="text-white">
                <SkipForward className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRepeat(!isRepeat)}
                className={isRepeat ? 'text-green-500' : 'text-gray-400'}
              >
                <Repeat className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 w-96">
              <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
                className="flex-1"
              />
              <span className="text-xs text-gray-400">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <Slider
              value={volume}
              max={100}
              step={1}
              onValueChange={setVolume}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotifyApp;