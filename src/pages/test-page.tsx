import { Link } from 'react-router-dom';
import { useDeviceStatus } from '../labhub/status';
import { setLeader, setSelectedMode } from '../labhub/actions';
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
      <button onClick={() => setLeader(localStorage.getItem(LABHUB_CLIENT_ID))} disabled={status?.leaderSelected !== null}>Set Leader</button>
      <br />
      <button onClick={() => setLeader(null)} disabled={!status || status.leaderSelected === null}>Unset Leader</button>
      <br /><br />
      <button onClick={() => setSelectedMode('manual')} disabled={status?.modeSelected !== null}>Set manual mode</button>
      <br />
      <button onClick={() => setSelectedMode(null)} disabled={!status || status.modeSelected === null}>Unset mode</button>
      <br /><br />
      <Link to='/'>Go Home</Link>
    </div>
  );
}

export default TestPage;

export interface TestPageProps {}
