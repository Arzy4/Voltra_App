"use client";

import {
  Banknote,
  CalendarDays,
  CalendarPlus,
  CircleCheckBig,
  MapPin,
  Zap,
} from "lucide-react";

import ChargingTypePerformance from "./chargingTypePerformance";
import PaymentStatus from "./paymentStatus";
import RevenueOverview from "./revenueOverview";

const dashboardStats = [
  {
    title: "Total Revenue",
    value: "Rp 37.45M",
    icon: Banknote,
    background: "bg-[#E3FFF1]",
  },
  {
    title: "Total Bookings",
    value: "257",
    icon: CalendarDays,
    background: "bg-[#FFF4E5]",
  },
  {
    title: "New Bookings",
    value: "72",
    icon: CalendarPlus,
    background: "bg-[#EEF4FF]",
  },
  {
    title: "Completed Bookings",
    value: "185",
    icon: CircleCheckBig,
    background: "bg-[#F3EEFF]",
  },
  {
    title: "Available Stations",
    value: "18",
    icon: MapPin,
    background: "bg-[#FFF0F0]",
  },
  {
    title: "Available Charging Slots",
    value: "156",
    icon: Zap,
    background: "bg-[#F0F9F4]",
  },
];

export default function Dashboard() {
  return (
    <div className="flex h-full min-h-0 flex-col">

        {/* HEADER */}
        <div className="shrink-0">
            <h1 className="text-2xl font-bold text-primary-green">
            Welcome, Admin 👋
            </h1>

            <p className="mt-1 text-sm text-gray-500">
            Manage and monitor the VOLTRA charging network.
            </p>
        </div>

        {/* DASHBOARD CONTENT */}
        <div className="mt-5 flex min-h-0 flex-1 flex-col gap-4">

            {/* TOP SECTION */}
            <div className="grid h-[350px] grid-cols-[1.9fr_0.8fr] gap-4">

                {/* LEFT SIDE */}
                <div className="grid grid-cols-[1fr_1fr] gap-3">

                    {/* KPI CARDS */}
                    <div className="grid grid-cols-2 grid-rows-3 gap-3">
                    {dashboardStats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                        <div
                            key={stat.title}
                            className={`${stat.background} flex flex-col justify-between rounded-2xl p-4`}
                        >
                            <div className="flex items-center justify-start gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/70">
                                    <Icon
                                    size={13}
                                    className="text-primary-green"
                                    />
                                </div>

                                <p className="text-xs font-semibold text-gray-600">
                                    {stat.title}
                                </p>
                            </div>

                            <p className="text-2xl font-bold text-gray-900">
                            {stat.value}
                            </p>
                        </div>
                        );
                    })}
                    </div>

                    {/* CHARGING TYPE PERFORMANCE */}
                    <ChargingTypePerformance />

                </div>

                {/* RIGHT SIDE */}
                <PaymentStatus />

            </div>
            
            {/* REVENUE OVERVIEW */}
            <div className="min-h-0 flex-1">
                <RevenueOverview />
            </div>

        </div>

    </div>
  );
}