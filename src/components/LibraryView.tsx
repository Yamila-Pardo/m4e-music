import React from 'react';
import { Layers, Heart, Sparkles, Upload } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SongCard } from './SongCard';

interface LibraryViewProps {
  onOpenPublish: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onOpenPublish }) => {
  const { allSongs, userReactions } = usePlayer();
  const { user } = useAuth();
  const { isDark } = useTheme();

  // Liked songs
  const likedSongs = allSongs.filter(s => !!userReactions[s.id]?.heart);
  // Published by current user
  const myPublished = allSongs.filter(s => s.authorId && s.authorId === user?.uid);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-400" />
          <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Your Library
          </h2>
        </div>
        <button
          onClick={onOpenPublish}
          className="px-4 py-2 rounded-full text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Publish Song</span>
        </button>
      </div>

      {/* Liked Songs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-500 fill-current" />
          <h3 className="text-lg font-bold text-white">Liked Tracks</h3>
          <span className="text-xs text-gray-500 font-semibold">({likedSongs.length})</span>
        </div>

        {likedSongs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {likedSongs.map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        ) : (
          <div className={`p-8 rounded-3xl border text-center ${
            isDark ? 'bg-[#121214] border-[#1C1C20] text-gray-400' : 'bg-white border-gray-200'
          }`}>
            <Heart className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="font-semibold text-sm">No has marcado canciones con ❤️ todavía.</p>
            <p className="text-xs text-gray-500 mt-1">Explora la música en "For You" y reacciona con un corazón.</p>
          </div>
        )}
      </div>

      {/* Published Songs */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="text-lg font-bold text-white">Your Published Tracks</h3>
          <span className="text-xs text-gray-500 font-semibold">({myPublished.length})</span>
        </div>

        {myPublished.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {myPublished.map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        ) : (
          <div className={`p-8 rounded-3xl border text-center ${
            isDark ? 'bg-[#121214] border-[#1C1C20] text-gray-400' : 'bg-white border-gray-200'
          }`}>
            <p className="font-semibold text-sm">No has publicado ningún video musical todavía.</p>
            <p className="text-xs text-gray-500 mt-1">Comparte un video o canción de YouTube usando el botón Publish.</p>
          </div>
        )}
      </div>
    </div>
  );
};
