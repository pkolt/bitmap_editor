import { PageUrl } from '@/constants/urls';
import { Link } from 'react-router-dom';

export const ButtonList = () => {
  return (
    <div className="d-flex flex-column gap-3">
      <Link to={PageUrl.CreateBitmap} className="btn btn-primary btn-lg">
        Create new bitmap
      </Link>
      <Link to={PageUrl.ImportFromImage} className="btn btn-primary btn-lg">
        Import from image
      </Link>
      <Link to={PageUrl.ImportFromJson} className="btn btn-primary btn-lg">
        Import from JSON
      </Link>
    </div>
  );
};
