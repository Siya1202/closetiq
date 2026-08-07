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
    <aside className="fixed bottom-0 left-0 w-full md:top-0 md:h-screen md:w-[220px] bg-cream border-t-[3px] md:border-t-0 md:border-r-[3px] border-black flex md:flex-col z-50">
      {/* Desktop Wordmark */}
      <div className="hidden md:block px-6 py-6 border-b-[3px] border-black">
        <Link href="/closet" className="font-sans text-xl tracking-tight">
          closetiq
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-2 md:px-6 md:py-4 flex md:flex-col overflow-x-auto gap-6 md:gap-0 justify-start">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActive
                  ? "whitespace-nowrap flex items-center md:border-b-2 border-black py-2 md:py-4 font-sans text-xs md:text-sm font-medium uppercase tracking-widest text-black md:border-l-[3px] md:border-l-black md:pl-3 md:-ml-3"
                  : "whitespace-nowrap flex items-center md:border-b-2 border-black py-2 md:py-4 font-sans text-xs md:text-sm font-medium uppercase tracking-widest text-muted hover:text-black transition-colors"
              }
            >
              <span className={isActive ? "border-b-2 border-black md:border-none pb-1 md:pb-0" : ""}>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Desktop Footer stats */}
      <div className="hidden md:block px-6 py-6 border-t-[3px] border-black">
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
    <div className="min-h-screen bg-cream pb-14 md:pb-0">
      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 bg-cream z-40 border-b-[3px] border-black px-4 py-3 flex justify-between items-center">
        <Link href="/closet" className="font-sans text-xl tracking-tight">
          closetiq
        </Link>
        <button
          onClick={() => { clearToken(); router.push("/login"); }}
          className="font-sans text-[10px] uppercase tracking-widest text-muted"
        >
          Log out
        </button>
      </div>

      <Sidebar />
      {/* Main content offset by sidebar width on desktop */}
      <main className="md:ml-[220px] min-h-screen md:border-l-[3px] border-black">
        {children}
      </main>
    </div>
  );
}
