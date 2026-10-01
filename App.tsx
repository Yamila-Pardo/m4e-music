import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { TrendingFeed } from './components/TrendingFeed';
import { NewReleases } from './components/NewReleases';
import { PlayerBar } from './components/PlayerBar';
import { PublishModal } from './components/PublishModal';
import { VideoModal } from './components/VideoModal';
import { FollowingView } from './components/FollowingView';
import { ArtistsView } from './components/ArtistsView';
import { PlaylistsView } from './components/PlaylistsView';
import { LibraryView } from './components/LibraryView';
import { MobileHeroFeed } from './components/MobileHeroFeed';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Artist } from './types';

function MainAppContent() {
  const { isDark } = useTheme();
  const { allSongs, playSong } = usePlayer();
  const [activeTab, setActiveTab] = useState<NavTab>('for-you');
  const [mobileSegment, setMobileSegment] = useState<'for-you' | 'following'>('for-you');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist);
    setActiveTab('artists');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark ? 'bg-[#0A0A0A] text-white' : 'bg-[#F8F9FA] text-gray-900'
    }`}>
      
      {/* Header with Search, Theme toggle, Google login */}
      <Header
        onOpenPublish={() => setIsPublishOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Body with Sidebar + Dynamic Center Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-28 md:pb-24">
        
        {/* Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedArtist(null);
          }}
          onSelectArtist={handleSelectArtist}
        />

        {/* Scrollable Center Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-5xl">
          
          {/* Active Search Banner if user typed search query */}
          {searchQuery && (
            <div className={`mb-6 p-4 rounded-3xl border flex items-center justify-between ${
              isDark ? 'bg-[#141416] border-[#222228]' : 'bg-purple-50 border-purple-200'
            }`}>
              <div className="text-sm">
                <span className="text-gray-400">Resultados de música en YouTube para: </span>
                <span className="font-bold text-purple-400">"{searchQuery}"</span>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-gray-400 hover:text-white underline cursor-pointer"
              >
                Limpiar búsqueda
              </button>
            </div>
          )}

          {/* Conditional View Rendering based on activeTab */}
          {activeTab === 'for-you' && (
            <div className="space-y-8">
              
              {/* Mobile Hero View (matches the mobile screenshot mockup on phones) */}
              <div className="block md:hidden">
                <MobileHeroFeed
                  onOpenVideo={() => {}}
                  activeSegment={mobileSegment}
                  setActiveSegment={(seg) => {
                    setMobileSegment(seg);
                    if (seg === 'following') {
                      setActiveTab('following');
                    }
                  }}
                />
              </div>

              {/* Trending Music Videos Feed */}
              <TrendingFeed songs={allSongs} searchQuery={searchQuery} />

              {/* New Releases Section with square cover artwork */}
              <NewReleases />
            </div>
          )}

          {activeTab === 'following' && (
            <FollowingView
              songs={allSongs}
              onOpenArtists={() => setActiveTab('artists')}
            />
          )}

          {activeTab === 'artists' && (
            <ArtistsView />
          )}

          {activeTab === 'playlists' && (
            <PlaylistsView />
          )}

          {activeTab === 'library' && (
            <LibraryView onOpenPublish={() => setIsPublishOpen(true)} />
          )}

        </main>
      </div>

      {/* Fixed Bottom Player Bar with Audio Waveform */}
      <PlayerBar />

      {/* Mobile Bottom Navigation Bar (phones only) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPublish={() => setIsPublishOpen(true)}
      />

      {/* Modals */}
      <PublishModal
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
      />

      <VideoModal />

      {/* Hidden container for YouTube IFrame Player API background audio playback */}
      <div
        id="sonus-hidden-yt-iframe"
        style={{
          position: 'fixed',
          width: '1px',
          height: '1px',
          left: '-9999px',
          top: '-9999px',
          opacity: 0.001,
          pointerEvents: 'none'
        }}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PlayerProvider>
          <MainAppContent />
        </PlayerProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
