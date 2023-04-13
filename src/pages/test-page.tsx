import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDeviceConnected, useDeviceStatus, useDeviceDataFeed } from '../labhub/status';
import { joinAsLeader, resetLeader, resetAll, setupData, simulateSensor, startSensorExperiment, stopSensorExperiment, changeSetpointTemp, simulateHeater, startHeaterExperiment, stopHeaterExperiment, calibrateRgb, simulateRgb, startRgbExperiment } from '../labhub/actions';
// import { setSelectedMode, setSelectedFunction } from '../labhub/actions-client';
import { initSetup, uninitSetup } from '../labhub/setup';
import { getClientType } from '../labhub/utils';
import { getTemperatureLog, getVoltageLog } from '../labhub/actions-client';

function TestPage(props: TestPageProps) {
  const [connected] = useDeviceConnected();
  const [status] = useDeviceStatus();
  const [dataFeed] = useDeviceDataFeed();

  const [temperatureLog, setTemperatureLog] = useState<number[] | null>(null);
  const [voltageLog, setVoltageLog] = useState<number[] | null>(null);

  async function fetchTemperatureLog(temperatureIndex: number | null | undefined) {
    if (typeof temperatureIndex === 'number') {
      const tempLog = await getTemperatureLog(temperatureIndex);
      setTemperatureLog(tempLog);
    }
  }
  
  async function fetchVoltageLog(voltageIndex: number | null | undefined) {
    if (typeof voltageIndex === 'number') {
      const voltLog = await getVoltageLog(voltageIndex);
      setVoltageLog(voltLog);
    }
  }
  
  const clientType = getClientType();
  // const unknownClientType = clientType === null;
  const isLeader = clientType === 'leader';
  const isMember = clientType === 'member';
  const leaderSelected = !!(status?.leaderSelected);

  // @ts-ignore
  const cond1 = status?.setupData.dataRate !== 5 || status?.setupData.dataSample !== 10 || (status?.setupData.dataRate === 'user' && status?.setupData.dataSample === 'cont');

  if (!connected) {
    return (
      <div>
        <h2 style={{ color: 'deeppink' }}>LabHub device not connected.</h2>
        <button onClick={() => initSetup()}>Connect Device</button>
        <br /><br />
        <span>Mock data server: http://localhost:4000</span>
      </div>
    );
  }

  return (
    <div>
      <h2>Test Page {isLeader ? '(Leader)' : (isMember ? '(Member)' : '')}</h2>
      <button onClick={() => uninitSetup()}>Disconnect Device</button>

      <pre>
        <code>{JSON.stringify(status, null, 2)}</code>
      </pre>
  
      <pre>
        <code>{JSON.stringify(dataFeed, null, 2)}</code>
      </pre>

      {temperatureLog && (
        <>
          <strong style={{ fontSize: '120%' }}>Temperature Log:</strong>
          <pre>
            <code>{JSON.stringify(temperatureLog)}</code>
          </pre>
        </>
      )}

      {voltageLog && (
        <>
          <strong style={{ fontSize: '120%' }}>Voltage Log:</strong>
          <pre>
            <code>{JSON.stringify(voltageLog)}</code>
          </pre>
        </>
      )}

      <br />
      <button onClick={() => fetchTemperatureLog(dataFeed.sensor?.temperatureIndex)}>Temperature Log</button>
      <br />
      <button onClick={() => fetchVoltageLog(dataFeed.sensor?.voltageIndex)}>Voltage Log</button>
      <br /><br />

      <button onClick={() => joinAsLeader()} disabled={leaderSelected}>Set Leader</button>
      <br />
      <button onClick={() => resetLeader()} disabled={!isLeader || !status || status.leaderSelected === null}>Unset Leader</button>
      <br /><br />

      {/* <button onClick={() => joinAsMember()} disabled={!leaderSelected || !unknownClientType}>Set Member</button>
      <br />
      <button onClick={() => unjoinMember()} disabled={!leaderSelected || !isMember}>Unset Member</button>
      <br /><br /> */}

      {/* <button onClick={() => setSelectedMode('manual')} disabled={!isLeader || status?.modeSelected !== null}>Set manual mode</button>
      <br />
      <button onClick={() => setSelectedMode(null)} disabled={!isLeader || !status || status.modeSelected === null}>Unset mode</button>
      <br /><br />
      <button onClick={() => setSelectedFunction('sensor')} disabled={!isLeader || status?.funcSelected !== null}>Set sensors func</button>
      <br />
      <button onClick={() => setSelectedFunction(null)} disabled={!isLeader || !status || status.funcSelected === null}>Unset func</button>
      <br /><br /> */}

      <button onClick={() => setupData({ dataRate: 5, dataSample: 10 })} disabled={!isLeader || status?.setupData.dataRate !== 1 || status?.setupData.dataSample !== 'cont'}>Set data rate</button>
      <br />
      <button onClick={() => setupData({ dataRate: 'user', dataSample: 'cont' })} disabled={!isLeader || cond1}>Set user data rate</button>
      <br />
      <button onClick={() => setupData()} disabled={!isLeader || !status || (status.setupData.dataRate === 1 && status.setupData.dataSample === 'cont')}>Reset data rate</button>
      <br /><br />
      <button onClick={() => resetAll()} disabled={!isLeader}>Reset Device Status</button>

      <br /><br />
      <button onClick={() => simulateSensor('temperature')} disabled={!isLeader || status?.sensorConnected !== null}>Temperature sensor</button>
      <br />
      <button onClick={() => simulateSensor('voltage')} disabled={!isLeader || status?.sensorConnected !== null}>Voltage sensor</button>
      <br />
      <button onClick={() => simulateSensor(null)} disabled={!isLeader || !status || status.sensorConnected === null}>Disconnect sensor</button>
      <br />
      {dataFeed.sensor === null ? (
        <button onClick={() => startSensorExperiment()} disabled={!isLeader || !status || status.sensorConnected === null}>Start sensor experiment</button>
      ) : (
        <button onClick={() => stopSensorExperiment()} disabled={!isLeader || !status || status.sensorConnected === null}>Stop sensor experiment</button>
      )}

      <br /><br />
      <button onClick={() => changeSetpointTemp(status?.setpointTemp !== 50 ? 50 : 30)} disabled={!isLeader}>{status?.setpointTemp !== 50 ? 'Change' : 'Reset'} setpoint temperature</button>
      <br /><br />
      <button onClick={() => simulateHeater('element')} disabled={!isLeader || status?.heaterConnected !== null}>Heater element</button>
      <br />
      <button onClick={() => simulateHeater('probe')} disabled={!isLeader || status?.heaterConnected !== null}>Temperature probe</button>
      <br />
      <button onClick={() => simulateHeater(null)} disabled={!isLeader || !status || status.heaterConnected === null}>Disconnect heater</button>
      <br />
      {dataFeed.heater === null ? (
        <button onClick={() => startHeaterExperiment()} disabled={!isLeader || !status || status.heaterConnected === null}>Start heater experiment</button>
      ) : (
        <button onClick={() => stopHeaterExperiment()} disabled={!isLeader || !status || status.heaterConnected === null}>Stop heater experiment</button>
      )}

      <br /><br />
      <button onClick={() => calibrateRgb()} disabled={!isLeader || status?.rgbConnected !== null || status.rgbCalibrated}>Calibrate spectrophotometer</button>
      <br /><br />
      <button onClick={() => simulateRgb('calibrate_test')} disabled={!isLeader || status?.rgbConnected !== null || !status.rgbCalibrated}>Test calibration</button>
      <br />
      <button onClick={() => simulateRgb('measure')} disabled={!isLeader || status?.rgbConnected !== null || !status.rgbCalibrated}>Measure absorbance (RGB)</button>
      <br />
      <button onClick={() => simulateRgb(null)} disabled={!isLeader || !status || status.rgbConnected === null || !status.rgbCalibrated}>Disconnect spectrophotometer</button>
      <br />
      <button onClick={() => startRgbExperiment()} disabled={!isLeader || !status || status.rgbConnected === null || dataFeed.rgb !== null || !status.rgbCalibrated}>Start RGB experiment</button>

      <br /><br />
      <br /><br />
      <Link to='/'>Go Home</Link>
      <br /><br />
    </div>
  );
}

export default TestPage;

export interface TestPageProps {}
