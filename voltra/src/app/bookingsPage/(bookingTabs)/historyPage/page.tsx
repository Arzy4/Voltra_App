"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../../lib/apiFetch";

type Booking = {
  id: number;
  bookingCode: string;
  startTime: string;
  endTime: string;
  estimatedKwh: string | number | null;
  estimatedCost: string | number | null;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "ONGOING"
    | "COMPLETED"
    | "CANCELLED";
};

export default function HistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getBookingStatusStyle = (status: Booking["status"]) => {
    if (status === "PENDING") {
      return "bg-orange-100 text-orange-600";
    }

    if (status === "CANCELLED") {
      return "bg-red-100 text-red-600";
    }

    return "bg-[#c2f3db] text-primary-green";
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await apiFetch("/bookings");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to retrieve booking history."
          );
        }

        setBookings(result.data);
      } catch (error) {
        console.error("Failed to retrieve booking history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const now = new Date();

  const historyBookings = bookings.filter((booking) => {
  const endTime = new Date(booking.endTime);

  return (
    endTime <= now ||
    ["COMPLETED", "CANCELLED"].includes(booking.status)
  );
}); 

  return (
    <section className="px-6 py-8">
      {isLoading ? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-text-secondary">
            Loading booking history...
          </p>
        </div>
      ) : historyBookings.length === 0 ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="mb-6 text-6xl">📄</div>

          <h2 className="text-2xl font-bold text-primary-green">
            No Booking History
          </h2>

          <p className="mt-2 max-w-sm text-text-secondary">
            You haven&apos;t completed any charging sessions yet.
            Your booking history will appear here after your sessions are finished.
          </p>

          <Link
            href="/stationPage"
            className="mt-8 rounded-xl bg-primary-green px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Book a Charging Station
          </Link>
        </div>
      ) : (
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {historyBookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 sm:gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-text-secondary">
                    Booking Code
                  </p>

                  <h2 className="whitespace-nowrap text-base sm:text-xl font-bold">
                    {booking.bookingCode}
                  </h2>
                </div>

                <span 
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold sm:px-4 sm:text-sm ${getBookingStatusStyle(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-text-secondary">
                    Start Time
                  </p>

                  <p className="font-medium">
                    {new Date(booking.startTime).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-text-secondary">
                    End Time
                  </p>

                  <p className="font-medium">
                    {new Date(booking.endTime).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-text-secondary">
                    Estimated Energy
                  </p>

                  <p className="font-medium">
                    {booking.estimatedKwh ?? "-"} kWh
                  </p>
                </div>

                <div>
                  <p className="text-sm text-text-secondary">
                    Estimated Cost
                  </p>

                  <p className="font-medium">
                    Rp{" "}
                    {Number(
                      booking.estimatedCost ?? 0
                    ).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <Link
                href={`/bookingsPage/${booking.id}`}
                className="mt-6 block w-full rounded-xl bg-primary-green px-6 py-3 text-center font-semibold text-white transition hover:opacity-90"
              >
                View Booking Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}