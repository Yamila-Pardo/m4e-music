import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Search, 
  Plus, 
  LogIn, 
  LogOut, 
  Music2, 
  X,
  Sparkles,
  Check
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { extractYouTubeId, fetchYouTubeMeta } from '../utils/youtube';

interface HeaderProps {
  onOpenPublish: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenPublish, 
  searchQuery, 
  setSearchQuery 
}) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, login, logout } = useAuth();
  const { playSong } = usePlayer();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchingUrl, setIsSearchingUrl] = useState(false);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check if user entered a direct YouTube URL
    const ytId = extractYouTubeId(searchQuery);
    if (ytId) {
      setIsSearchingUrl(true);
      try {
        const meta = await fetchYouTubeMeta(ytId);
        playSong({
          id: `search-${ytId}`,
          youtubeId: ytId,
          title: meta.title,
          artist: meta.artist,
          thumbnailUrl: meta.thumbnailUrl,
          duration: 'Playing Now',
          category: 'Music',
          reactions: { heart: 1, fire: 1, hands: 0, tear: 0, note: 1 }
        });
        setSearchQuery('');
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearchingUrl(false);
      }
    }
  };

  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-md transition-colors duration-200 border-b ${
      isDark 
        ? 'bg-[#0A0A0A]/90 border-[#1B1B1F] text-white' 
        : 'bg-[#FFFFFF]/90 border-gray-200 text-gray-900 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Brand Logo - M4E minimalist white text with tagline */}
        <div className="flex items-center gap-3 cursor-pointer group select-none">
          {/* Minimalist Soundwave Icon matching reference image */}
          <div className="flex items-center gap-0.5 h-6 text-white shrink-0">
            <span className="w-0.5 h-2 bg-white/70 rounded-full" />
            <span className="w-0.5 h-3.5 bg-white/90 rounded-full" />
            <span className="w-0.5 h-5 bg-white rounded-full" />
            <span className="w-0.5 h-3 bg-white/90 rounded-full" />
            <span className="w-0.5 h-4.5 bg-white rounded-full" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-widest text-white leading-none">
              M4E
            </span>
            <span className="text-[9.5px] tracking-normal font-normal text-gray-400 mt-0.5 leading-none">
              Music for Everyone
            </span>
          </div>
        </div>

        {/* YouTube Music Exclusive Search Bar */}
        <div className="flex-1 max-w-xl mx-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar música, videos o pegar link de YouTube..."
              className={`w-full pl-10 pr-24 py-2 sm:py-2.5 text-xs sm:text-sm rounded-full transition-all outline-none border ${
                isDark 
                  ? 'bg-[#141416] border-[#24242A] text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30' 
                  : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:bg-white'
              }`}
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-14 pr-2 flex items-center text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
            <div className="absolute inset-y-0 right-2 flex items-center">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Music2 className="w-2.5 h-2.5" />
                Music
              </span>
            </div>
          </form>
        </div>

        {/* Right Actions: Publish, Theme Toggle, User Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Publish Link Button */}
          <button
            onClick={onOpenPublish}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-900/20 active:scale-95 transition-all cursor-pointer"
            title="Publicar video musical de YouTube"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Publish</span>
          </button>

          {/* Theme Toggle (Sol / Luna) with preference persistence */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`p-2 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
              isDark 
                ? 'bg-[#18181B] border-[#2A2A30] text-amber-300 hover:bg-[#222226]' 
                : 'bg-gray-100 border-gray-300 text-indigo-700 hover:bg-gray-200'
            }`}
            title={isDark ? "Cambiar a modo Claro" : "Cambiar a modo Oscuro"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-700" />
            )}
          </button>

          {/* Google Login / Firebase User Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full border border-purple-500/40 hover:border-purple-400 transition-all cursor-pointer"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-xs font-bold text-white">
                    {user.displayName?.[0] || 'U'}
                  </div>
                )}
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div 
                  className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl py-2 border z-50 animate-in fade-in zoom-in-95 duration-100 ${
                    isDark 
                      ? 'bg-[#141416] border-[#26262C] text-white' 
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}
                >
                  <div className="px-4 py-2 border-b border-gray-800/40">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-semibold truncate">{user.displayName || 'User'}</p>
                    <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm text-left flex items-center gap-2 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => login()}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-medium border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Google Login</span>
              <span className="sm:hidden">Login</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
