import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Song } from '../types';
import { usePlayer } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';
import { EmojiReactions } from './EmojiReactions';

interface SongCardProps {
  song: Song;
  onPlay?: (song: Song) => void;
  showCategoryBadge?: boolean;
}

export const SongCard: React.FC<SongCardProps> = ({ song, onPlay }) => {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
  const { isDark } = useTheme();

  const isCurrent = currentSong?.id === song.id;
  const isThisPlaying = isCurrent && isPlaying;

  const handleCardClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      if (onPlay) {
        onPlay(song);
      } else {
        playSong(song);
      }
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`group flex flex-col gap-3 p-3 rounded-3xl transition-all duration-200 cursor-pointer border ${
        isCurrent
          ? 'border-purple-500/50 shadow-lg shadow-purple-950/20 bg-purple-950/10'
          : isDark
            ? 'bg-[#121214] border-[#1E1E24] hover:border-purple-500/30 hover:bg-[#16161A]'
            : 'bg-white border-gray-200 hover:border-purple-400 hover:shadow-md'
      }`}
    >
      {/* 16:9 Video Thumbnail Container */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/40">
        <img
          src={song.thumbnailUrl}
          alt={song.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Dark gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Hover / Active Play Button Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
          isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          <div className="w-12 h-12 rounded-full bg-purple-600/90 hover:bg-purple-500 text-white flex items-center justify-center shadow-xl shadow-purple-950/50 backdrop-blur-sm transform transition-transform group-hover:scale-110 active:scale-95">
            {isThisPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </div>
        </div>

        {/* Duration Badge (Bottom-Right) */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1 border border-white/10">
          <Play className="w-2.5 h-2.5 fill-white" />
          <span>{song.duration}</span>
        </div>

        {/* Optional Community Badge */}
        {song.authorName && (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-purple-900/80 backdrop-blur-md text-purple-200 text-[10px] font-semibold border border-purple-500/20">
            By {song.authorName}
          </div>
        )}
      </div>

      {/* Meta: Title & Artist */}
      <div className="px-1">
        <h4 className={`text-base font-bold truncate tracking-tight transition-colors ${
          isCurrent 
            ? 'text-purple-400' 
            : isDark 
              ? 'text-gray-100 group-hover:text-white' 
              : 'text-gray-900 group-hover:text-purple-700'
        }`}>
          {song.artist} • {song.title}
        </h4>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-0.5">
          <span>{song.views || 'Official Music Video'}</span>
          {song.publishedAt && <span>{song.publishedAt}</span>}
        </div>
      </div>

      {/* Emoji Reactions Bar */}
      <div className="px-1 pt-1">
        <EmojiReactions songId={song.id} reactions={song.reactions} />
      </div>

    </div>
  );
};
