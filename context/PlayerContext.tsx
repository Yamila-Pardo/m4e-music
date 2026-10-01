import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Song, EmojiReactionType, ReactionCounts } from '../types';
import { INITIAL_SONGS } from '../data/mockMusic';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc, 
  increment 
} from 'firebase/firestore';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  isLooping: boolean;
  isVideoModalOpen: boolean;
  allSongs: Song[];
  userReactions: Record<string, Record<EmojiReactionType, boolean>>;
  setVideoModalOpen: (open: boolean) => void;
  playSong: (song: Song, autoPlay?: boolean) => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleLoop: () => void;
  nextSong: () => void;
  prevSong: () => void;
  toggleReaction: (songId: string, emoji: EmojiReactionType) => Promise<void>;
  publishSong: (newSong: Omit<Song, 'id' | 'reactions'>) => Promise<Song>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allSongs, setAllSongs] = useState<Song[]>(INITIAL_SONGS);
  const [currentSong, setCurrentSong] = useState<Song | null>(INITIAL_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(84); // 1:24 initial matching mockup
  const [duration, setDuration] = useState(222); // 3:42 initial matching mockup
  const [volume, setVolumeState] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isVideoModalOpen, setVideoModalOpen] = useState(false);
  const [userReactions, setUserReactions] = useState<Record<string, Record<EmojiReactionType, boolean>>>(() => {
    try {
      const stored = localStorage.getItem('sonus_reactions');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const ytPlayerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);
  const isApiReadyRef = useRef<boolean>(false);

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        isApiReadyRef.current = true;
        initYouTubePlayer();
      };
    } else if (window.YT && window.YT.Player) {
      isApiReadyRef.current = true;
      initYouTubePlayer();
    }
  }, []);

  const initYouTubePlayer = () => {
    const container = document.getElementById('sonus-hidden-yt-iframe');
    if (!container || ytPlayerRef.current) return;

    try {
      ytPlayerRef.current = new window.YT.Player('sonus-hidden-yt-iframe', {
        height: '100%',
        width: '100%',
        videoId: INITIAL_SONGS[0].youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          origin: window.location.origin
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(volume);
            const dur = event.target.getDuration();
            if (dur && dur > 0) setDuration(dur);
          },
          onStateChange: (event: any) => {
            // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
            if (event.data === 1) {
              setIsPlaying(true);
              startProgressTimer();
            } else if (event.data === 2) {
              setIsPlaying(false);
              stopProgressTimer();
            } else if (event.data === 0) {
              setIsPlaying(false);
              stopProgressTimer();
              if (isLooping) {
                ytPlayerRef.current?.seekTo(0);
                ytPlayerRef.current?.playVideo();
              } else {
                nextSong();
              }
            }
          }
        }
      });
    } catch (e) {
      console.warn("YouTube Player initialization:", e);
    }
  };

  const startProgressTimer = () => {
    stopProgressTimer();
    progressIntervalRef.current = setInterval(() => {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
        const curr = ytPlayerRef.current.getCurrentTime();
        const dur = ytPlayerRef.current.getDuration();
        if (typeof curr === 'number') setCurrentTime(curr);
        if (typeof dur === 'number' && dur > 0) setDuration(dur);
      } else {
        // Fallback simulation if iframe blocked or in preview sandbox
        setCurrentTime(prev => {
          if (prev >= duration) {
            nextSong();
            return 0;
          }
          return prev + 1;
        });
      }
    }, 1000);
  };

  const stopProgressTimer = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  // Sync published songs from Firestore
  useEffect(() => {
    const colRef = collection(db, 'songs');
    const unsub = onSnapshot(colRef, (snapshot) => {
      const firestoreSongs: Song[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        firestoreSongs.push({
          id: docSnap.id,
          youtubeId: data.youtubeId,
          title: data.title,
          artist: data.artist,
          thumbnailUrl: data.thumbnailUrl || `https://img.youtube.com/vi/${data.youtubeId}/hqdefault.jpg`,
          duration: data.duration || '3:30',
          category: 'Music',
          authorId: data.authorId,
          authorName: data.authorName,
          authorPhoto: data.authorPhoto,
          publishedAt: 'Recent',
          reactions: data.reactions || { heart: 0, fire: 0, hands: 0, tear: 0, note: 0 }
        });
      });

      if (firestoreSongs.length > 0) {
        // Merge with initial songs (avoiding duplicates)
        setAllSongs(prev => {
          const map = new Map<string, Song>();
          firestoreSongs.forEach(s => map.set(s.id, s));
          prev.forEach(s => {
            if (!map.has(s.id)) map.set(s.id, s);
          });
          return Array.from(map.values());
        });
      }
    }, (error) => {
      console.warn("Firestore songs listener notice:", error);
    });

    return () => unsub();
  }, []);

  const playSong = (song: Song, autoPlay: boolean = true) => {
    setCurrentSong(song);
    setCurrentTime(0);
    if (song.durationSeconds) {
      setDuration(song.durationSeconds);
    }

    if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
      try {
        if (autoPlay) {
          ytPlayerRef.current.loadVideoById(song.youtubeId);
          setIsPlaying(true);
          startProgressTimer();
        } else {
          ytPlayerRef.current.cueVideoById(song.youtubeId);
        }
      } catch (err) {
        console.warn("Could not play via YT player:", err);
        setIsPlaying(autoPlay);
        if (autoPlay) startProgressTimer();
      }
    } else {
      setIsPlaying(autoPlay);
      if (autoPlay) startProgressTimer();
    }
  };

  const togglePlay = () => {
    if (!currentSong) return;
    if (isPlaying) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
        try { ytPlayerRef.current.pauseVideo(); } catch (e) {}
      }
      setIsPlaying(false);
      stopProgressTimer();
    } else {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === 'function') {
        try { ytPlayerRef.current.playVideo(); } catch (e) {}
      }
      setIsPlaying(true);
      startProgressTimer();
    }
  };

  const seek = (seconds: number) => {
    setCurrentTime(seconds);
    if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
      try {
        ytPlayerRef.current.seekTo(seconds, true);
      } catch (e) {}
    }
  };

  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(100, val));
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) setIsMuted(false);
    if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === 'function') {
      try {
        ytPlayerRef.current.setVolume(clamped);
      } catch (e) {}
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (ytPlayerRef.current) {
      try {
        if (nextMuted) ytPlayerRef.current.mute();
        else ytPlayerRef.current.unMute();
      } catch (e) {}
    }
  };

  const toggleShuffle = () => setIsShuffle(prev => !prev);
  const toggleLoop = () => setIsLooping(prev => !prev);

  const nextSong = () => {
    if (!currentSong || allSongs.length === 0) return;
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * allSongs.length);
      playSong(allSongs[randomIndex]);
      return;
    }
    const currentIndex = allSongs.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % allSongs.length;
    playSong(allSongs[nextIndex]);
  };

  const prevSong = () => {
    if (!currentSong || allSongs.length === 0) return;
    if (currentTime > 4) {
      seek(0);
      return;
    }
    const currentIndex = allSongs.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + allSongs.length) % allSongs.length;
    playSong(allSongs[prevIndex]);
  };

  const toggleReaction = async (songId: string, emoji: EmojiReactionType) => {
    const currentReactionState = userReactions[songId]?.[emoji] || false;
    const nextReactionState = !currentReactionState;

    // Update local state immediately for snappy response
    const updatedUserReactions = {
      ...userReactions,
      [songId]: {
        ...(userReactions[songId] || {}),
        [emoji]: nextReactionState
      }
    };
    setUserReactions(updatedUserReactions);
    localStorage.setItem('sonus_reactions', JSON.stringify(updatedUserReactions));

    // Update song reaction counts in allSongs
    setAllSongs(prev => prev.map(s => {
      if (s.id !== songId) return s;
      const currentCount = s.reactions?.[emoji] || 0;
      const diff = nextReactionState ? 1 : -1;
      return {
        ...s,
        reactions: {
          ...s.reactions,
          [emoji]: Math.max(0, currentCount + diff)
        }
      };
    }));

    if (currentSong && currentSong.id === songId) {
      const currentCount = currentSong.reactions?.[emoji] || 0;
      const diff = nextReactionState ? 1 : -1;
      setCurrentSong({
        ...currentSong,
        reactions: {
          ...currentSong.reactions,
          [emoji]: Math.max(0, currentCount + diff)
        }
      });
    }

    // Persist to Firestore if user is authenticated and song exists in Firestore
    if (auth.currentUser) {
      try {
        const reactionRef = doc(db, 'songs', songId, 'reactions', auth.currentUser.uid);
        if (nextReactionState) {
          await setDoc(reactionRef, {
            songId,
            userId: auth.currentUser.uid,
            emoji,
            createdAt: new Date().toISOString()
          });
        }
      } catch (err) {
        console.warn("Firestore reaction write (safe bypass if demo song):", err);
      }
    }
  };

  const publishSong = async (newSongData: Omit<Song, 'id' | 'reactions'>): Promise<Song> => {
    const id = `pub-${Date.now()}`;
    const newSong: Song = {
      ...newSongData,
      id,
      category: 'Music',
      reactions: { heart: 1, fire: 1, hands: 0, tear: 0, note: 1 }
    };

    // Add to state immediately
    setAllSongs(prev => [newSong, ...prev]);

    // Persist to Firestore
    if (auth.currentUser) {
      try {
        const songDoc = doc(db, 'songs', id);
        await setDoc(songDoc, {
          youtubeId: newSong.youtubeId,
          title: newSong.title,
          artist: newSong.artist,
          thumbnailUrl: newSong.thumbnailUrl,
          duration: newSong.duration,
          category: 'Music',
          authorId: auth.currentUser.uid,
          authorName: auth.currentUser.displayName || 'M4E Creator',
          authorPhoto: auth.currentUser.photoURL || '',
          reactions: newSong.reactions,
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `songs/${id}`);
      }
    }

    return newSong;
  };

  return (
    <PlayerContext.Provider value={{
      currentSong,
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      isShuffle,
      isLooping,
      isVideoModalOpen,
      allSongs,
      userReactions,
      setVideoModalOpen,
      playSong,
      togglePlay,
      seek,
      setVolume,
      toggleMute,
      toggleShuffle,
      toggleLoop,
      nextSong,
      prevSong,
      toggleReaction,
      publishSong
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
