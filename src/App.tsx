import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { io } from 'socket.io-client';
import Header from './components/header';
import Home from './pages/home';
import TestPage from './pages/test-page';
import NotFound from './pages/not-found';
import { initSetup, uninitSetup } from './labhub/setup';
import styles from './styles/App.module.css';

function App() {
  useEffect(() => {
    const socket = io('http://localhost:4000');
    socket.on('connect', () => {
      // console.log(socket.connected, socket.id);
    });
    socket.on('disconnect', (reason) => {
      // console.log('disconnected:', reason);
    });

    const [subs1] = initSetup(socket);

    return () => {
      uninitSetup(socket, subs1);
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
    </div>
  );
}

export default App;
