"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  BarChart,
  X,
  Users,
  Building2,
  ContactRound,
  FileText,
  LogOut,
  EllipsisVertical,
} from "lucide-react";

import { Me, UserRole } from "@/src/utils/auth/types";

import Logo from "./logo";
import { cn } from "@/src/lib/utils";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Skeleton } from "../../ui/skeleton";
import { Button } from "../../ui/button";
import { getAvatarLetters } from "@/src/utils/userContext/getAvatarImage";

const sidebarNavItems = [
  {
    title: "Início",
    href: "/dashboard",
    icon: Home,
    minRole: UserRole.COLLABORATOR,
  },
  {
    title: "Usuários",
    href: "/dashboard/users",
    icon: Users,
    minRole: UserRole.SUPERVISOR,
  },
  {
    title: "Clientes",
    href: "/dashboard/customers",
    icon: ContactRound,
    minRole: UserRole.ADMIN,
  },
  {
    title: "Os",
    href: "/dashboard/os",
    icon: FileText,
    minRole: UserRole.COLLABORATOR,
  },
  {
    title: "Relatórios",
    href: "/dashboard/reports",
    icon: BarChart,
    minRole: UserRole.COLLABORATOR,
  },
  {
    title: "Empresa",
    href: "/dashboard/tenant",
    icon: Building2,
    minRole: UserRole.ADMIN,
  },
];

export const RoleHierarchy = {
  [UserRole.COLLABORATOR]: 1,
  [UserRole.SUPERVISOR]: 2,
  [UserRole.ADMIN]: 3,
  [UserRole.PLATFORM_ADMIN]: 4,
} as const;

function canAccess(userRole: UserRole, minRole: UserRole) {
  return RoleHierarchy[userRole] >= RoleHierarchy[minRole];
}

interface SidebarProps {
  navbarIsOpen: boolean;
  toogleNavbarOpen: (newValue: boolean) => void;
  me: Me | null;
  onLogout: () => void;
}

export function Sidebar({
  navbarIsOpen,
  toogleNavbarOpen,
  me,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {navbarIsOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => toogleNavbarOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed z-50 top-0 left-0 h-full w-64 md:w-full bg-card border-r shadow-lg transform transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 md:shadow-none flex flex-col justify-between",
          navbarIsOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4 lg:h-15 lg:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg text-foreground-strong"
          >
            <Logo />
          </Link>

          <button
            className="md:hidden p-1 rounded-full hover:bg-muted"
            onClick={() => toogleNavbarOpen(false)}
          >
            <X className="h-5 w-5 text-foreground-strong" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 lg:px-4 space-y-0.5 text-sm font-medium">
          <p className="text-muted-foreground text-xs my-2">Menu principal</p>
          {!me
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded-md my-1" />
              ))
            : sidebarNavItems.map((item, index) => {
                if (!canAccess(me.role, item.minRole)) return null;

                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);

                const Icon = item.icon;

                return (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={() => toogleNavbarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 border border-transparent rounded-lg px-3 py-2 transition-all duration-150 hover:text-primary hover:bg-primary/5",
                      isActive
                        ? "bg-primary/5 border-primary/30 text-primary font-semibold"
                        : "text-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                );
              })}
        </nav>

        {me && (
          <div className="border-t border-border p-4 flex  items-center gap-2">
            <Link
              href="/user/config"
              className="flex items-center gap-3 w-full hover:bg-muted rounded-md p-2 transition"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="h-8 w-8 text-xs bg-muted-foreground/70">
                  {getAvatarLetters(me.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex flex-col">
                <span className="font-medium text-sm">{me.name}</span>
                <span className="text-[10px] text-muted-foreground block">
                  {me.email}
                </span>
              </div>
            </Link>
            <Button
              variant="outline"
              size="icon-sm"
              className="flex items-center justify-center gap-2 mt-2 border-none shadow-none"
              onClick={onLogout}
            >
              <LogOut className="h-2 w-2" />
            </Button>
          </div>
        )}
      </div>

      {!navbarIsOpen && (
        <>
          <Button
            className="fixed top-2 right-0 z-50 p-3 shadow-md md:hidden rounded-e-lg"
            variant="outline"
            onClick={() => toogleNavbarOpen(true)}
          >
            <EllipsisVertical className="h-5 w-5" />
          </Button>
        </>
      )}
    </>
  );
}
