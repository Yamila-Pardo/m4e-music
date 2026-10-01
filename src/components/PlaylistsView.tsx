import React from 'react';
import { Music, Play } from 'lucide-react';
import { INITIAL_PLAYLISTS } from '../data/mockMusic';
import { usePlayer } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';
import { Playlist } from '../types';

export const PlaylistsView: React.FC = () => {
  const { allSongs, playSong } = usePlayer();
  const { isDark } = useTheme();

  const handlePlayPlaylist = (playlist: Playlist) => {
    const firstSongId = playlist.songIds[0];
    const match = allSongs.find(s => s.id === firstSongId);
    if (match) {
      playSong(match);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Music className="w-5 h-5 text-purple-400" />
        <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Curated Soundscapes & Playlists
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {INITIAL_PLAYLISTS.map((pl) => (
          <div
            key={pl.id}
            onClick={() => handlePlayPlaylist(pl)}
            className={`group p-4 rounded-3xl border transition-all cursor-pointer ${
              isDark 
                ? 'bg-[#121214] border-[#1E1E24] hover:border-purple-500/40 hover:bg-[#16161A]' 
                : 'bg-white border-gray-200 hover:shadow-md'
            }`}
          >
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/50 shadow-md">
              <img src={pl.coverUrl} alt={pl.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <div className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-semibold">
                {pl.songCount} Tracks
              </div>
            </div>

            <div className="mt-3.5 px-1">
              <h3 className="font-bold text-base text-white group-hover:text-purple-400 transition-colors">
                {pl.title}
              </h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                {pl.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
