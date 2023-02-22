import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { io } from 'socket.io-client';
import Header from './components/header';
import Home from './components/home';
import NotFound from './components/not-found';
import styles from './styles/App.module.css';

function App() {
  useEffect(() => {
    const socket = io('http://localhost:4000');
    socket.on('connect', () => {
      // console.log('>>', socket.connected, socket.id);
    });
    socket.on('disconnect', (reason) => {
      // console.log('~~', reason);
    });

    socket.on('hello2', (arg) => {
      console.log('-->', arg);
    });
    socket.emit('hello1', 'world1');

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className={styles.app}>
      <Header />
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
