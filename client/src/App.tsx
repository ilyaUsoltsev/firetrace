import { useEffect, useState } from 'react';
import { record } from '@rrweb/record';
import './App.css';

const events: unknown[] = [];

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sessionId = sessionStorage.getItem('sessionId');
    const save = () => {
      const body = JSON.stringify({
        events,
        session_id: sessionId,
      });
      events.length = 0;
      fetch('http://localhost:3000/api/replays', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
    };

    const stop = record({
      emit(event) {
        events.push(event);
      },
    });

    const interval = setInterval(save, 5000);

    return () => {
      stop?.();
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <h1>Firetrace Demo</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit, sequi.
        Odit doloremque, consectetur fuga iure necessitatibus officia veritatis
        dignissimos laborum, aliquid, repellat neque. Veritatis blanditiis quo
        doloribus earum impedit.
      </p>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default App;
