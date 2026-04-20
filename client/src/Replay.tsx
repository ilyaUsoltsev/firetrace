import { useEffect, useRef, useState } from 'react';
import '@rrweb/replay/dist/style.css';
import rrwebPlayer from 'rrweb-player';
import 'rrweb-player/dist/style.css';

interface ReplayEntry {
  events: unknown[];
  message: string;
  stackTrace?: string;
  created_at: string;
}

const formatTime = (ms: number) => {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
};

// Isolated player — remounted via key when the selected replay changes,
// so all playback state resets naturally without calling setState in an effect.
const Player = ({ entry }: { entry: ReplayEntry }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const replayerRef = useRef<rrwebPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const { events } = entry;

    if (!containerRef.current) return;
    if (!Array.isArray(events) || events.length === 0) {
      console.error('No rrweb events found', events);
      return;
    }

    containerRef.current.innerHTML = '';
    const player = new rrwebPlayer({
      target: containerRef.current,
      props: { events, showController: false },
    });
    replayerRef.current = player;

    const replayer = player.getReplayer();
    const meta = replayer.getMetaData();
    setTotalTime(meta.totalTime);

    replayer.on('event-cast', (event: unknown) => {
      if (!cancelled)
        setCurrentTime(
          (event as { timestamp: number }).timestamp - meta.startTime,
        );
    });
    replayer.on('start', () => {
      if (!cancelled) setIsPlaying(true);
    });
    replayer.on('pause', () => {
      if (!cancelled) setIsPlaying(false);
    });
    replayer.on('finish', () => {
      if (!cancelled) {
        setIsPlaying(false);
        setCurrentTime(meta.totalTime);
      }
    });

    return () => {
      cancelled = true;
      replayerRef.current = null;
    };
  }, [entry]);

  const handlePlayPause = () => {
    if (!replayerRef.current) return;
    if (isPlaying) replayerRef.current.pause();
    else replayerRef.current.play();
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
    <>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          flex: 1,
          overflow: 'hidden',
          borderRadius: '8px 8px 0 0',
          minHeight: 0,
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: '#1c1c2e',
          padding: '10px 14px',
          borderRadius: '0 0 8px 8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          flexShrink: 0,
        }}
      >
        <button
          onClick={handlePlayPause}
          style={btnStyle}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button onClick={handleStop} style={btnStyle} title='Stop'>
          ⏹
        </button>
        <input
          type='range'
          min={0}
          max={totalTime || 1}
          value={currentTime}
          onChange={handleSeek}
          style={{
            flex: 1,
            cursor: 'pointer',
            accentColor: '#4f9cf9',
            height: '4px',
          }}
        />
        <span
          style={{
            color: '#ccc',
            fontSize: '0.82em',
            whiteSpace: 'nowrap',
            minWidth: '110px',
            textAlign: 'right',
          }}
        >
          {formatTime(currentTime)} / {formatTime(totalTime)}
          <span style={{ color: '#666', marginLeft: '6px' }}>
            -{formatTime(remaining)}
          </span>
        </span>
      </div>
    </>
  );
};

const Replay = () => {
  const [replays, setReplays] = useState<ReplayEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetch('http://localhost:3000/api/replays')
      .then((r) => r.json())
      .then((data: ReplayEntry[]) => setReplays(data))
      .catch((err) => console.error('Failed to load replays', err));
  }, []);

  const selected = replays[selectedIndex];

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        fontFamily: 'sans-serif',
        overflow: 'hidden',
        background: '#1c1c2e',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: '220px',
          flexShrink: 0,
          background: '#1c1c2e',
          borderRight: '1px solid #2a2a3d',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '14px 12px 10px',
            borderBottom: '1px solid #2a2a3d',
          }}
        >
          <span
            style={{
              color: '#aaa',
              fontSize: '0.75em',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Sessions ({replays.length})
          </span>
        </div>
        {replays.map((r, i) => {
          const active = i === selectedIndex;
          return (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              style={{
                all: 'unset',
                display: 'block',
                padding: '10px 12px',
                cursor: 'pointer',
                borderLeft: active
                  ? '3px solid #4f9cf9'
                  : '3px solid transparent',
                background: active ? 'rgba(79,156,249,0.08)' : 'transparent',
                borderBottom: '1px solid #1e1e2e',
              }}
            >
              <div
                style={{
                  color: active ? '#e0eeff' : '#ccc',
                  fontSize: '0.82em',
                  fontWeight: active ? 600 : 400,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {r.message || `Session ${i + 1}`}
              </div>
              <div
                style={{ color: '#555', fontSize: '0.72em', marginTop: '3px' }}
              >
                {new Date(r.created_at).toLocaleString()}
              </div>
            </button>
          );
        })}
      </aside>

      {/* Main player area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: '#1c1c2e',
          padding: '16px',
          overflow: 'hidden',
        }}
      >
        <p style={{ margin: '0 0 2px', color: '#e0eeff' }}>
          {selected?.message}
        </p>
        <p style={{ color: '#888', fontSize: '0.85em', margin: '0 0 12px' }}>
          {selected ? new Date(selected.created_at).toLocaleString() : ''}
        </p>
        {selected && <Player key={selectedIndex} entry={selected} />}
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
