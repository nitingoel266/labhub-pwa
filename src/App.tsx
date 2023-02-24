import React, { useEffect } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import Header from './components/header';
import Home from './pages/home';
import ScanDevice from "./pages/scanDevices/index"
import TestPage from './pages/test-page';
import NotFound from './pages/not-found';
import { socketConnected } from './labhub/status';
import { initSetup, uninitSetup } from './labhub/setup';
import styles from './styles/App.module.css';
import { GrTest } from '@react-icons/all-files/gr/GrTest';
import FunctionSelection from './pages/functionProcedure/FunctionSelection';
import ModeSelection from './pages/modeProcedure/ModeSelection';
import ProjectMode from './components/projectMode';

function App() {
  useEffect(() => {
    const socket = io('http://localhost:4000');
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
          <Route path='/project-mode' element={<ProjectMode />} />
          <Route path='/scan-devices' element={<ScanDevice />} />
          <Route path ="mode-selection" element={<ModeSelection />}/>
          <Route path='/function-selection' element={<FunctionSelection />} />
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
