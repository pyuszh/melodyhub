import { usePlayer } from '../context/PlayerContext.jsx';

const fmt = (s) => {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);
const PauseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
  </svg>
);
const PrevIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const NextIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const VolumeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
  </svg>
);

// Generate a deterministic gradient from a string
function trackGradient(title = '') {
  const hue = (title.charCodeAt(0) || 200) * 37 % 360;
  return `linear-gradient(135deg, hsl(${hue},60%,25%) 0%, hsl(${(hue+60)%360},50%,15%) 100%)`;
}

export default function PlayerBar() {
  const { currentTrack, isPlaying, progress, duration, volume,
          togglePlay, next, prev, seek, changeVolume } = usePlayer();

  const pct = duration ? (progress / duration) * 100 : 0;

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(ratio * duration);
  };

  return (
    <div className="player-bar">
      {/* Left: track info */}
      <div className="player-track-info">
        <div className="player-art" style={{ background: currentTrack ? trackGradient(currentTrack.title) : 'var(--bg-elevated)' }}>
          {!currentTrack && (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
          )}
        </div>
        {currentTrack ? (
          <div>
            <div className="player-track-name">{currentTrack.title}</div>
            <div className="player-artist-name">
              {currentTrack.artist?.username || 'Unknown Artist'}
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Nothing playing yet
          </div>
        )}
      </div>

      {/* Center: controls + progress */}
      <div className="player-controls">
        <div className="player-btns">
          <button className="ctrl-btn" onClick={prev} disabled={!currentTrack}>
            <PrevIcon />
          </button>
          <button className="ctrl-btn play-main" onClick={togglePlay} disabled={!currentTrack}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className="ctrl-btn" onClick={next} disabled={!currentTrack}>
            <NextIcon />
          </button>
        </div>

        <div className="progress-bar-wrap">
          <span className="progress-time">{fmt(progress)}</span>
          <div className="progress-bar" onClick={handleProgressClick}>
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-time right">{fmt(duration)}</span>
        </div>
      </div>

      {/* Right: volume */}
      <div className="volume-wrap">
        <VolumeIcon />
        <input
          type="range"
          className="volume-slider"
          min={0} max={1} step={0.02}
          value={volume}
          onChange={(e) => changeVolume(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
