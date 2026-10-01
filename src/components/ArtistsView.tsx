import React from 'react';
import { Mic2, CheckCircle2, UserPlus, UserCheck, Play } from 'lucide-react';
import { INITIAL_ARTISTS } from '../data/mockMusic';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';
import { Artist } from '../types';

export const ArtistsView: React.FC = () => {
  const { isFollowing, toggleFollowArtist } = useAuth();
  const { allSongs, playSong } = usePlayer();
  const { isDark } = useTheme();

  const handlePlayArtist = (artist: Artist) => {
    const song = allSongs.find(s => s.artistId === artist.id || s.artist.toLowerCase() === artist.name.toLowerCase());
    if (song) {
      playSong(song);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic2 className="w-5 h-5 text-purple-400" />
          <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Featured Artists
          </h2>
        </div>
        <span className="text-xs text-gray-500 font-semibold">
          {INITIAL_ARTISTS.length} Artists on M4E
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {INITIAL_ARTISTS.map((artist) => {
          const following = isFollowing(artist.id);
          return (
            <div
              key={artist.id}
              className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between ${
                isDark 
                  ? 'bg-[#121214] border-[#1E1E24] hover:border-purple-500/30' 
                  : 'bg-white border-gray-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-purple-500/20">
                  <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-base truncate text-white">{artist.name}</h3>
                    {artist.verified && (
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-purple-400 font-medium">{artist.genre}</p>
                  <p className="text-xs text-gray-400 mt-1">{artist.followers} followers</p>
                </div>
              </div>

              {artist.bio && (
                <p className="text-xs text-gray-400 mt-3 line-clamp-2 leading-relaxed">
                  {artist.bio}
                </p>
              )}

              <div className="flex items-center gap-2.5 mt-5 pt-3 border-t border-white/5">
                <button
                  onClick={() => toggleFollowArtist(artist)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    following
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-900/20'
                  }`}
                >
                  {following ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Follow</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handlePlayArtist(artist)}
                  className="p-2 rounded-xl bg-[#18181C] hover:bg-purple-600 hover:text-white text-gray-300 border border-[#24242C] transition-colors cursor-pointer"
                  title="Reproducir tema popular"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
