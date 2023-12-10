import { Link } from 'react-router-dom';
import { PageUrl } from '@/constants/urls';
import { Page } from '@/components/Page';

const Home = () => {
  return (
    <Page title="Pixel Editor">
      <main className="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
        <Link to={PageUrl.CreateImage} className="btn btn-primary btn-lg">
          Create new image
        </Link>
      </main>
    </Page>
  );
};

export default Home;
