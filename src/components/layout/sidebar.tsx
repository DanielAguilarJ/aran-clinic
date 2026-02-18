"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Scissors,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_LINKS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Citas", href: "/admin/citas", icon: Calendar },
  { label: "Horarios", href: "/admin/horarios", icon: Clock },
  { label: "Servicios", href: "/admin/servicios", icon: Scissors },
  { label: "Complementos", href: "/admin/complementos", icon: Sparkles },
  { label: "Calendario", href: "/admin/calendario", icon: Calendar },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      {/* ── Brand ── */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <span className="font-serif text-lg font-bold text-charcoal-900">
          ARAN ADMIN
        </span>
      </div>

      {/* ── Navigation links ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {ADMIN_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-gold-50 text-gold-primary"
                      : "text-charcoal-700 hover:bg-cream-100 hover:text-charcoal-900"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Back to site ── */}
      <div className="border-t border-gray-200 p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal-700 transition-colors hover:bg-cream-100"
        >
          <ArrowLeft className="h-5 w-5 shrink-0" />
          Volver al sitio
        </Link>
      </div>
    </aside>
  );
}
