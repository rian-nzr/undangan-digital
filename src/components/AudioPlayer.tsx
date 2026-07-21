import React, { useEffect, useRef, useState } from "react";
import { Music, Play, Pause, Volume2, VolumeX } from "lucide-react";

interface AudioPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ isPlaying, setIsPlaying }) => {
  const audioUrl = "https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-200.mp3";
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    // Create audio element
    const audio = new Audio(audioUrl);
    audio.loop = true;
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Sync play/pause state
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.log("Autoplay prevented or failed, waiting for user click.", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, setIsPlaying]);

  // Sync volume & mute
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div
      id="floating-audio-widget"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-coffee-950/90 backdrop-blur-md px-3 py-2 rounded-full border border-coffee-400/30 text-coffee-100 shadow-2xl transition-all duration-300 hover:scale-105"
    >
      {/* Spinning Disc Button */}
      <button
        id="audio-disc-button"
        onClick={togglePlay}
        className={`w-10 h-10 rounded-full flex items-center justify-center bg-coffee-700 hover:bg-coffee-600 border border-coffee-400/50 transition-transform cursor-pointer relative ${
          isPlaying ? "animate-spin [animation-duration:8s]" : ""
        }`}
        title={isPlaying ? "Pause Musik" : "Play Musik"}
      >
        {isPlaying ? (
          <Music className="w-5 h-5 text-coffee-100" />
        ) : (
          <Play className="w-5 h-5 ml-0.5 text-coffee-100" />
        )}
        
        {/* Play/Pause overlay */}
        <span className="absolute -top-1 -right-1 bg-coffee-500 w-4 h-4 rounded-full flex items-center justify-center border border-coffee-900">
          {isPlaying ? (
            <Pause className="w-2.5 h-2.5 text-coffee-100" />
          ) : (
            <Play className="w-2.5 h-2.5 text-coffee-100" />
          )}
        </span>
      </button>

      {/* Vol controls toggler */}
      <div 
        className="flex items-center gap-1.5"
        onMouseEnter={() => setShowVolumeSlider(true)}
        onMouseLeave={() => setShowVolumeSlider(false)}
      >
        <button
          id="audio-mute-button"
          onClick={toggleMute}
          className="text-coffee-300 hover:text-coffee-100 p-1.5 transition-colors cursor-pointer"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>

        {/* Volume slider reveal on hover */}
        <div
          className={`overflow-hidden transition-all duration-300 flex items-center ${
            showVolumeSlider ? "w-16 opacity-100 mr-1" : "w-0 opacity-0 pointer-events-none"
          }`}
        >
          <input
            id="audio-volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-14 h-1 bg-coffee-800 rounded-lg appearance-none cursor-pointer accent-coffee-400"
          />
        </div>
      </div>
    </div>
  );
};
