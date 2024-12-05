import '../app/globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'YouApp',
  description: '',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className=" bg-[url('/assets/bg.jpeg')] bg-cover bg-center h-screen">
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        {children}
      </body>
    </html >
  );
}