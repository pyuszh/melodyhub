import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAlbums } from '../api/index.js';

function hue(str = '') { return (str.charCodeAt(0) || 200) * 37 % 360; }

const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
);

export default function AlbumsPage() {
  const navigate = useNavigate();
  const [albums, setAlbums]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    getAllAlbums()
      .then((res) => setAlbums(res.data.albums || []))
      .catch(() => setError('Failed to load albums.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Albums</h1>
        <p className="page-subtitle">Browse artist collections and curated albums.</p>
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
        </div>
      )}
      {error && <div className="error-msg">{error}</div>}

      {!loading && !error && albums.length === 0 && (
        <div className="empty-state">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
          </svg>
          <p>No albums yet. Artists can create them in the Studio.</p>
        </div>
      )}

      {!loading && !error && albums.length > 0 && (
        <div className="grid-2">
          {albums.map((album) => {
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
                    style={{
                      background: `linear-gradient(135deg, hsl(${h},55%,28%) 0%, hsl(${(h+60)%360},45%,16%) 100%)`,
                    }}
                  >
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  </div>
                  <button className="card-play-btn" onClick={(e) => { e.stopPropagation(); navigate(`/albums/${album._id}`); }}>
                    <PlayIcon />
                  </button>
                </div>
                <div className="card-title">{album.title}</div>
                <div className="card-meta">{album.artist?.username || 'Unknown Artist'}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
