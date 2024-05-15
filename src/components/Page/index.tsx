import { useEffect } from 'react';
import { Footer } from '../Footer';
import { Header } from '../Header';

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
      {children}
      <Footer />
    </div>
  );
};
