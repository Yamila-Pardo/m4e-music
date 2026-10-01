import React from 'react';
import { EmojiReactionType, ReactionCounts } from '../types';
import { usePlayer } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';
import { formatCount } from '../utils/youtube';

interface EmojiReactionsProps {
  songId: string;
  reactions: ReactionCounts;
  size?: 'sm' | 'md';
}

const EMOJI_CONFIG: { type: EmojiReactionType; emoji: string; label: string }[] = [
  { type: 'heart', emoji: '❤️', label: 'Love' },
  { type: 'fire', emoji: '🔥', label: 'Fire' },
  { type: 'hands', emoji: '🙌', label: 'Praise' },
  { type: 'tear', emoji: '🥹', label: 'Emotional' },
  { type: 'note', emoji: '🎵', label: 'Vibe' },
];

export const EmojiReactions: React.FC<EmojiReactionsProps> = ({ 
  songId, 
  reactions,
  size = 'md'
}) => {
  const { toggleReaction, userReactions } = usePlayer();
  const { isDark } = useTheme();

  const songUserReactions = userReactions[songId] || {};

  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
      {EMOJI_CONFIG.map(({ type, emoji, label }) => {
        const count = reactions[type] || 0;
        const isActive = !!songUserReactions[type];

        return (
          <button
            key={type}
            onClick={(e) => {
              e.stopPropagation();
              toggleReaction(songId, type);
            }}
            title={label}
            className={`flex items-center gap-1.5 rounded-full transition-all cursor-pointer font-medium active:scale-95 ${
              size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs sm:text-sm'
            } ${
              isActive
                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/60 shadow-sm shadow-purple-500/20'
                : isDark
                  ? 'bg-[#18181C] hover:bg-[#222228] text-gray-300 border border-[#26262E]'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
            }`}
          >
            <span className="text-sm select-none">{emoji}</span>
            <span className="font-semibold text-[11px] sm:text-xs">
              {formatCount(count)}
            </span>
          </button>
        );
      })}
    </div>
  );
};
