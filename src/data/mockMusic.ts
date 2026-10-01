import { Song, Artist, AlbumRelease, Playlist } from '../types';

export const INITIAL_ARTISTS: Artist[] = [
  {
    id: 'luna-quinn',
    name: 'Luna Quinn',
    handle: '@lunaquinn',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    followers: '12.4K',
    followersCount: 12400,
    verified: true,
    genre: 'Synthwave / Electronic',
    bio: 'Electronic producer crafting neon nocturnal atmospheres and cinematic synthesizers.',
    popularSongId: 'song-1'
  },
  {
    id: 'kairo',
    name: 'Kairo',
    handle: '@kairo_sounds',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    followers: '8.1K',
    followersCount: 8100,
    verified: true,
    genre: 'Indie Folk / Ambient',
    bio: 'Acoustic textures woven with deep ambient soundscapes recorded in misty northern forests.',
    popularSongId: 'song-2'
  },
  {
    id: 'noah-rivers',
    name: 'Noah Rivers',
    handle: '@noahrivers',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    followers: '5.9K',
    followersCount: 5900,
    verified: true,
    genre: 'Neo-Soul / R&B',
    bio: 'Soulful rhythms, warm amber guitars, and velvety vocal melodies.',
    popularSongId: 'song-3'
  },
  {
    id: 'vespera',
    name: 'Vespera',
    handle: '@vespera_live',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    followers: '18.2K',
    followersCount: 18200,
    verified: true,
    genre: 'Cyberpunk / Dark Synth',
    bio: 'Heavy analog basslines and futuristic dystopian club anthems.',
    popularSongId: 'song-4'
  },
  {
    id: 'orion-pulse',
    name: 'Orion Pulse',
    handle: '@orionpulse',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    followers: '9.4K',
    followersCount: 9400,
    verified: true,
    genre: 'Lo-Fi Chillhop',
    bio: 'Late night study beats, dusty vinyl crackle, and soothing Rhodes keys.',
    popularSongId: 'song-5'
  }
];

export const INITIAL_SONGS: Song[] = [
  {
    id: 'song-1',
    youtubeId: '4xDzrJKXOOY', // Synthwave / synth chill video
    title: 'Midnight Pulse',
    artist: 'Luna Quinn',
    artistId: 'luna-quinn',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    duration: '3:42',
    durationSeconds: 222,
    views: '112K views',
    publishedAt: '2 days ago',
    category: 'Music',
    genre: 'Synthwave',
    reactions: {
      heart: 1240,
      fire: 842,
      hands: 203,
      tear: 45,
      note: 96
    }
  },
  {
    id: 'song-2',
    youtubeId: 'jfKfPfyJRdk', // Lofi / chill music
    title: 'Echoes',
    artist: 'Kairo',
    artistId: 'kairo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    duration: '4:01',
    durationSeconds: 241,
    views: '89K views',
    publishedAt: '4 days ago',
    category: 'Music',
    genre: 'Ambient Indie',
    reactions: {
      heart: 934,
      fire: 2100,
      hands: 512,
      tear: 934,
      note: 120
    }
  },
  {
    id: 'song-3',
    youtubeId: '5qap5aO4i9A', // Lofi chill hip hop
    title: 'Golden Hour',
    artist: 'Noah Rivers',
    artistId: 'noah-rivers',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    duration: '3:18',
    durationSeconds: 198,
    views: '64K views',
    publishedAt: '1 week ago',
    category: 'Music',
    genre: 'Neo-Soul',
    reactions: {
      heart: 820,
      fire: 610,
      hands: 140,
      tear: 18,
      note: 85
    }
  },
  {
    id: 'song-4',
    youtubeId: 'fJ9rUzIMcZQ', // Queen - Bohemian Rhapsody / Classic iconic
    title: 'Neon Horizon',
    artist: 'Vespera',
    artistId: 'vespera',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    duration: '5:55',
    durationSeconds: 355,
    views: '1.4M views',
    publishedAt: '2 weeks ago',
    category: 'Music',
    genre: 'Cyberpunk',
    reactions: {
      heart: 3410,
      fire: 4200,
      hands: 1900,
      tear: 220,
      note: 480
    }
  },
  {
    id: 'song-5',
    youtubeId: 'kXYiU_JCYtU', // Numb / Linkin park or Linkin Park official video
    title: 'Starborn',
    artist: 'Kairo',
    artistId: 'kairo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    duration: '3:07',
    durationSeconds: 187,
    views: '320K views',
    publishedAt: '3 weeks ago',
    category: 'Music',
    genre: 'Electronic',
    reactions: {
      heart: 1540,
      fire: 1200,
      hands: 430,
      tear: 88,
      note: 215
    }
  },
  {
    id: 'song-6',
    youtubeId: 'kJQP7kiw5Fk', // Despacito / Latin music video
    title: 'Noche Eterna',
    artist: 'Luna Quinn',
    artistId: 'luna-quinn',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
    duration: '4:41',
    durationSeconds: 281,
    views: '950K views',
    publishedAt: '1 month ago',
    category: 'Music',
    genre: 'Synthwave Latin',
    reactions: {
      heart: 2890,
      fire: 3100,
      hands: 890,
      tear: 140,
      note: 340
    }
  }
];

export const INITIAL_ALBUMS: AlbumRelease[] = [
  {
    id: 'album-1',
    title: 'Nocturnal',
    artist: 'Luna Quinn',
    artistId: 'luna-quinn',
    coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&auto=format&fit=crop&q=80',
    year: '2026',
    tracksCount: 8,
    youtubeId: '4xDzrJKXOOY',
    genre: 'Dark Synth'
  },
  {
    id: 'album-2',
    title: 'Golden Hour',
    artist: 'Noah Rivers',
    artistId: 'noah-rivers',
    coverUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=80',
    year: '2026',
    tracksCount: 10,
    youtubeId: '5qap5aO4i9A',
    genre: 'Neo-Soul'
  },
  {
    id: 'album-3',
    title: 'Starborn',
    artist: 'Kairo',
    artistId: 'kairo',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    year: '2026',
    tracksCount: 12,
    youtubeId: 'kXYiU_JCYtU',
    genre: 'Atmospheric Folk'
  },
  {
    id: 'album-4',
    title: 'Neon Odyssey',
    artist: 'Vespera',
    artistId: 'vespera',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
    year: '2026',
    tracksCount: 9,
    youtubeId: 'fJ9rUzIMcZQ',
    genre: 'Cyberpunk'
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-1',
    title: 'Midnight Chillout',
    description: 'Deep, atmospheric beats for late-night drives and nocturnal dreaming.',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
    songCount: 18,
    songIds: ['song-1', 'song-2', 'song-3']
  },
  {
    id: 'pl-2',
    title: 'Cyberpunk Club 2026',
    description: 'High voltage synth and dark bass for cybernetic nights.',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
    songCount: 24,
    songIds: ['song-4', 'song-5']
  },
  {
    id: 'pl-3',
    title: 'Acoustic Soul Sessions',
    description: 'Raw strings, intimate vocals, and organic sound design.',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    songCount: 15,
    songIds: ['song-2', 'song-3']
  }
];
