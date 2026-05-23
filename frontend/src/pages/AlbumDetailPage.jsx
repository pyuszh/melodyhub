import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAlbumById } from '../api/index.js';
import { usePlayer } from '../context/PlayerContext.jsx';

function hue(str = '') { return (str.charCodeAt(0) || 200) * 37 % 360; }

const PlayIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);
const PauseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
  </svg>
);

export default function AlbumDetailPage() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { play, currentTrack, isPlaying, togglePlay, queue } = usePlayer();

  const [album, setAlbum]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    setLoading(true);
    getAlbumById(albumId)
      .then((res) => setAlbum(res.data.album))
      .catch(() => setError('Failed to load album.'))
      .finally(() => setLoading(false));
  }, [albumId]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <span className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
    </div>
  );

  if (error) return <div className="error-msg">{error}</div>;
  if (!album) return null;

  const musics = album.musics || [];
  const h = hue(album.title);

  const handlePlayAll = () => {
    if (musics.length) play(musics, 0);
  };

  const handleTrackClick = (idx) => {
    const sameQueue = JSON.stringify(queue?.map(t => t._id)) === JSON.stringify(musics.map(t => t._id));
    if (sameQueue && currentTrack?._id === musics[idx]?._id) togglePlay();
    else play(musics, idx);
  };

  return (
    <div>
      <button className="back-btn" onClick={() => navigate('/albums')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back to Albums
      </button>

      {/* Hero */}
      <div className="album-hero">
        <div
          className="album-hero-art"
          style={{ background: `linear-gradient(135deg, hsl(${h},55%,30%) 0%, hsl(${(h+60)%360},45%,18%) 100%)` }}
        >
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
        <div className="album-hero-info">
          <div className="album-hero-label">Album</div>
          <div className="album-hero-title">{album.title}</div>
          <div className="album-hero-artist">
            by {album.artist?.username || 'Unknown Artist'} · {musics.length} track{musics.length !== 1 ? 's' : ''}
          </div>
          <button className="play-all-btn" onClick={handlePlayAll} disabled={musics.length === 0}>
            <PlayIcon /> Play Album
          </button>
        </div>
      </div>

      {/* Track list */}
      {musics.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
          </svg>
          <p>No tracks in this album yet.</p>
        </div>
      ) : (
        <div className="track-list">
          {/* header row */}
          <div style={{
            display: 'grid', gridTemplateColumns: '36px 1fr auto',
            gap: 12, padding: '4px 12px 12px',
            borderBottom: '1px solid var(--border)', marginBottom: 8,
            fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600,
            letterSpacing: '0.8px', textTransform: 'uppercase'
          }}>
            <span style={{ textAlign: 'center' }}>#</span>
            <span>Title</span>
            <span>—</span>
          </div>

          {musics.map((track, idx) => {
            const isActive = currentTrack?._id === track._id;
            return (
              <div
                key={track._id}
                className={`track-row${isActive ? ' active' : ''}`}
                onClick={() => handleTrackClick(idx)}
              >
                <div className="track-num">
                  {isActive && isPlaying ? <PauseIcon /> : <PlayIcon size={14} />}
                </div>
                <div className="track-info">
                  <div className="track-title">{track.title}</div>
                  <div className="track-artist">
                    {track.artist?.username || album.artist?.username || 'Unknown'}
                  </div>
                </div>
                <div className="track-duration">—</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
