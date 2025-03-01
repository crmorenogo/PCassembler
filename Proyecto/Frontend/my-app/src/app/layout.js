import NavBar from "@/components/NavBar";

// src/app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar/>
        <h1>PCAssembler</h1>
        <main>{children}</main>
      </body>
    </html>
  );
}
