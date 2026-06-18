"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => {
        localStorage.removeItem("sipling_user_role");
        signOut({ callbackUrl: "/auth" });
      }}
      className="material-symbols-outlined text-[var(--color-error)] p-2 hover:bg-[var(--color-error)]/5 rounded-full transition-all flex items-center justify-center cursor-pointer"
      title="Keluar dari akun"
    >
      logout
    </button>
  );
}
