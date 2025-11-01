// src/layouts/UserLayout.tsx
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-slate-50 to-slate-100">
      {/* Shared Navbar for user pages */}
      <Navbar />

      {/* Page Content (like UserPage or ChatWindow) */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
