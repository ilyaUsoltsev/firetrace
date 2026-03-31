import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './index.css';
import App from './App.tsx';
import Replay from './Replay.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/app' element={<App />} />
        <Route path='/replay' element={<Replay />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
