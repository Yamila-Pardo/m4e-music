import React from 'react';
import { Disc3, Play } from 'lucide-react';
import { AlbumRelease } from '../types';
import { INITIAL_ALBUMS } from '../data/mockMusic';
import { usePlayer } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';

export const NewReleases: React.FC = () => {
  const { allSongs, playSong } = usePlayer();
  const { isDark } = useTheme();

  const handlePlayAlbum = (album: AlbumRelease) => {
    // Find matching song or play album lead track
    const match = allSongs.find(s => s.artistId === album.artistId || s.artist.toLowerCase() === album.artist.toLowerCase());
    if (match) {
      playSong(match);
    } else {
      playSong({
        id: `album-track-${album.id}`,
        youtubeId: album.youtubeId,
        title: album.title,
        artist: album.artist,
        thumbnailUrl: album.coverUrl,
        duration: 'Album Lead',
        category: 'Music',
        reactions: { heart: 120, fire: 85, hands: 30, tear: 5, note: 40 }
      });
    }
  };

  return (
    <section className="space-y-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Disc3 className="w-5 h-5 text-purple-400 animate-spin-slow" />
          <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            New Releases
          </h2>
        </div>
        <span className="text-xs font-semibold text-gray-500">
          Curated Albums & EPs
        </span>
      </div>

      {/* Grid of Square Album Covers */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
        {INITIAL_ALBUMS.map((album) => (
          <div
            key={album.id}
            onClick={() => handlePlayAlbum(album)}
            className={`group flex flex-col p-3 rounded-3xl transition-all duration-200 cursor-pointer border ${
              isDark 
                ? 'bg-[#121214] border-[#1E1E24] hover:border-purple-500/40 hover:bg-[#16161A]' 
                : 'bg-white border-gray-200 hover:border-purple-400 hover:shadow-md'
            }`}
          >
            {/* Square Album Cover with Smooth Hover Effect */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-lg bg-black/50">
              <img
                src={album.coverUrl}
                alt={album.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                loading="lazy"
              />
              
              {/* Play Badge Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <div className="w-11 h-11 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-xl shadow-purple-950/60 transform group-hover:scale-110 active:scale-95 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Year badge */}
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold border border-white/10">
                {album.year}
              </div>
            </div>

            {/* Info */}
            <div className="mt-3 px-1">
              <h4 className={`text-sm font-bold truncate tracking-tight ${
                isDark ? 'text-gray-100 group-hover:text-white' : 'text-gray-900 group-hover:text-purple-700'
              }`}>
                {album.title}
              </h4>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {album.artist}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
