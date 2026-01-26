import { Providers } from './providers';
import '../src/index.css';
import '../src/app.css';

export const metadata = {
  title: 'Thoughts',
  description: 'Thoughts - A minimalist web app that helps you capture, organize, and manage your daily thoughts and to-dos in one simple, distraction-free place.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="jhhmzzHrqwaBBlLTHXbBTJ8i53jz12qgdK-z5U7pdbQ" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
