"use client";

import { apiFetch } from "@/app/lib/apiFetch";
import {
  LayoutDashboard,
  MapPin,
  Zap,
  CalendarDays,
  Shield,
  LogOut,
} from "lucide-react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type AdminPage =
  | "dashboard"
  | "stations"
  | "slots"
  | "bookings"
  | "security";

type AdminSidebarProps = {
  activePage: AdminPage;
  setActivePage: (page: AdminPage) => void;
};

type User = {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: "USER" | "ADMIN";
};

export default function AdminSidebar({
  activePage,
  setActivePage,
}: AdminSidebarProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const menuItems = [
    {
      id: "dashboard" as AdminPage,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "stations" as AdminPage,
      label: "Manage Stations",
      icon: MapPin,
    },
    {
      id: "slots" as AdminPage,
      label: "Manage Charging Slots",
      icon: Zap,
    },
    {
      id: "bookings" as AdminPage,
      label: "Manage Bookings",
      icon: CalendarDays,
    },
    {
      id: "security" as AdminPage,
      label: "Security",
      icon: Shield,
    },
  ];

  const [modal, setModal] = useState({
    open: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
  });
  
  const showModal = (
    type: "success" | "error",
    title: string,
    message: string
  ) => {
  setModal({
    open: true,
        type,
        title,
        message,
    });
  };

  function handleLogout() {
    setModal({
      open: true,
      type: "error",
      title: "Log Out?",
      message: "Are you sure you want to log out of your VOLTRA account?",
    });
  }

  useEffect(() => {
      const fetchCurrentUser = async () => {
        try {
          const response = await apiFetch("/users/me");
          const result = await response.json();
  
          if (!response.ok) {
            throw new Error(
              result.message || "Failed to retrieve user profile."
            );
          }
  
          setCurrentUser(result.data);
        } catch (error) {
          console.error("Failed to retrieve profile:", error);
          setCurrentUser(null);
        }
      };
  
      const accessToken = localStorage.getItem("accessToken");
  
      if (accessToken) {
        fetchCurrentUser();
      }
    }, []);

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white px-4 py-8">

      {/* PROFILE */}
      <div className="flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-green text-xl font-bold text-white">
          {currentUser?.fullName?.charAt(0).toUpperCase() ?? "A"}
        </div>

        <h2 className="mt-3 font-bold text-gray-900">
          {currentUser?.fullName ?? "Admin"}
        </h2>

        <p className="mt-0.5 text-xs text-gray-500">
          {currentUser?.email ?? ""}
        </p>
      </div>

      <div className="my-5 border-t border-gray-200" />

      {/* NAVIGATION */}
      <nav className="flex flex-1 flex-col gap-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActivePage(item.id)}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                isActive
                  ? "bg-primary-green text-white"
                  : "text-gray-600 hover:bg-[#e3fff1] hover:text-primary-green"
              }`}
            >
              <Icon size={19} />

              {item.label}
            </button>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 justify-center"
        >
          <LogOut size={19} />
          Log Out
        </button>
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">

            <div
              className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full ${
                modal.type === "success"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              <span className="text-2xl">
                {modal.type === "success" ? "✓" : "!"}
              </span>
            </div>

            <h2 className="text-center text-2xl font-bold text-gray-900">
              {modal.type === "success"
                ? "See You Again!"
                : "Log Out?"}
            </h2>

            <p className="mt-3 text-center text-gray-600">
              {modal.type === "success"
                ? "You have been logged out of VOLTRA successfully."
                : "Are you sure you want to log out of your VOLTRA account?"}
            </p>

            {modal.type === "success" ? (
              <button
                type="button"
                onClick={() => {
                  setModal((prev) => ({
                    ...prev,
                    open: false,
                  }));

                  router.push("/");
                }}
                className="mt-7 w-full rounded-xl bg-primary-green px-4 py-3 font-semibold text-white duration-300 hover:opacity-90"
              >
                Back to Home
              </button>
            ) : (
              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setModal((prev) => ({
                      ...prev,
                      open: false,
                    }));
                  }}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 duration-300 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("currentUser");

                    setCurrentUser(null);

                    setModal({
                      open: true,
                      type: "success",
                      title: "See You Again!",
                      message: "You have been logged out of VOLTRA successfully.",
                    });
                  }}
                  className="w-full rounded-xl bg-red-500 px-4 py-3 font-semibold text-white duration-300 hover:bg-red-600"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </aside>
  );
}