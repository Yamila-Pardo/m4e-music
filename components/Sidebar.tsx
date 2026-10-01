import React from 'react';
import { 
  Home, 
  Users, 
  Mic2, 
  Music, 
  Layers, 
  CheckCircle2, 
  Plus, 
  Check 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { INITIAL_ARTISTS } from '../data/mockMusic';
import { Artist } from '../types';

export type NavTab = 'for-you' | 'following' | 'artists' | 'playlists' | 'library';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onSelectArtist?: (artist: Artist) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  onSelectArtist 
}) => {
  const { isDark } = useTheme();
  const { isFollowing, toggleFollowArtist, followingArtistIds } = useAuth();

  const navItems = [
    { id: 'for-you' as NavTab, label: 'For You', icon: Home },
    { id: 'following' as NavTab, label: 'Following', icon: Users },
    { id: 'artists' as NavTab, label: 'Artists', icon: Mic2 },
    { id: 'playlists' as NavTab, label: 'Playlists', icon: Music },
    { id: 'library' as NavTab, label: 'Library', icon: Layers },
  ];

  return (
    <aside className={`w-64 shrink-0 hidden md:flex flex-col justify-between py-6 px-4 border-r transition-colors duration-200 select-none ${
      isDark ? 'bg-[#0A0A0A] border-[#18181C]' : 'bg-white border-gray-200'
    }`}>
      <div className="space-y-8">
        
        {/* Main Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-sm shadow-purple-900/10'
                    : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-[#141416]'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Following Artists Section - Matching Mockup */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between px-2">
            <h3 className={`text-xs font-bold tracking-wider uppercase ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Following Artists
            </h3>
            <span className="text-[11px] font-semibold text-purple-400">
              {followingArtistIds.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {INITIAL_ARTISTS.map((artist) => {
              const following = isFollowing(artist.id);
              return (
                <div
                  key={artist.id}
                  onClick={() => onSelectArtist?.(artist)}
                  className={`group flex items-center justify-between p-2 rounded-2xl transition-all cursor-pointer ${
                    isDark 
                      ? 'hover:bg-[#141416]' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-purple-500/20">
                      <img
                        src={artist.avatar}
                        alt={artist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-semibold truncate ${
                          isDark ? 'text-gray-200 group-hover:text-white' : 'text-gray-800'
                        }`}>
                          {artist.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate">
                        {artist.followers} followers
                      </p>
                    </div>
                  </div>

                  {/* Following Checkmark badge or Follow button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollowArtist(artist);
                    }}
                    title={following ? "Dejar de seguir" : "Seguir artista"}
                    className={`p-1.5 rounded-full transition-all cursor-pointer ${
                      following
                        ? 'text-purple-400 bg-purple-500/10 hover:bg-purple-500/20'
                        : 'text-gray-500 hover:text-white hover:bg-purple-600/30'
                    }`}
                  >
                    {following ? (
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    ) : (
                      <Plus className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* M4E Applet Info Footnote */}
      <div className={`p-3 rounded-2xl border text-xs ${
        isDark ? 'bg-[#121214] border-[#1C1C20] text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'
      }`}>
        <p className="font-semibold text-purple-400 mb-0.5">M4E Music Engine</p>
        <p className="text-[11px] text-gray-500">Pure music streaming powered by YouTube & Firebase</p>
      </div>

    </aside>
  );
};
