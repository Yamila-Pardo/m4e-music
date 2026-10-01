export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Common YouTube regex pattern
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|music\.youtube\.com\/watch\?v=)([^"&?\/\s]{11})/;
  const match = trimmed.match(regExp);
  return match && match[1] ? match[1] : null;
}

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function formatCount(count: number): string {
  if (!count && count !== 0) return '0';
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return count.toString();
}

export interface FetchedVideoMeta {
  title: string;
  artist: string;
  thumbnailUrl: string;
  youtubeId: string;
}

export async function fetchYouTubeMeta(youtubeId: string): Promise<FetchedVideoMeta> {
  const watchUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
  const defaultThumb = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  
  try {
    // Try noembed service which works well with CORS
    const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(watchUrl)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.title) {
        let title = data.title;
        let artist = data.author_name || 'Various Artists';
        
        // Often youtube titles are "Artist - Song Title (Official Music Video)"
        if (title.includes(' - ')) {
          const parts = title.split(' - ');
          artist = parts[0].trim();
          title = parts.slice(1).join(' - ').replace(/\(Official.*?\)/gi, '').replace(/\[Official.*?\]/gi, '').trim();
        } else if (title.includes(' – ')) {
          const parts = title.split(' – ');
          artist = parts[0].trim();
          title = parts.slice(1).join(' – ').replace(/\(Official.*?\)/gi, '').replace(/\[Official.*?\]/gi, '').trim();
        }

        return {
          title: title || data.title,
          artist: artist || 'M4E Artist',
          thumbnailUrl: data.thumbnail_url || defaultThumb,
          youtubeId
        };
      }
    }
  } catch (err) {
    console.warn("Could not fetch oEmbed:", err);
  }

  return {
    title: 'Music Video Track',
    artist: 'YouTube Creator',
    thumbnailUrl: defaultThumb,
    youtubeId
  };
}
