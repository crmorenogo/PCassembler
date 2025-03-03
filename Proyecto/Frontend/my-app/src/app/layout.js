'use client';
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import '@/app/globals.css'
import { AuthProvider } from '@/context/AuthContext';

// src/app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NavBar/>
          <main className="min-h-screen">{children}</main>
          <Footer/>
        </AuthProvider>
      </body>
    </html>
  );
}
