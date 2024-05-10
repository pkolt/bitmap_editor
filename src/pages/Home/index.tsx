import { Page } from '@/components/Page';
import { DialogList } from './dialogs/DialogList';
import { BitmapList } from './components/BitmapList';
import { ButtonList } from './components/ButtonList';
import { useHomePage } from './hooks';

const Home = () => {
  const { openDialog, dialog, closeDialog } = useHomePage();
  return (
    <Page title="Bitmap Editor">
      <main className="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
        <BitmapList openDialog={openDialog} />
        <ButtonList />
      </main>
      {dialog && <DialogList dialog={dialog} closeDialog={closeDialog} />}
    </Page>
  );
};

export default Home;
