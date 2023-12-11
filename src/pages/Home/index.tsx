import { Link } from 'react-router-dom';
import { PageUrl } from '@/constants/urls';
import { Page } from '@/components/Page';
import { useImageStore } from '@/store/images/useImagesStore';

const Home = () => {
  const { images } = useImageStore();
  return (
    <Page title="Pixel Editor">
      <main className="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
        {images.length > 0 && (
          <div className="mb-3">
            <h3 className="text-center">Open</h3>
            <ul className="list-group list-group-flush mb-3">
              {images.map((it) => {
                const url = PageUrl.Editor.replace(':id', it.id);
                return (
                  <li className="list-group-item btn-link">
                    <Link to={url}>{it.name}</Link>
                  </li>
                );
              })}
            </ul>
            <h3 className="text-center">Or</h3>
          </div>
        )}
        <Link to={PageUrl.CreateImage} className="btn btn-primary btn-lg">
          Create new image
        </Link>
      </main>
    </Page>
  );
};

export default Home;
