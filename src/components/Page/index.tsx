import { useEffect } from 'react';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { UpdatePwaDialog } from '../UpdatePwaDialog';
import { ErrorBoundary } from './ErrorBoundary';

interface PageProps extends React.PropsWithChildren {
  title: string;
  hideTitle?: boolean;
}

export const Page = ({ title, hideTitle, children }: PageProps) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="container d-flex flex-column gap-4 min-vh-100">
      <Header />
      <ErrorBoundary>
        <main className="d-flex flex-column flex-grow-1 justify-content-center align-items-center gap-3">
          {!hideTitle && <h1 className="text-center">{title}</h1>}
          {children}
        </main>
      </ErrorBoundary>
      <Footer />
      <UpdatePwaDialog />
    </div>
  );
};
