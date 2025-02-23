// src/app/page.js
"use client"; // Ensure this is a client component

import BackendMessage from "@/components/BackendMessage"; // Adjust the path if needed

export default function Page() {
  return (
    <div>
      <h2>Welcome to PCAssembler</h2>
      <BackendMessage />
    </div>
  );
}
