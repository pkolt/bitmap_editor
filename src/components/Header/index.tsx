import { Link } from 'react-router-dom';
import { PageUrl } from '@/constants/urls';

export const Header = () => {
  return (
    <div className="navbar bg-body-tertiary rounded-bottom-2">
      <div className="container-fluid">
        <Link to={PageUrl.BitmapList} className="navbar-brand d-flex gap-2 align-items-center">
          <i className="bi bi-border-all display-6" />
          <div className="d-flex flex-column">
            <div className="lh-sm">Bitmap Editor</div>
            <div className="h6 text-body-tertiary mb-0">Create bitmap image for OLED display</div>
          </div>
        </Link>
        <a href="https://github.com/pkolt/bitmap_editor" target="_blank" className="h3 m-0">
          <i className="bi bi-github" />
        </a>
      </div>
    </div>
  );
};
