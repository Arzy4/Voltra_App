"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../../lib/apiFetch";

type Booking = {
  id: number;
  bookingCode: string;
  slotId: number;
  startTime: string;
  endTime: string;
  estimatedKwh?: number;
  estimatedCost?: number;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "ONGOING"
    | "COMPLETED"
    | "CANCELLED";
};

export default function ActivePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await apiFetch("/bookings");

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch bookings."
          );
        }

        setBookings(result.data ?? result);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const now = new Date();

  const activeBookings = bookings.filter((booking) => {
    const endTime = new Date(booking.endTime);

    return (
      ["PENDING", "CONFIRMED", "ONGOING"].includes(booking.status) &&
      endTime > now
    );
  });

  return (
      <section className="px-6 py-8">
        {isLoading ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <p className="text-text-secondary">
              Loading bookings...
            </p>
          </div>
        ) : activeBookings.length === 0 ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="mb-6 text-6xl">⚡</div>

            <h2 className="text-2xl font-bold text-primary-green">
              No Active Booking
            </h2>

            <p className="mt-2 max-w-sm text-text-secondary">
              You don't have any active charging session yet.
              Book a charging station to get started.
            </p>

            <Link
              href="/stationPage"
              className="mt-8 rounded-xl bg-primary-green px-6 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Find Charging Station
            </Link>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {activeBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-text-secondary">
                      Booking Code
                    </p>

                    <h2 className="text-xl font-bold">
                      {booking.bookingCode}
                    </h2>
                  </div>

                  <span className="rounded-full bg-[#c2f3db] px-4 py-1 text-sm font-semibold text-primary-green">
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