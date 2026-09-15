"use client";

import { useState } from "react";
import AdminSidebar from "../components/admin/sideBar";
import Dashboard from "../components/admin/dashboard";
import ManageStations from "../components/admin/manageStations";
import ManageChargingSlots from "../components/admin/manageChargingSlots";
import ManageBookings from "../components/admin/manageBookings";
import type { AdminPage as AdminPageType } from "../components/admin/sideBar";

export default function AdminPage() {
  const [activePage, setActivePage] =
    useState<AdminPageType>("dashboard");

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#f7faf8]">

      {/* LEFT SIDEBAR */}
      <AdminSidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* RIGHT CONTENT */}
      <section className="h-screen min-w-0 flex-1 overflow-hidden px-4 py-1">
        <section className="h-screen min-w-0 flex-1 overflow-hidden p-5">
            {activePage === "dashboard" && <Dashboard />}

            {activePage === "stations" && <ManageStations />}

            {activePage === "slots" && <ManageChargingSlots />}

            {activePage === "bookings" && <ManageBookings />}
        </section>
      </section>

    </main>
  );
}