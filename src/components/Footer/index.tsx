import { DateTime } from 'luxon';

export const Footer = () => {
  const year = DateTime.local().year;
  return (
    <footer className="container-fluid p-3 bg-light text-center rounded-top-2">
      Created by <a href="https://github.com/pkolt">Pavel Koltyshev</a> &copy; 2023-{year}
    </footer>
  );
};
