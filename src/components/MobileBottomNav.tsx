import React from 'react';
import { Home, Users, Mic2, Music, Layers, Plus } from 'lucide-react';
import { NavTab } from './Sidebar';
import { useTheme } from '../context/ThemeContext';

interface MobileBottomNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenPublish: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenPublish
}) => {
  const { isDark } = useTheme();

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 px-2 py-1.5 backdrop-blur-xl border-t flex items-center justify-around ${
      isDark ? 'bg-[#0A0A0A]/95 border-[#1B1B20]' : 'bg-white/95 border-gray-200'
    }`}>
      <button
        onClick={() => setActiveTab('for-you')}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
          activeTab === 'for-you' ? 'text-purple-400' : 'text-gray-400'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-semibold">For You</span>
      </button>

      <button
        onClick={() => setActiveTab('following')}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
          activeTab === 'following' ? 'text-purple-400' : 'text-gray-400'
        }`}
      >
        <Users className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Following</span>
      </button>

      {/* Center Publish Button */}
      <button
        onClick={onOpenPublish}
        className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-900/40 -mt-3 border-2 border-[#0A0A0A] active:scale-95 transition-transform cursor-pointer"
        title="Publicar video musical"
      >
        <Plus className="w-5 h-5" />
      </button>

      <button
        onClick={() => setActiveTab('artists')}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
          activeTab === 'artists' ? 'text-purple-400' : 'text-gray-400'
        }`}
      >
        <Mic2 className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Artists</span>
      </button>

      <button
        onClick={() => setActiveTab('library')}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
          activeTab === 'library' ? 'text-purple-400' : 'text-gray-400'
        }`}
      >
        <Layers className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Library</span>
      </button>
    </nav>
  );
};
