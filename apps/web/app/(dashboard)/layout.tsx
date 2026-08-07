"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiListItems } from "@/lib/api-client";
import { clearToken, isLoggedIn } from "@/lib/auth";
import { useEffect } from "react";

const navLinks = [
  { href: "/closet", label: "Closet" },
  { href: "/analytics", label: "Analytics" },
  { href: "/match", label: "Match" },
  { href: "/style-drift", label: "Style Drift" },
];

function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: items } = useQuery({
    queryKey: ["items"],
    queryFn: apiListItems,
  });

  const wornThisWeek = items?.filter((item) => {
    if (!item.lastWornAt) return false;
    const d = new Date(item.lastWornAt);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length ?? 0;

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-[220px] bg-cream border-r-[3px] border-black flex flex-col z-10">
      {/* Wordmark */}
      <div className="px-6 py-6 border-b-[3px] border-black">
        <Link href="/closet" className="font-sans text-xl tracking-tight">
          closetiq
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-6 py-4">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActive
                  ? "flex items-center border-b-2 border-black py-4 font-sans text-sm font-medium uppercase tracking-widest text-black border-l-[3px] border-l-black pl-3 -ml-3"
                  : "flex items-center border-b-2 border-black py-4 font-sans text-sm font-medium uppercase tracking-widest text-muted hover:text-black transition-colors"
              }
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer stats */}
      <div className="px-6 py-6 border-t-[3px] border-black">
        <div className="border-b-2 border-black pb-4 mb-4">
          <p className="font-sans text-sm text-muted">
            {items?.length ?? "—"} items
          </p>
          <p className="font-sans text-sm text-muted">
            {wornThisWeek} worn this week
          </p>
        </div>
        <button
          id="logout-btn"
          onClick={handleLogout}
          className="font-sans text-sm uppercase tracking-widest text-muted hover:text-black transition-colors"
        >
          Log out →
        </button>
      </div>
    </aside>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      {/* Main content offset by sidebar width */}
      <main className="ml-[220px] min-h-screen border-l-[3px] border-black">
        {children}
      </main>
    </div>
  );
}
