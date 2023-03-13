import { Link } from 'react-router-dom';
import { useSocketConnected, useDeviceStatus, useDeviceDataStream } from '../labhub/status';
import { joinAsLeader, resetLeader, resetAll, setupData, simulateSensor, startSensorExperiment } from '../labhub/actions';
// import { setSelectedMode, setSelectedFunction } from '../labhub/actions-client';
import { initSetup, uninitSetup } from '../labhub/setup';
import { getClientType } from '../labhub/utils';

function TestPage(props: TestPageProps) {
  const [connected] = useSocketConnected();
  const [status] = useDeviceStatus();
  const [dataStream] = useDeviceDataStream();

  const clientType = getClientType();
  // const unknownClientType = clientType === null;
  const isLeader = clientType === 'leader';
  const isMember = clientType === 'member';
  const leaderSelected = !!(status?.leaderSelected);

  // @ts-ignore
  const cond1 = status?.setupData.dataRate !== 5 || status?.setupData.dataSample !== 10 || (status?.setupData.dataRate === 'manual' && status?.setupData.dataSample === 'cont');

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

      <>
        <pre>
          <code>{JSON.stringify(status, null, 2)}</code>
        </pre>
        <pre>
          <code>{JSON.stringify(dataStream, null, 2)}</code>
        </pre>
      </>
      <br />
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
      
      <br />
      <button onClick={() => simulateSensor('temperature')} disabled={!isLeader || status?.sensorConnected !== null}>Temperature sensor</button>
      <br />
      <button onClick={() => simulateSensor('voltage')} disabled={!isLeader || status?.sensorConnected !== null}>Voltage sensor</button>
      <br />
      <button onClick={() => simulateSensor(null)} disabled={!isLeader || !status || status.sensorConnected === null}>Disconnect sensor</button>
      <br /><br />
      <button onClick={() => startSensorExperiment()} disabled={!isLeader || !status || status.sensorConnected === null || dataStream !== null}>Start sensor experiment</button>
      <br /><br />

      <br />
      <Link to='/'>Go Home</Link>
    </div>
  );
}

export default TestPage;

export interface TestPageProps {}
