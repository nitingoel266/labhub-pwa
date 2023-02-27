import React, { useEffect } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Header from './components/header';
import Home from './components/home';
import ScanDevice from "./pages/scanDevices/index"
import TestPage from './pages/test-page';
import NotFound from './pages/not-found';
import { socketConnected ,useDeviceStatus} from './labhub/status';
import { initSetup, uninitSetup } from './labhub/setup';
import { assertClientId } from './labhub/utils';
import styles from './styles/App.module.css';
import { GrTest } from '@react-icons/all-files/gr/GrTest';
import FunctionSelection from './pages/functionProcedure/FunctionSelection';
import ModeSelection from './pages/modeProcedure/ModeSelection';
import ProjectMode from './components/projectMode';
import LeaderDisconnect from './components/Modal/LeaderDisconnect';
import DataSetup from './components/DataSetup';
import Sensor from './components/SensorInitialPage';
import MeasuringVoltage from './components/MeasuringVoltage';
import MeasuringTemprature from './components/MeasuringTemprature';
import HeaterInitialPage from './components/HeaterInitialPage';
import MethodSelection from './pages/heaterPocedure/MethodSelection';
import HeaterElement from './pages/heaterPocedure/HeaterElement';
import TemperatureProbe from './pages/heaterPocedure/TemperatureProbe';
import SelectFunction from './pages/RGBSpect/SelectFunction';
import MyRecordList from './pages/myRecords/MyRecordList';
import TemperatureRecord from './components/TemperatureRecords';
import VoltageRecord from './components/VoltageRecords';
import RGBRecord from './components/RGBRecods';

function App() {
  const [status] = useDeviceStatus();
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
          <Route path='/data-setup' element={<DataSetup />} />
          <Route path='/sensor' element={<Sensor />} />
          <Route path='/measuring-temprature' element={<MeasuringTemprature />} />
          <Route path='/measuring-voltage' element={<MeasuringVoltage />} />
          <Route path='/heater' element={<HeaterInitialPage />} />
          <Route path='/method-selection' element={<MethodSelection />} />
          <Route path='/heater-element' element={<HeaterElement />} />
          <Route path='/temperature-probe' element={<TemperatureProbe />} />
          <Route path='/rgb-spect' element={<SelectFunction />} />
          

          <Route path="/my-records" element={<MyRecordList />} />
          <Route path="/temperature-records" element={<TemperatureRecord />} />
          <Route path="/voltage-records" element={<VoltageRecord />} />
          <Route path="/rgb-records" element={<RGBRecord />} />
          <Route path='/test' element={<TestPage />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
      <div className={styles.testIcon}>
        <Link to='/test'><GrTest /></Link>
      </div>
      <div className={styles.version}>Firmware version: {status?.deviceVersion}</div>
      <LeaderDisconnect />
    </div>
  );
}

export default App;
