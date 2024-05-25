import { useEffect } from 'react';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { UpdatePwaDialog } from '../UpdatePwaDialog';
import { ErrorBoundary } from './ErrorBoundary';

interface PageProps extends React.PropsWithChildren {
  title: string;
}

export const Page = ({ title, children }: PageProps) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="container d-flex flex-column gap-4 min-vh-100">
      <Header />
      <ErrorBoundary>{children}</ErrorBoundary>
      <Footer />
      <UpdatePwaDialog />
    </div>
  );
};
