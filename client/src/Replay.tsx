import { useEffect, useRef } from 'react';
import '@rrweb/replay/dist/style.css';
import { Replayer } from '@rrweb/replay';

const Replay = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const replayerRef = useRef<Replayer | null>(null);

  useEffect(() => {
    let cancelled = false;

    const getEvents = async () => {
      const res = await fetch('http://localhost:3000/api/clicks');
      const data = await res.json();

      const record = data.filter(
        (item: { event_name: string }) => item.event_name === 'record',
      );

      const events = record[2]?.payload?.payload;
      console.log(events, 'events');
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

      replayerRef.current = new Replayer(events, {
        root: containerRef.current,
        // UNSAFE_replayCanvas: true,
      });

      replayerRef.current.play();
    };

    getEvents().catch((err) => {
      console.error('Failed to load replay', err);
    });

    return () => {
      cancelled = true;
      replayerRef.current?.destroy();
      replayerRef.current = null;
    };
  }, []);

  return (
    <div>
      <h1>Replay</h1>
      <button onClick={() => replayerRef.current?.play()}>Play</button>
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
