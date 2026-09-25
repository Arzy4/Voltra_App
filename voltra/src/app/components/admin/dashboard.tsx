"use client";

import {
  Banknote,
  CalendarDays,
  CalendarPlus,
  CircleCheckBig,
  MapPin,
  Zap,
} from "lucide-react";

import { useEffect, useState } from "react";
import ChargingTypePerformance from "./chargingTypePerformance";
import PaymentStatus from "./paymentStatus";
import RevenueOverview from "./revenueOverview";

interface DashboardData {
  kpi: {
    id: number;
    totalRevenue: number;
    totalBookings: number;
    newBookings: number;
    completedBookings: number;
    availableStations: number;
    availableChargingSlots: number;
  };

  chargingTypePerformance: {
    id: number;
    type: "NORMAL" | "FAST" | "ULTRA";
    bookings: number;
    revenue: number;
  }[];

  paymentStatus: {
    id: number;
    status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
    value: number;
  }[];

  revenueOverview: {
    id: number;
    month: string;
    revenue: number;
  }[];
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data: DashboardData = await response.json();

        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const dashboardStats = dashboardData
  ? [
      {
        title: "Total Revenue",
        value: `Rp ${(dashboardData.kpi.totalRevenue / 1_000_000).toFixed(2)}M`,
        icon: Banknote,
        background: "bg-[#E3FFF1]",
      },
      {
        title: "Total Bookings",
        value: dashboardData.kpi.totalBookings.toString(),
        icon: CalendarDays,
        background: "bg-[#FFF4E5]",
      },
      {
        title: "New Bookings",
        value: dashboardData.kpi.newBookings.toString(),
        icon: CalendarPlus,
        background: "bg-[#EEF4FF]",
      },
      {
        title: "Completed Bookings",
        value: dashboardData.kpi.completedBookings.toString(),
        icon: CircleCheckBig,
        background: "bg-[#F3EEFF]",
      },
      {
        title: "Available Stations",
        value: dashboardData.kpi.availableStations.toString(),
        icon: MapPin,
        background: "bg-[#FFF0F0]",
      },
      {
        title: "Available Charging Slots",
        value: dashboardData.kpi.availableChargingSlots.toString(),
        icon: Zap,
        background: "bg-[#F0F9F4]",
      },
    ]
  : [];

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-red-500">
          Failed to load dashboard data.
        </p>
      </div>
    );
  }

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
                    <ChargingTypePerformance
                      data={dashboardData.chargingTypePerformance}
                    />

                </div>

                {/* RIGHT SIDE */}
                <PaymentStatus
                  data={dashboardData.paymentStatus}
                />

            </div>
            
            {/* REVENUE OVERVIEW */}
            <div className="min-h-0 flex-1">
                <RevenueOverview 
                  data={dashboardData.revenueOverview}
                />
            </div>

        </div>

    </div>
  );
}