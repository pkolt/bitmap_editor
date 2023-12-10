import { Link } from 'react-router-dom';
import { PageUrl } from '@/constants/urls';

export const NavBar = () => {
  return (
    <div className="navbar bg-body-tertiary rounded-bottom-2">
      <div className="container-fluid">
        <Link to={PageUrl.Home} className="navbar-brand d-flex gap-2 align-items-center">
          <i className="bi bi-border-all" />
          Pixel Editor
        </Link>
      </div>
    </div>
  );
};
