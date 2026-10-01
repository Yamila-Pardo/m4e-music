import React from 'react';
import { Play, Pause, Sparkles, Tv, Users } from 'lucide-react';
import { Song } from '../types';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { EmojiReactions } from './EmojiReactions';

interface MobileHeroFeedProps {
  onOpenVideo: () => void;
  activeSegment: 'for-you' | 'following';
  setActiveSegment: (seg: 'for-you' | 'following') => void;
}

export const MobileHeroFeed: React.FC<MobileHeroFeedProps> = ({
  onOpenVideo,
  activeSegment,
  setActiveSegment
}) => {
  const { currentSong, isPlaying, togglePlay, allSongs, playSong } = usePlayer();
  const { user, followingArtistIds } = useAuth();
  const { isDark } = useTheme();

  const trendingVideo = allSongs[1] || allSongs[0];

  return (
    <div className="md:hidden space-y-5 pb-2">
      
      {/* Profile Pill matching mobile mockup:
          "Your Profile • Following 48 • Followers 1.2K" */}
      <div className={`p-2.5 rounded-full border flex items-center justify-between gap-3 ${
        isDark ? 'bg-[#141416] border-[#222228]' : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-purple-500/40">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                M4E
              </div>
            )}
          </div>
          <p className="text-xs font-semibold truncate text-white">
            <span>{user?.displayName || 'Your Profile'}</span>
            <span className="text-gray-400 font-normal"> • Following {followingArtistIds.length} • Followers 1.2K</span>
          </p>
        </div>
      </div>

      {/* Segmented Control: [ For You ]  [ Following ] */}
      <div className={`p-1 rounded-2xl flex border ${
        isDark ? 'bg-[#141416] border-[#222228]' : 'bg-gray-100 border-gray-200'
      }`}>
        <button
          onClick={() => setActiveSegment('for-you')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSegment === 'for-you'
              ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          For You
        </button>
        <button
          onClick={() => setActiveSegment('following')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSegment === 'following'
              ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Following
        </button>
      </div>

      {activeSegment === 'for-you' && currentSong && (
        <>
          {/* "Now Playing" Section matching mobile mockup */}
          <div className="space-y-3">
            <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Now Playing
            </h3>

            <div 
              onClick={() => onOpenVideo()}
              className={`p-3.5 rounded-3xl border transition-all cursor-pointer ${
                isDark ? 'bg-[#121214] border-[#1E1E24]' : 'bg-white border-gray-200 shadow-sm'
              }`}
            >
              {/* Large Image with silhouette */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/60 shadow-lg">
                <img
                  src={currentSong.thumbnailUrl}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Floating overlay indicators */}
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold border border-white/10">
                  1
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-4">
                  <div className="flex items-center gap-1.5 text-purple-400 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                    <span>Streaming HQ</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg active:scale-95"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>
                </div>
              </div>

              {/* Title & Artist */}
              <div className="mt-3 px-1">
                <h4 className="text-base font-bold text-white tracking-tight truncate">
                  {currentSong.title} • {currentSong.artist}
                </h4>
              </div>

              {/* Emoji Reactions row underneath */}
              <div className="mt-3 px-1">
                <EmojiReactions songId={currentSong.id} reactions={currentSong.reactions} size="sm" />
              </div>
            </div>
          </div>

          {/* "Trending Video" Section matching mobile mockup */}
          {trendingVideo && (
            <div className="space-y-3 pt-2">
              <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Trending Video
              </h3>

              <div 
                onClick={() => playSong(trendingVideo, true)}
                className={`p-3.5 rounded-3xl border transition-all cursor-pointer ${
                  isDark ? 'bg-[#121214] border-[#1E1E24]' : 'bg-white border-gray-200 shadow-sm'
                }`}
              >
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg">
                  <img
                    src={trendingVideo.thumbnailUrl}
                    alt={trendingVideo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-xl">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="mt-3 px-1">
                  <h4 className="text-sm font-bold text-white truncate">
                    {trendingVideo.artist} • {trendingVideo.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {trendingVideo.duration} • {trendingVideo.views || '112K views'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};
