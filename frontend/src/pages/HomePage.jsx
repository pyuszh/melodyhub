import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllMusics, getAllAlbums } from '../api/index.js';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function hue(str = '') { return (str.charCodeAt(0) || 200) * 37 % 360; }

const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
);

export default function HomePage() {
  const { user } = useAuth();
  const { play, currentTrack, isPlaying, togglePlay, currentIndex, queue } = usePlayer();
  const navigate = useNavigate();

  const [musics, setMusics]   = useState([]);
  const [albums, setAlbums]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([getAllMusics(), getAllAlbums()])
      .then(([mRes, aRes]) => {
        setMusics(mRes.data.musics || []);
        setAlbums(aRes.data.albums || []);
      })
      .catch(() => setError('Failed to load content. Is your backend running?'))
      .finally(() => setLoading(false));
  }, []);

  const handlePlayAll = () => {
    if (musics.length) play(musics, 0);
  };

  const handleTrackClick = (idx) => {
    const isSameQueue = queue === musics;
    if (isSameQueue && currentIndex === idx) togglePlay();
    else play(musics, idx);
  };

  return (
    <div>
      {/* Hero banner */}
      <div className="home-hero">
        <div className="home-hero-label">✦ Good to see you, {user?.username}</div>
        <h1 className="home-hero-title">
          What are we<br />listening to today?
        </h1>
        <p className="home-hero-sub">
          {musics.length} tracks ready to play. Hit shuffle or pick a vibe.
        </p>
        <button className="play-all-btn" onClick={handlePlayAll}>
          <PlayIcon /> Play All Tracks
        </button>
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
        </div>
      )}

      {error && <div className="error-msg">{error}</div>}

      {!loading && !error && (
        <>
          {/* Albums row */}
          {albums.length > 0 && (
            <section style={{ marginBottom: 40 }}>
              <div className="section-head">
                <span className="section-title">Albums</span>
                <span className="section-action" onClick={() => navigate('/albums')}>
                  See all →
                </span>
              </div>
              <div className="grid-2">
                {albums.slice(0, 6).map((album) => {
                  const h = hue(album.title);
                  return (
                    <div
                      key={album._id}
                      className="card"
                      onClick={() => navigate(`/albums/${album._id}`)}
                    >
                      <div className="card-art">
                        <div
                          className="card-art-gradient"
                          style={{ background: `linear-gradient(135deg, hsl(${h},55%,28%) 0%, hsl(${(h+60)%360},45%,16%) 100%)` }}
                        >
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                          </svg>
                        </div>
                        <button className="card-play-btn">
                          <PlayIcon />
                        </button>
                      </div>
                      <div className="card-title">{album.title}</div>
                      <div className="card-meta">{album.artist?.username || 'Unknown'}</div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Tracks list */}
          <section>
            <div className="section-head">
              <span className="section-title">All Tracks</span>
              <span className="tag">{musics.length} songs</span>
            </div>

            {musics.length === 0 ? (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                </svg>
                <p>No tracks uploaded yet.</p>
              </div>
            ) : (
              <div className="track-list">
                {musics.map((track, idx) => {
                  const isActive = currentTrack?._id === track._id;
                  return (
                    <div
                      key={track._id}
                      className={`track-row${isActive ? ' active' : ''}`}
                      onClick={() => handleTrackClick(idx)}
                    >
                      <div className="track-num">
                        <span style={{ display: isActive ? 'none' : 'block' }}>{idx + 1}</span>
                        <svg className="play-icon-small" style={{ display: isActive ? 'block' : '' }} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          {isActive && isPlaying
                            ? <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>
                            : <polygon points="5 3 19 12 5 21 5 3"/>
                          }
                        </svg>
                      </div>
                      <div className="track-info">
                        <div className="track-title">{track.title}</div>
                        <div className="track-artist">{track.artist?.username || 'Unknown Artist'}</div>
                      </div>
                      <div className="track-duration">
                        {/* Duration only available after loading */}
                        ∞
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
