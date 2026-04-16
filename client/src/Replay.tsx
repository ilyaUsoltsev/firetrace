import { useEffect, useRef, useState } from 'react';
import '@rrweb/replay/dist/style.css';
import rrwebPlayer from 'rrweb-player';
import 'rrweb-player/dist/style.css';

const Replay = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const replayerRef = useRef<rrwebPlayer | null>(null);
  const [message, setMessage] = useState<string>('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    let cancelled = false;

    const getEvents = async () => {
      const res = await fetch('http://localhost:3000/api/replays');
      const data = await res.json();
      const events = data[0]?.events;
      const message = data[0]?.message;
      setMessage(message);
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

      // Clear previous replayer content before creating a new one
      containerRef.current.innerHTML = '';

      replayerRef.current = new rrwebPlayer({
        target: containerRef.current!,
        props: {
          events,
          showController: false,
        },
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

  return (
    <div>
      <h1>Replay</h1>
      <p>{message}</p>
      <p>{date}</p>
      <button onClick={() => replayerRef.current?.play()}>Start</button>
      <button onClick={() => replayerRef.current?.pause()}>Pause</button>
      <button onClick={() => replayerRef.current?.goto(0, false)}>Stop</button>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '600px',
          overflow: 'hidden',
        }}
      />
    </div>
  );
};

export default Replay;
