import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const MusicPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([50]);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const tracks = [
    {
      id: 1,
      title: "Ugoku, Ugoku",
      artist: "chito & yuuri",
      album: "Girls' Last Tour OST",
      duration: "1:30",
      src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3"
    },
    {
      id: 2, 
      title: "Lofi Hip Hop",
      artist: "Chill Beats",
      album: "Study Music",
      duration: "3:45",
      src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/TRG_Banks/Oura/TRG_Banks_-_11_-_Never_Sleep.mp3"
    },
    {
      id: 3,
      title: "Relaxing Piano", 
      artist: "Peaceful Melodies",
      album: "Calm Sounds",
      duration: "4:12",
      src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_04_-_Upbeat_Party.mp3"
    },
    {
      id: 4,
      title: "Ambient Nature",
      artist: "Forest Sounds",
      album: "Natural Music", 
      duration: "5:23",
      src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3"
    },
    {
      id: 5,
      title: "Electronic Dreams",
      artist: "Synth Wave",
      album: "Digital Nights",
      duration: "3:56",
      src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Broke_For_Free/Directionless_EP/Broke_For_Free_-_04_-_As_Colorful_As_Ever.mp3"
    }
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
    <div className="h-full bg-background text-foreground flex flex-col">
      <audio 
        ref={audioRef} 
        src={currentTrackData?.src}
        loop={isRepeat}
        autoPlay={false}
      />
      
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold">SparkTunes</h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Now Playing */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-64 h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-6 flex items-center justify-center">
            <div className="text-6xl opacity-50">♪</div>
          </div>
          
          <h3 className="text-2xl font-bold mb-2">{currentTrackData?.title}</h3>
          <p className="text-lg text-muted-foreground mb-6">{currentTrackData?.artist}</p>
          
          {/* Progress Bar */}
          <div className="w-full max-w-md mb-4">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsShuffle(!isShuffle)}
              className={isShuffle ? 'text-primary' : ''}
            >
              <Shuffle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handlePrevious}>
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button
              size="lg"
              onClick={togglePlayPause}
              className="w-12 h-12 rounded-full"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleNext}>
              <SkipForward className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRepeat(!isRepeat)}
              className={isRepeat ? 'text-primary' : ''}
            >
              <Repeat className="w-4 h-4" />
            </Button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3 w-full max-w-48">
            <Volume2 className="w-4 h-4" />
            <Slider
              value={volume}
              max={100}
              step={1}
              onValueChange={setVolume}
              className="flex-1"
            />
          </div>
        </div>

        {/* Playlist */}
        <div className="w-80 border-l border-border overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Playlist</h3>
            <div className="space-y-2">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    index === currentTrack 
                      ? 'bg-primary/20 border border-primary/50' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setCurrentTrack(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{track.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className="text-sm text-muted-foreground">{track.duration}</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Heart className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;