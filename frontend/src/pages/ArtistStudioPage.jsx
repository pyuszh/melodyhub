import { useState, useEffect, useRef } from 'react';
import { uploadMusic, createAlbum, getAllMusics } from '../api/index.js';

export default function ArtistStudioPage() {
  const [tab, setTab] = useState('upload');

  // Upload state
  const [file, setFile]         = useState(null);
  const [musicTitle, setMusicTitle] = useState('');
  const [uploading, setUploading]   = useState(false);
  const [uploadMsg, setUploadMsg]   = useState('');
  const [uploadErr, setUploadErr]   = useState('');
  const [dragover, setDragover]     = useState(false);
  const fileRef = useRef();

  // Create album state
  const [albumTitle, setAlbumTitle] = useState('');
  const [allMusics, setAllMusics]   = useState([]);
  const [selectedMusics, setSelectedMusics] = useState([]);
  const [creating, setCreating]     = useState(false);
  const [albumMsg, setAlbumMsg]     = useState('');
  const [albumErr, setAlbumErr]     = useState('');

  useEffect(() => {
    getAllMusics()
      .then((r) => setAllMusics(r.data.musics || []))
      .catch(() => {});
  }, [uploadMsg]); // refresh after upload

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragover(false);
    const f = e.dataTransfer?.files?.[0] || e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !musicTitle.trim()) return;
    setUploading(true); setUploadErr(''); setUploadMsg('');
    try {
      const fd = new FormData();
      fd.append('music', file);
      fd.append('title', musicTitle.trim());
      const res = await uploadMusic(fd);
      setUploadMsg(`"${res.data.music.title}" uploaded successfully!`);
      setFile(null); setMusicTitle('');
    } catch (err) {
      setUploadErr(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const toggleMusic = (id) => {
    setSelectedMusics((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!albumTitle.trim()) return;
    setCreating(true); setAlbumErr(''); setAlbumMsg('');
    try {
      const res = await createAlbum({ title: albumTitle.trim(), musics: selectedMusics });
      setAlbumMsg(`Album "${res.data.album.title}" created!`);
      setAlbumTitle(''); setSelectedMusics([]);
    } catch (err) {
      setAlbumErr(err.response?.data?.message || 'Failed to create album.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Artist Studio</h1>
        <p className="page-subtitle">Upload tracks and organise them into albums.</p>
      </div>

      <div className="tabs">
        <button className={`tab-btn${tab === 'upload' ? ' active' : ''}`} onClick={() => setTab('upload')}>
          Upload Track
        </button>
        <button className={`tab-btn${tab === 'album' ? ' active' : ''}`} onClick={() => setTab('album')}>
          Create Album
        </button>
      </div>

      {tab === 'upload' && (
        <div className="panel">
          <div className="panel-title">Upload a New Track</div>

          {uploadMsg && <div className="success-msg">{uploadMsg}</div>}
          {uploadErr && <div className="error-msg" style={{ marginBottom: 16 }}>{uploadErr}</div>}

          <form onSubmit={handleUpload}>
            {/* Drop zone */}
            <div
              className={`file-drop${dragover ? ' dragover' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
              onDragLeave={() => setDragover(false)}
              onDrop={handleFileDrop}
              onClick={() => fileRef.current.click()}
            >
              <div className="file-drop-icon">🎵</div>
              {file ? (
                <div className="file-drop-text">
                  <strong>{file.name}</strong>
                  <br />
                  <span style={{ fontSize: '0.78rem' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              ) : (
                <div className="file-drop-text">
                  <strong>Click or drag</strong> to select an audio file
                  <br />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>MP3, WAV, FLAC supported</span>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="audio/*"
              style={{ display: 'none' }}
              onChange={handleFileDrop}
            />

            <div className="form-group">
              <label>Track Title</label>
              <input
                type="text"
                placeholder="e.g. Summer Rain"
                value={musicTitle}
                onChange={(e) => setMusicTitle(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary" type="submit" disabled={uploading || !file}>
              {uploading ? (
                <><span className="spinner" /> Uploading…</>
              ) : 'Upload Track'}
            </button>
          </form>
        </div>
      )}

      {tab === 'album' && (
        <div className="panel">
          <div className="panel-title">Create a New Album</div>

          {albumMsg && <div className="success-msg">{albumMsg}</div>}
          {albumErr && <div className="error-msg" style={{ marginBottom: 16 }}>{albumErr}</div>}

          <form onSubmit={handleCreateAlbum}>
            <div className="form-group">
              <label>Album Title</label>
              <input
                type="text"
                placeholder="e.g. Debut EP"
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Add Tracks</label>
              {allMusics.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '12px 0' }}>
                  No tracks found. Upload some first.
                </div>
              ) : (
                <div className="music-selector">
                  {allMusics.map((m) => (
                    <label key={m._id} className="music-selector-item">
                      <input
                        type="checkbox"
                        checked={selectedMusics.includes(m._id)}
                        onChange={() => toggleMusic(m._id)}
                      />
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 500 }}>{m.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {m.artist?.username || 'You'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              {selectedMusics.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <span className="tag">{selectedMusics.length} track{selectedMusics.length !== 1 ? 's' : ''} selected</span>
                </div>
              )}
            </div>

            <button className="btn btn-primary" type="submit" disabled={creating || !albumTitle.trim()}>
              {creating ? <><span className="spinner" /> Creating…</> : 'Create Album'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
