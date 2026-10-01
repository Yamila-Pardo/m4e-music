import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Volume2, 
  VolumeX, 
  Heart, 
  Tv, 
  MoreHorizontal,
  Maximize2
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';
import { formatTime } from '../utils/youtube';

interface PlayerBarProps {
  onExpandPlayer?: () => void;
}

export const PlayerBar: React.FC<PlayerBarProps> = ({ onExpandPlayer }) => {
  const { 
    currentSong, 
    isPlaying, 
    currentTime, 
    duration, 
    volume, 
    isMuted, 
    isShuffle, 
    isLooping, 
    togglePlay, 
    seek, 
    setVolume, 
    toggleMute, 
    toggleShuffle, 
    toggleLoop, 
    nextSong, 
    prevSong,
    toggleReaction,
    userReactions,
    setVideoModalOpen
  } = usePlayer();

  const { isDark } = useTheme();
  const [isHoveringWave, setIsHoveringWave] = useState(false);

  if (!currentSong) return null;

  const isLiked = !!(userReactions[currentSong.id]?.heart);
  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seek(val);
  };

  // Generate 48 stylized audio waveform bars
  const waveformHeights = [
    20, 35, 45, 25, 60, 80, 50, 70, 90, 65, 40, 30,
    55, 75, 95, 60, 45, 85, 100, 70, 50, 30, 45, 65,
    70, 85, 60, 40, 50, 75, 90, 60, 45, 80, 55, 35,
    60, 75, 50, 30, 65, 85, 70, 45, 60, 40, 25, 30
  ];

  return (
    <footer className={`fixed bottom-0 left-0 right-0 z-40 px-4 py-2.5 sm:py-3.5 backdrop-blur-xl border-t transition-colors duration-200 select-none ${
      isDark 
        ? 'bg-[#0A0A0A]/95 border-[#1B1B20] text-white shadow-2xl shadow-black' 
        : 'bg-white/95 border-gray-200 text-gray-900 shadow-xl'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Left: Song Info & Mini Artwork */}
        <div className="flex items-center gap-3 w-1/4 min-w-[140px] sm:min-w-[200px]">
          <div 
            onClick={() => setVideoModalOpen(true)}
            className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 group cursor-pointer border border-purple-500/30 shadow-md"
            title="Ver video musical en pantalla grande"
          >
            <img
              src={currentSong.thumbnailUrl}
              alt={currentSong.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Tv className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="truncate min-w-0">
            <h4 className="text-xs sm:text-sm font-bold truncate tracking-tight text-white hover:text-purple-400 transition-colors">
              {currentSong.title}
            </h4>
            <p className="text-[11px] sm:text-xs text-gray-400 truncate flex items-center gap-1.5 mt-0.5">
              <span>{currentSong.artist}</span>
              <span className="w-1 h-1 rounded-full bg-purple-500 shrink-0" />
              <span className="text-purple-400 font-medium">Now Playing</span>
            </p>
          </div>
        </div>

        {/* Center: Controls + Audio Waveform Progress Bar */}
        <div className="flex-1 max-w-2xl flex flex-col items-center gap-1.5 sm:gap-2">
          
          {/* Controls Buttons */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              className={`p-1.5 rounded-full transition-colors cursor-pointer hidden sm:block ${
                isShuffle ? 'text-purple-400' : 'text-gray-400 hover:text-white'
              }`}
              title="Aleatorio"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Prev */}
            <button
              onClick={prevSong}
              className="p-1.5 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer active:scale-90"
              title="Anterior"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </button>

            {/* Play / Pause Circular Purple Button */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-900/40 active:scale-95 transition-all cursor-pointer"
              title={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={nextSong}
              className="p-1.5 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer active:scale-90"
              title="Siguiente"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </button>

            {/* Repeat */}
            <button
              onClick={toggleLoop}
              className={`p-1.5 rounded-full transition-colors cursor-pointer hidden sm:block ${
                isLooping ? 'text-purple-400' : 'text-gray-400 hover:text-white'
              }`}
              title="Repetir canción"
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Progress & Waveform Bar */}
          <div className="w-full flex items-center gap-3">
            <span className="text-[11px] font-medium text-gray-400 tabular-nums min-w-[32px] text-right">
              {formatTime(currentTime)}
            </span>

            {/* Interactive Audio Waveform / Scrubber Bar */}
            <div 
              className="relative flex-1 h-5 flex items-center cursor-pointer group"
              onMouseEnter={() => setIsHoveringWave(true)}
              onMouseLeave={() => setIsHoveringWave(false)}
            >
              {/* Audio Waveform visualization matching the screenshot */}
              <div className="absolute inset-0 flex items-center justify-between gap-[2px] opacity-70 group-hover:opacity-100 transition-opacity">
                {waveformHeights.map((h, i) => {
                  const barPercent = (i / waveformHeights.length) * 100;
                  const isPassed = barPercent <= progressPercent;
                  return (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className={`w-[2.5px] rounded-full transition-all duration-150 ${
                        isPassed
                          ? 'bg-purple-500 shadow-sm shadow-purple-500/50'
                          : isDark
                            ? 'bg-gray-700/60'
                            : 'bg-gray-300'
                      } ${isPlaying && isPassed ? 'animate-pulse' : ''}`}
                    />
                  );
                })}
              </div>

              {/* Scrubber Input Slider over waveform */}
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeekChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>

            <span className="text-[11px] font-medium text-gray-400 tabular-nums min-w-[32px]">
              {formatTime(duration)}
            </span>
          </div>

        </div>

        {/* Right: Actions, Volume & Video Toggle */}
        <div className="flex items-center justify-end gap-2 sm:gap-4 w-1/4 min-w-[120px]">
          
          {/* Watch Video Mode Button */}
          <button
            onClick={() => setVideoModalOpen(true)}
            className="p-2 rounded-full text-purple-400 hover:text-purple-300 hover:bg-purple-950/40 transition-colors cursor-pointer"
            title="Abrir reproductor de video"
          >
            <Tv className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Volume Control (Desktop) */}
          <div className="hidden md:flex items-center gap-2 group">
            <button
              onClick={toggleMute}
              className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? "Activar sonido" : "Silenciar"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-18 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400"
            />
          </div>

          {/* Heart Like Reaction */}
          <button
            onClick={() => toggleReaction(currentSong.id, 'heart')}
            className={`p-2 rounded-full transition-all cursor-pointer active:scale-90 ${
              isLiked
                ? 'text-red-500 bg-red-500/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title="Me gusta"
          >
            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          {/* Mobile expand full player */}
          {onExpandPlayer && (
            <button
              onClick={onExpandPlayer}
              className="sm:hidden p-1.5 text-gray-400 hover:text-white"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}

        </div>

      </div>
    </footer>
  );
};
