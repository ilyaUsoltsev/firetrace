import { useEffect, useRef, useState } from 'react';
import '@rrweb/replay/dist/style.css';
import rrwebPlayer from 'rrweb-player';
import 'rrweb-player/dist/style.css';

const formatTime = (ms: number) => {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
};

const Replay = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const replayerRef = useRef<rrwebPlayer | null>(null);
  const [message, setMessage] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const getEvents = async () => {
      const res = await fetch('http://localhost:3000/api/replays');
      const data = await res.json();
      const events = data[0]?.events;
      setMessage(data[0]?.message);
      setDate(new Date(data[0]?.created_at).toLocaleString());

      if (!containerRef.current) {
        console.error('No replay container');
        return;
      }

      if (!Array.isArray(events) || events.length === 0) {
        console.error('No rrweb events found', events);
        return;
      }

      if (cancelled) return;

      containerRef.current.innerHTML = '';

      replayerRef.current = new rrwebPlayer({
        target: containerRef.current,
        props: { events, showController: false },
      });

      const replayer = replayerRef.current.getReplayer();
      const meta = replayer.getMetaData();
      setTotalTime(meta.totalTime);

      replayer.on('event-cast', (event: unknown) => {
        setCurrentTime((event as { timestamp: number }).timestamp - meta.startTime);
      });
      replayer.on('start', () => setIsPlaying(true));
      replayer.on('pause', () => setIsPlaying(false));
      replayer.on('finish', () => {
        setIsPlaying(false);
        setCurrentTime(meta.totalTime);
      });
    };

    getEvents().catch((err) => {
      console.error('Failed to load replay', err);
    });

    return () => {
      cancelled = true;
      replayerRef.current = null;
    };
  }, []);

  const handlePlayPause = () => {
    if (!replayerRef.current) return;
    if (isPlaying) {
      replayerRef.current.pause();
    } else {
      replayerRef.current.play();
    }
  };

  const handleStop = () => {
    if (!replayerRef.current) return;
    replayerRef.current.pause();
    replayerRef.current.goto(0, false);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    replayerRef.current?.goto(time, isPlaying);
  };

  const remaining = Math.max(0, totalTime - currentTime);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '16px' }}>
      <h1>Replay</h1>
      <p>{message}</p>
      <p style={{ color: '#888', fontSize: '0.85em', margin: '0 0 12px' }}>{date}</p>

      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '600px',
          overflow: 'hidden',
          borderRadius: '8px 8px 0 0',
        }}
      />

      {/* Player controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: '#1c1c2e',
        padding: '10px 14px',
        borderRadius: '0 0 8px 8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}>
        {/* Play / Pause */}
        <button onClick={handlePlayPause} style={btnStyle} title={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? '⏸' : '▶'}
        </button>

        {/* Stop */}
        <button onClick={handleStop} style={btnStyle} title="Stop">
          ⏹
        </button>

        {/* Progress bar */}
        <input
          type="range"
          min={0}
          max={totalTime || 1}
          value={currentTime}
          onChange={handleSeek}
          style={{ flex: 1, cursor: 'pointer', accentColor: '#4f9cf9', height: '4px' }}
        />

        {/* Time */}
        <span style={{ color: '#ccc', fontSize: '0.82em', whiteSpace: 'nowrap', minWidth: '110px', textAlign: 'right' }}>
          {formatTime(currentTime)} / {formatTime(totalTime)}
          <span style={{ color: '#666', marginLeft: '6px' }}>
            -{formatTime(remaining)}
          </span>
        </span>
      </div>
    </div>
  );
};

const btnStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: '#fff',
  fontSize: '1.1em',
  cursor: 'pointer',
  padding: '4px 6px',
  borderRadius: '4px',
  lineHeight: 1,
  flexShrink: 0,
};

export default Replay;
