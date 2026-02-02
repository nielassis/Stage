"use client";

import React, { useState } from "react";
import { Sidebar } from "../layout/sidebar";
import { Me } from "@/src/utils/auth/types";

interface DashboardWrapperProps {
  children: React.ReactNode;
  me: Me;
}

export default function DashboardWrapper({
  children,
  me,
}: DashboardWrapperProps) {
  const [navbarIsOpen, setNavbarIsOpen] = useState(false);

  function toogleNavbarOpen(newValue: boolean) {
    setNavbarIsOpen(newValue);
  }

  return (
    <>
      <Sidebar
        navbarIsOpen={navbarIsOpen}
        toogleNavbarOpen={toogleNavbarOpen}
        onLogout={() => {}}
        me={me}
      />
      <div className="flex max-w-full overflow-x-auto flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 space-y-4">
          {children}
        </main>
      </div>
    </>
  );
}
