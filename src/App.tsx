import React, { useEffect } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import Header from './components/header';
import Home from './pages/home';
import TestPage from './pages/test-page';
import NotFound from './pages/not-found';
import { socketConnected } from './labhub/status';
import { initSetup, uninitSetup } from './labhub/setup';
import { assertClientId } from './labhub/utils';
import styles from './styles/App.module.css';
import { GrTest } from '@react-icons/all-files/gr/GrTest';

function App() {
  useEffect(() => {
    const clientId = assertClientId();
    if (!clientId) return;

    const socket = io('http://localhost:4000', { query: { clientId } });
    socket.on('connect', () => {
      // console.log(socket.connected, socket.id);
      socketConnected.next(true);
    });
    socket.on('disconnect', (reason) => {
      // console.log('disconnected:', reason);
      socketConnected.next(false);
    });

    const [subs1, subs2] = initSetup(socket);

    return () => {
      uninitSetup(socket, subs1, subs2);
    };
  }, []);

  return (
    <div className={styles.app}>
      <Header />
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/test' element={<TestPage />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
      <div className={styles.testIcon}>
        <Link to='/test'><GrTest /></Link>
      </div>
    </div>
  );
}

export default App;
