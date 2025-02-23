// src/app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <h1>PCAssembler</h1>
        <main>{children}</main>
      </body>
    </html>
  );
}
