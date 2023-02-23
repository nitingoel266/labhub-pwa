import { Link } from 'react-router-dom';
import { useDeviceStatus } from '../labhub/status';
import { joinAsLeader, joinAsMember, resetLeader, setSelectedMode, setSelectedFunction, resetAll, setupData } from '../labhub/actions';
import { LABHUB_CLIENT_ID } from '../utils/const';

function TestPage(props: TestPageProps) {
  const [status] = useDeviceStatus();

  return (
    <div>
      <h2>Test Page</h2>
      <pre>
        <code>{JSON.stringify(status, null, 2)}</code>
      </pre>
      <br />
      <button onClick={() => joinAsLeader()} disabled={status?.leaderSelected !== null}>Set Leader</button>
      <br />
      <button onClick={() => resetLeader()} disabled={!status || status.leaderSelected === null}>Unset Leader</button>
      <br /><br />
      <button onClick={() => joinAsMember()} disabled={!status?.leaderSelected || !localStorage.getItem(LABHUB_CLIENT_ID) || status.leaderSelected === localStorage.getItem(LABHUB_CLIENT_ID) || status.membersJoined.includes(localStorage.getItem(LABHUB_CLIENT_ID) || '')}>Set Member</button>
      <br /><br />
      <button onClick={() => setSelectedMode('manual')} disabled={status?.modeSelected !== null}>Set manual mode</button>
      <br />
      <button onClick={() => setSelectedMode(null)} disabled={!status || status.modeSelected === null}>Unset mode</button>
      <br /><br />
      <button onClick={() => setSelectedFunction('sensors')} disabled={status?.funcSelected !== null}>Set sensors func</button>
      <br />
      <button onClick={() => setSelectedFunction(null)} disabled={!status || status.funcSelected === null}>Unset func</button>
      <br /><br />
      <button onClick={() => setupData({ dataRate: 5, dataSample: 100 })} disabled={status?.setupData.dataRate !== 1}>Set data rate</button>
      <br />
      <button onClick={() => setupData()} disabled={!status || status.setupData.dataRate === 1}>Reset data rate</button>
      <br /><br />
      <button onClick={() => resetAll()}>Reset All</button>
      <br /><br />
      <Link to='/'>Go Home</Link>
    </div>
  );
}

export default TestPage;

export interface TestPageProps {}
