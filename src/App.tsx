import React, { useEffect } from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import Header from './components/header';
import Home from './components/home';
import ScanDevice from "./pages/scanDevices/index"
import TestPage from './pages/test-page';
import NotFound from './pages/not-found';
import { useDeviceStatus,useDeviceConnected, useSwInstallStatus, useSwPendingUpdate} from './labhub/status';
import {getClientId} from "./labhub/utils"
import {setScreenNumber} from "./labhub/actions";
import { GetScreenName} from "./utils/const";
import styles from './styles/App.module.css';
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
import InsertReferenceCuvette from './components/CalibrateSpectrophotometer/InsertReferenceCuvette';
import CuvetteInsertion from './components/MeasureAbsorbance/CuvetteInsertion';
import CalibrationTesting from './components/CalibrateSpectrophotometer/CalibrationTesting';
import SpectrophotometerCalibration from './components/CalibrateSpectrophotometer/SpectrophotometerCalibration';
import SpectrophotometerTesting from './components/CalibrateSpectrophotometer/SpectrophotometerTesting';
import AbsorbanceMeasuring from './components/MeasureAbsorbance/AbsorbanceMeasuring';
import ShowErrorModal from './components/Modal/ShowErrorModal';
import pkg from '../package.json';
import Toast from './components/Modal/Toast';
import WarningModal from './components/Modal/WarningModal';
import Loader from './components/Modal/Loader';

function App() {
  const [status] = useDeviceStatus();
  const [connected] = useDeviceConnected();
  const [swStatus] = useSwInstallStatus();
  const [swWaiting] = useSwPendingUpdate();
  const location = useLocation();
  const clientId = getClientId()

  const showHeader = location?.pathname === "/heater-element" || location?.pathname === "/temperature-probe" || location?.pathname === "/temperature-sensor" || location?.pathname === "/voltage-sensor" || location?.pathname === "/measure-absorbance" ? false : true

  const style = swStatus === undefined ? 'dotted' : swStatus === 'offline' ? 'solid' : swStatus === 'error' ? 'wavy' : '';
  const textDecoration = style ? `${style} underline`: '';
  const statusIcon = swStatus === null ? <sup>&#8224;</sup> : swWaiting ? <sup>*</sup> : null;
  const pkgVersion = (
    <span style={{ textDecoration }}>{pkg.version}{statusIcon}</span>
  );

  useEffect(() => { // setScreen name as a leader for sync for member
    if(clientId === status?.leaderSelected){
      if(location?.pathname){
        for(let one in GetScreenName){
          if(GetScreenName[one] === location?.pathname){
            setScreenNumber(Number(one))
            break;
          }
        }
      }
    }
  },[clientId,status?.leaderSelected,location?.pathname])
  return (
    <div className={styles.app}>
      {showHeader && <Header />}
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/preset-mode' element={<ProjectMode />} />
          <Route path='/scan-devices' element={<ScanDevice />} />
          <Route path ="/mode-selection" element={<ModeSelection />}/>
          <Route path='/function-selection' element={<FunctionSelection />} />
          <Route path='/data-setup' element={<DataSetup />} />
          <Route path='/sensors' element={<Sensor />} />
          <Route path='/temperature-sensor' element={<MeasuringTemprature />} />
          <Route path='/voltage-sensor' element={<MeasuringVoltage />} />
          <Route path='/heater' element={<HeaterInitialPage />} />
          <Route path='/method-selection' element={<MethodSelection />} />
          <Route path='/heater-element' element={<HeaterElement />} />
          <Route path='/temperature-probe' element={<TemperatureProbe />} />
          <Route path='/rgb-spect' element={<SelectFunction />} />
          <Route path='/calibrate-spectrophotometer' element={<InsertReferenceCuvette />} />
          <Route path='/spectrophotometer-calibration' element={<SpectrophotometerCalibration />} />
          <Route path='/calibration-testing' element={<CalibrationTesting />} />
          <Route path='/spectrophotometer-testing' element={<SpectrophotometerTesting />} />

          <Route path='/cuvette-insertion' element={<CuvetteInsertion />} /> {/* currently not in use */}
          <Route path='/measure-absorbance' element={<AbsorbanceMeasuring />} />

          <Route path="/my-records" element={<MyRecordList />} />
          <Route path="/temperature-records" element={<TemperatureRecord />} />
          <Route path="/voltage-records" element={<VoltageRecord />} />
          <Route path="/rgb-records" element={<RGBRecord />} />
          <Route path='/test' element={<TestPage />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
      <div className={styles.version}>
        {/* {connected ? (
          <div>Firmware version: {status?.deviceVersion || "NA"} {process.env.REACT_APP_ENV !== 'prod' && "("}
            {process.env.REACT_APP_ENV !== 'prod' ? /* pkgVersion : *|/  (
              <Link to='/test'>{pkgVersion}</Link>
            ) : null}
            {process.env.REACT_APP_ENV !== 'prod' && ")"}
          </div>
        ) : (
          <div>App version: {pkgVersion}</div>
        )} */}
         {!connected ? <div>{""}</div> : null }
        {!connected ? <div>App version: {pkgVersion}</div> : null}

        {connected ? <div>Firmware version: {status?.deviceVersion || "NA"}</div> : null}
        {connected ? <div>App version: {process.env.REACT_APP_ENV !== 'prod' ? <Link to='/test'>{pkgVersion}</Link> : pkgVersion}</div> : null}
      </div>
      <LeaderDisconnect />
      <Loader />
      <ShowErrorModal />
      <WarningModal />
      <Toast />
    </div>
  );
}

export default App;
