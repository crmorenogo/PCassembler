import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import '@/app/globals.css'

// src/app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar/>
        <main className="min-h-screen">{children}</main>
        <Footer/>
      </body>
    </html>
  );
}
