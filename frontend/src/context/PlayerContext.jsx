import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [queue, setQueue]           = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying]   = useState(false);
  const [progress, setProgress]     = useState(0);
  const [duration, setDuration]     = useState(0);
  const [volume, setVolume]         = useState(0.8);
  const audioRef = useRef(new Audio());

  const currentTrack = queue[currentIndex] || null;

  // Sync audio src when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!currentTrack) return;
    audio.src = currentTrack.uri;
    audio.volume = volume;
    if (isPlaying) audio.play().catch(() => {});
  }, [currentIndex, queue]);

  useEffect(() => {
    const audio = audioRef.current;
    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onDuration   = () => setDuration(audio.duration);
    const onEnded      = () => next();
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onDuration);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentIndex, queue]);

  const play = useCallback((tracks, index = 0) => {
    setQueue(tracks);
    setCurrentIndex(index);
    setIsPlaying(true);
    const audio = audioRef.current;
    audio.src = tracks[index].uri;
    audio.volume = volume;
    audio.play().catch(() => {});
  }, [volume]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { audio.play().catch(() => {}); setIsPlaying(true); }
  }, [isPlaying]);

  const next = useCallback(() => {
    setCurrentIndex((i) => {
      const n = (i + 1) % (queue.length || 1);
      const audio = audioRef.current;
      audio.src = queue[n]?.uri || '';
      if (isPlaying) audio.play().catch(() => {});
      return n;
    });
  }, [queue, isPlaying]);

  const prev = useCallback(() => {
    setCurrentIndex((i) => {
      const n = (i - 1 + queue.length) % (queue.length || 1);
      const audio = audioRef.current;
      audio.src = queue[n]?.uri || '';
      if (isPlaying) audio.play().catch(() => {});
      return n;
    });
  }, [queue, isPlaying]);

  const seek = useCallback((time) => {
    audioRef.current.currentTime = time;
    setProgress(time);
  }, []);

  const changeVolume = useCallback((v) => {
    audioRef.current.volume = v;
    setVolume(v);
  }, []);

  return (
    <PlayerContext.Provider value={{
      currentTrack, isPlaying, progress, duration, volume,
      queue, currentIndex,
      play, togglePlay, next, prev, seek, changeVolume,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
