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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
