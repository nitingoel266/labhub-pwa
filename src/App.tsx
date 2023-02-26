import React, { useEffect } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Header from './components/header';
import Home from './components/home';
import ScanDevice from "./pages/scanDevices/index"
import TestPage from './pages/test-page';
import NotFound from './pages/not-found';
import { assertClientId } from './labhub/utils';
import styles from './styles/App.module.css';
import { GrTest } from '@react-icons/all-files/gr/GrTest';
import FunctionSelection from './pages/functionProcedure/FunctionSelection';
import ModeSelection from './pages/modeProcedure/ModeSelection';
import ProjectMode from './components/projectMode';
import LeaderDisconnect from './components/Modal/LeaderDisconnect';

function App() {
  useEffect(() => {
    const clientId = assertClientId();
    if (!clientId) {
      console.error('Could not set clientId in localStorage');
    }
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
      <LeaderDisconnect />
    </div>
  );
}

export default App;
