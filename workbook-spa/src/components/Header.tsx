import { Link } from './Link';

const Header = () => {
  return (
    <nav style={{ display: 'flex', gap: '10px' }}>
      <Link to="/chris">CHRIS</Link>
      <Link to="/mas">MAS</Link>
      <Link to="/eve-carol">EVE/CAROL</Link>
      <Link to="/not-found">NOT FOUND</Link>
    </nav>
  );
};

export default Header;