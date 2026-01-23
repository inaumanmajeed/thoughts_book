import { Providers } from './providers';
import '../src/index.css';
import '../src/app.css';

export const metadata = {
  title: 'Thoughts Book',
  description: 'Your personal thoughts and memories',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
