import { useState } from 'react';
import './App.css';
import { Link } from 'react-router';

function App() {
  const [count, setCount] = useState(0);

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
      <Link to='/replay'>Go to replay</Link>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default App;
