import React from 'react';
import { X, ExternalLink, Music2, Maximize2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';
import { EmojiReactions } from './EmojiReactions';

export const VideoModal: React.FC = () => {
  const { currentSong, isVideoModalOpen, setVideoModalOpen } = usePlayer();
  const { isDark } = useTheme();

  if (!isVideoModalOpen || !currentSong) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className={`relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border transition-all ${
        isDark ? 'bg-[#101012] border-[#222228] text-white shadow-black' : 'bg-white border-gray-200 text-gray-900'
      }`}>
        
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold tracking-wider uppercase text-purple-400">
              M4E Video Cinema
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://www.youtube.com/watch?v=${currentSong.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Abrir en YouTube"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={() => setVideoModalOpen(false)}
              className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 16:9 Responsive Video Embed */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${currentSong.youtubeId}?autoplay=1&enablejsapi=1&rel=0`}
            title={currentSong.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video Details & Reactions underneath */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight">
              {currentSong.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
              {currentSong.artist} • Category: Music
            </p>
          </div>

          {/* Emoji Reactions */}
          <EmojiReactions songId={currentSong.id} reactions={currentSong.reactions} size="md" />
        </div>

      </div>
    </div>
  );
};
