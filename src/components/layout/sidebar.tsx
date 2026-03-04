"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Zap } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/documents", label: "Documents", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-gradient-to-b from-ptba-navy via-ptba-navy to-ptba-navy-dark flex flex-col z-50">
      {/* Brand Header */}
      <div className="px-6 pt-6 pb-5">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-ptba-gold/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-ptba-gold" />
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-wide">
            ENERGIZE
          </h1>
        </div>
        <p className="text-[11px] text-blue-200/60 font-medium tracking-wide pl-[42px] leading-tight">
          EBD Initiatives<br />
          Digitalization Excellence
        </p>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-white/10" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href)) ||
            (item.href === "/dashboard" && (pathname === "/dashboard" || pathname.startsWith("/projects")));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-white/12 text-white"
                  : "text-blue-100/60 hover:text-white hover:bg-white/6"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-ptba-gold rounded-r-full" />
              )}
              <Icon
                className={cn(
                  "w-[18px] h-[18px] transition-colors",
                  isActive ? "text-ptba-gold" : "text-blue-200/40 group-hover:text-blue-200/70"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: PTBA Logo */}
      <div className="px-5 pb-5">
        <div className="mx-2 mb-3 h-px bg-white/10" />
        <div className="flex items-center gap-3 px-2">
          <Image
            src="/ptba-logo.svg"
            alt="PT Bukit Asam"
            width={110}
            height={20}
            className="opacity-70"
          />
        </div>
        <p className="text-[10px] text-blue-200/30 mt-2 px-2">
          PT Bukit Asam Tbk
        </p>
      </div>
    </aside>
  );
}
