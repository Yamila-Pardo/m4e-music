import React from 'react';
import { Users, Sparkles, Plus } from 'lucide-react';
import { Song, Artist } from '../types';
import { SongCard } from './SongCard';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { INITIAL_ARTISTS } from '../data/mockMusic';

interface FollowingViewProps {
  songs: Song[];
  onOpenArtists: () => void;
}

export const FollowingView: React.FC<FollowingViewProps> = ({ songs, onOpenArtists }) => {
  const { followingArtistIds, user } = useAuth();
  const { isDark } = useTheme();

  // Filter songs whose artist matches followed artist
  const followedSongs = songs.filter(s => {
    if (s.artistId && followingArtistIds.includes(s.artistId)) return true;
    const match = INITIAL_ARTISTS.find(a => a.name.toLowerCase() === s.artist.toLowerCase());
    return match ? followingArtistIds.includes(match.id) : false;
  });

  return (
    <div className="space-y-6">
      
      {/* Profile summary pill like mobile screenshot */}
      <div className={`p-4 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        isDark ? 'bg-[#121214] border-[#1E1E24]' : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/40 p-0.5 shrink-0">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                M4E
              </div>
            )}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {user?.displayName || 'Your Profile'}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Following <span className="text-purple-400 font-semibold">{followingArtistIds.length}</span> Artists • Community Member
            </p>
          </div>
        </div>

        <button
          onClick={onOpenArtists}
          className="self-start sm:self-auto px-4 py-2 rounded-full text-xs font-semibold border border-purple-500/30 text-purple-300 hover:bg-purple-600/20 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Discover More Artists</span>
        </button>
      </div>

      {/* Followed Releases Feed */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Music from Artists You Follow
          </h2>
        </div>

        {followedSongs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {followedSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        ) : (
          <div className={`p-12 text-center rounded-3xl border ${
            isDark ? 'bg-[#121214] border-[#1C1C20] text-gray-400' : 'bg-white border-gray-200'
          }`}>
            <p className="font-semibold text-base">Aún no sigues a ningún artista con lanzamientos.</p>
            <p className="text-xs text-gray-500 mt-1">Explora la sección de Artistas en la barra lateral para seguir a tus favoritos.</p>
          </div>
        )}
      </div>

    </div>
  );
};
