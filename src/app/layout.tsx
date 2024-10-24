// app/layout.tsx
'use client'
import { ReactNode } from 'react';
import Navbar from './components/navbar';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
      <Navbar />
        <div className='main-content'>
          {children}
        </div>
        <style jsx>{`
          .main-content {
            padding-top: 80px; /* Adjust this value based on the height of your navbar */
          }
        `}</style>
      </body>
    </html>
  );
}
