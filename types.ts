export type EmojiReactionType = 'heart' | 'fire' | 'hands' | 'tear' | 'note';

export interface ReactionCounts {
  heart: number;
  fire: number;
  hands: number;
  tear: number;
  note: number;
}

export interface Song {
  id: string;
  youtubeId: string;
  title: string;
  artist: string;
  artistId?: string;
  thumbnailUrl: string;
  duration: string;
  durationSeconds?: number;
  views?: string;
  publishedAt?: string;
  category: 'Music';
  genre?: string;
  authorId?: string;
  authorName?: string;
  authorPhoto?: string;
  reactions: ReactionCounts;
  userReactions?: Record<EmojiReactionType, boolean>;
  isNewRelease?: boolean;
  album?: string;
}

export interface Artist {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  followers: string;
  followersCount: number;
  verified: boolean;
  genre: string;
  bio?: string;
  popularSongId?: string;
}

export interface AlbumRelease {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  coverUrl: string;
  year: string;
  tracksCount: number;
  youtubeId: string;
  genre: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  songCount: number;
  songIds: string[];
}
