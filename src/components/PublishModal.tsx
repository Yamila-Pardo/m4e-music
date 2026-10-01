import React, { useState } from 'react';
import { X, Youtube, Music, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { extractYouTubeId, fetchYouTubeMeta } from '../utils/youtube';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({ isOpen, onClose }) => {
  const { publishSong, playSong } = usePlayer();
  const { user, login } = useAuth();
  const { isDark } = useTheme();

  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('Electronic');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [detectedId, setDetectedId] = useState<string | null>(null);
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleUrlChange = async (newUrl: string) => {
    setUrl(newUrl);
    setError(null);
    const ytId = extractYouTubeId(newUrl);
    if (ytId) {
      setDetectedId(ytId);
      setIsLoadingMeta(true);
      try {
        const meta = await fetchYouTubeMeta(ytId);
        setTitle(meta.title);
        setArtist(meta.artist);
        setThumbnailUrl(meta.thumbnailUrl);
      } catch (e) {
        console.warn("Meta fetch failed:", e);
      } finally {
        setIsLoadingMeta(false);
      }
    } else {
      setDetectedId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detectedId) {
      setError('Por favor ingresa un enlace válido de YouTube.');
      return;
    }
    if (!title.trim() || !artist.trim()) {
      setError('Por favor indica el título y el artista de la canción.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newSong = await publishSong({
        youtubeId: detectedId,
        title: title.trim(),
        artist: artist.trim(),
        genre,
        category: 'Music',
        thumbnailUrl: thumbnailUrl || `https://img.youtube.com/vi/${detectedId}/hqdefault.jpg`,
        duration: '3:30',
        publishedAt: 'Recién publicado',
        authorId: user?.uid,
        authorName: user?.displayName || 'Usuario M4E',
        authorPhoto: user?.photoURL || undefined
      });

      setSuccess(true);
      playSong(newSong, true);

      setTimeout(() => {
        setSuccess(false);
        onClose();
        setUrl('');
        setTitle('');
        setArtist('');
        setDetectedId(null);
      }, 1400);

    } catch (err: any) {
      setError(err?.message || 'Error al publicar la canción.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border transition-all ${
        isDark 
          ? 'bg-[#121214] border-[#222228] text-white shadow-black/80' 
          : 'bg-white border-gray-200 text-gray-900 shadow-xl'
      }`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800/40 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/30">
            <Youtube className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight">Publicar Video Musical</h3>
            <p className="text-xs text-gray-400">Comparte tu música favorita de YouTube en M4E</p>
          </div>
        </div>

        {/* Success Banner */}
        {success && (
          <div className="mb-4 p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="text-sm font-semibold">¡Publicado con éxito! Reproduciendo ahora...</span>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* YouTube URL input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Enlace de YouTube (Video o Audio)
            </label>
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
                className={`w-full px-4 py-3 rounded-2xl text-sm outline-none border transition-all ${
                  isDark 
                    ? 'bg-[#18181C] border-[#282830] text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-purple-500 focus:bg-white'
                }`}
                required
              />
              {isLoadingMeta && (
                <div className="absolute right-3.5 top-3.5 text-purple-400 animate-spin">
                  <Loader2 className="w-4 h-4" />
                </div>
              )}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Exclusivo para la categoría de música y videoclips oficiales.
            </p>
          </div>

          {/* Preview Card if detected */}
          {detectedId && (
            <div className={`p-3 rounded-2xl border flex items-center gap-3.5 ${
              isDark ? 'bg-[#18181C] border-[#2A2A34]' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="w-20 aspect-video rounded-xl overflow-hidden bg-black/40 shrink-0">
                <img
                  src={thumbnailUrl || `https://img.youtube.com/vi/${detectedId}/hqdefault.jpg`}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">
                  Video Detectado
                </span>
                <p className="text-xs font-bold truncate text-white">{title || 'Cargando título...'}</p>
                <p className="text-[11px] text-gray-400 truncate">{artist || 'Artista'}</p>
              </div>
            </div>
          )}

          {/* Title & Artist fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Título de la canción
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nombre del tema"
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border transition-all ${
                  isDark ? 'bg-[#18181C] border-[#282830] text-white' : 'bg-gray-50 border-gray-300'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Artista / Grupo
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Nombre del artista"
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border transition-all ${
                  isDark ? 'bg-[#18181C] border-[#282830] text-white' : 'bg-gray-50 border-gray-300'
                }`}
                required
              />
            </div>
          </div>

          {/* Genre & Category tag */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Género
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border transition-all cursor-pointer ${
                  isDark ? 'bg-[#18181C] border-[#282830] text-white' : 'bg-gray-50 border-gray-300'
                }`}
              >
                <option value="Synthwave">Synthwave</option>
                <option value="Electronic">Electronic</option>
                <option value="Ambient">Ambient / Chill</option>
                <option value="Neo-Soul">Neo-Soul / R&B</option>
                <option value="Cyberpunk">Cyberpunk</option>
                <option value="Pop">Pop</option>
                <option value="Rock / Indie">Rock / Indie</option>
                <option value="Latin">Latin Music</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Categoría M4E
              </label>
              <div className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold border flex items-center gap-1.5 ${
                isDark ? 'bg-[#18181C] border-[#282830] text-purple-400' : 'bg-gray-50 border-gray-200 text-purple-600'
              }`}>
                <Music className="w-4 h-4" />
                <span>Music Only</span>
              </div>
            </div>
          </div>

          {/* Auth status note */}
          {!user && (
            <div className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
              isDark ? 'bg-[#16161A] border-[#24242C] text-gray-400' : 'bg-purple-50/50 border-purple-100 text-gray-600'
            }`}>
              <span>¿Quieres que aparezca tu perfil de autor?</span>
              <button
                type="button"
                onClick={() => login()}
                className="text-purple-400 font-semibold hover:underline cursor-pointer"
              >
                Inicia con Google
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !detectedId}
              className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publicando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Publicar en Feed
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
