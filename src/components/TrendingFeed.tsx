import React, { useState } from 'react';
import { Flame, TrendingUp, Sparkles, Filter } from 'lucide-react';
import { Song } from '../types';
import { SongCard } from './SongCard';
import { useTheme } from '../context/ThemeContext';

interface TrendingFeedProps {
  songs: Song[];
  searchQuery?: string;
}

export const TrendingFeed: React.FC<TrendingFeedProps> = ({ songs, searchQuery = '' }) => {
  const { isDark } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredSongs = songs.filter(song => {
    // If search active
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        song.title.toLowerCase().includes(q) ||
        song.artist.toLowerCase().includes(q) ||
        (song.genre && song.genre.toLowerCase().includes(q))
      );
    }
    // Filter tags
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'community') return !!song.authorId;
    return song.genre?.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  return (
    <section className="space-y-5">
      {/* Header with Title and "Trending • Today" badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Trending Music Videos
          </h2>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
          </span>
        </div>

        {/* Trending • Today Pill from Mockup */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
            isDark 
              ? 'bg-[#141416] border-[#222228] text-purple-300' 
              : 'bg-purple-50 border-purple-200 text-purple-700'
          }`}>
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            <span>Trending • Today</span>
          </div>
        </div>
      </div>

      {/* Genre Filter Tags */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'synthwave', 'ambient', 'neo-soul', 'cyberpunk', 'community'].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === filter
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                : isDark
                  ? 'bg-[#141416] text-gray-400 hover:text-white hover:bg-[#1A1A1E] border border-[#222228]'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            {filter === 'all' ? 'All Videos' : filter}
          </button>
        ))}
      </div>

      {/* Grid of Trending Music Video Cards */}
      {filteredSongs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {filteredSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      ) : (
        <div className={`p-12 text-center rounded-3xl border ${
          isDark ? 'bg-[#121214] border-[#1C1C20] text-gray-400' : 'bg-white border-gray-200 text-gray-500'
        }`}>
          <p className="text-base font-semibold">No se encontraron videos musicales con ese criterio.</p>
          <p className="text-xs text-gray-500 mt-1">Prueba con otro término de búsqueda o publica un enlace de YouTube.</p>
        </div>
      )}
    </section>
  );
};
