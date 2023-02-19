import { Link } from 'react-router-dom';

function NotFound(props: NotFoundProps) {
  return (
    <div style={{ color: 'red' }}>
      <h2>Page Not Found</h2>
      <br />
      <Link to='/'>Go Home</Link>
    </div>
  );
}

export default NotFound;

export interface NotFoundProps {}
