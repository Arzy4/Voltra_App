"use client";

import { useParams } from "next/navigation";
import { apiFetch } from "../../lib/apiFetch";
import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "@/app/components/footer";

type BookingDetail = {
  id: number;
  bookingCode: string;
  startTime: string;
  endTime: string;
  estimatedKwh: string;
  estimatedCost: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "ONGOING"
    | "COMPLETED"
    | "CANCELLED";

  slot: {
    id: number;
    slotCode: string;
    chargerType: "NORMAL" | "FAST" | "ULTRA";
    powerKw: number;
    pricePerKwh: string;

    station: {
      id: number;
      name: string;
      location: string;
      area: string;
      address: string;
    };
  };

  payment: {
    id: number;
    amount: string;
    status: string;
    paymentMethod: string;
  } | null;
};


export default function BookingDetailPage() {
  const params = useParams();

  const rawBookingId = params.id;

  const bookingId = Array.isArray(rawBookingId)
    ? rawBookingId[0]
    : rawBookingId;

  const [booking, setBooking] =
    useState<BookingDetail | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId || !/^\d+$/.test(bookingId)) {
        console.error("Invalid booking ID:", bookingId);
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiFetch(
          `/bookings/${bookingId}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to fetch booking details."
          );
        }

        setBooking(result.data);
      } catch (error) {
        console.error(
          "Failed to fetch booking details:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-text-secondary">
          Loading booking details...
        </p>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-text-secondary">
          Booking not found.
        </p>
      </main>
    );
  }

  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);
  const isExpired = endTime <= new Date();

  const durationMinutes =
    (endTime.getTime() - startTime.getTime()) /
    (1000 * 60);

  const isActiveBooking =
    !isExpired &&
    ["PENDING", "CONFIRMED", "ONGOING"].includes(booking.status);

  const backToBookingsHref = isActiveBooking
    ? "/bookingsPage/activePage"
    : "/bookingsPage/historyPage";

  return (
    <main className="min-h-screen bg-background pb-16">
    <>
      {/* HEADER */}
      <section className="rounded-b-[24px] bg-primary-green px-6 py-6 text-white">
        <div className="mx-auto max-w-3xl flex flex-col justify-items-center">

          {/* BACK TO BOOKINGS */}
          <Link
            href={backToBookingsHref}
            className="my-4 inline-flex w-fit cursor-pointer items-center gap-2 text-sm font-semibold text-white transition hover:opacity-70"
          >
            <span>←</span>
            Back to Bookings
          </Link>

          {/* BOOKING HEADER */}
          <div className="mt-2 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm opacity-80">
                Booking Details
              </p>

              <h1 className="mt-1 text-2xl font-bold">
                {booking.bookingCode}
              </h1>
            </div>

            <span className="rounded-full bg-white px-4 py-1 text-lg font-semibold text-primary-green mt-8">
              {booking.status}
            </span>
          </div>

          <p className="mt-4 text-sm opacity-90">
            Your charging reservation details and
            payment information.
          </p>
        </div>
      </section>

      {/* BOOKING DETAILS */}
      <section className="mx-auto max-w-2xl space-y-5 px-6 py-8">
        {/* STATION */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-primary-green">
            Charging Location
          </h2>

          <div className="mt-5">
            <p className="font-semibold">
              {booking.slot.station.name}
            </p>

            <p className="mt-1 text-sm text-text-secondary">
              {booking.slot.station.location}
            </p>

            <p className="mt-1 text-sm text-text-secondary">
              {booking.slot.station.address}
            </p>
          </div>
        </div>

        {/* CHARGING INFO */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-primary-green">
            Charging Information
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-5 text-center sm:grid-cols-4">
            <div>
              <p className="text-sm text-text-secondary">
                Charging Slot
              </p>

              <p className="mt-1 font-semibold">
                {booking.slot.slotCode}
              </p>
            </div>

            <div>
              <p className="text-sm text-text-secondary">
                Charger Type
              </p>

              <p className="mt-1 font-semibold">
                {booking.slot.chargerType}
              </p>
            </div>

            <div>
              <p className="text-sm text-text-secondary">
                Power
              </p>

              <p className="mt-1 font-semibold">
                {booking.slot.powerKw} kW
              </p>
            </div>

            <div>
              <p className="text-sm text-text-secondary">
                Price
              </p>

              <p className="mt-1 font-semibold">
                Rp{" "}
                {Number(
                  booking.slot.pricePerKwh
                ).toLocaleString("id-ID")}
                /kWh
              </p>
            </div>
          </div>
        </div>

        {/* SCHEDULE */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-primary-green">
            Charging Schedule
          </h2>

          <div className="mt-5 space-y-4">
            <div className="flex justify-between gap-4">
              <span className="text-text-secondary">
                Date
              </span>

              <span className="font-semibold">
                {startTime.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-text-secondary">
                Start Time
              </span>

              <span className="font-semibold">
                {startTime.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-text-secondary">
                End Time
              </span>

              <span className="font-semibold">
                {endTime.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-text-secondary">
                Duration
              </span>

              <span className="font-semibold">
                {durationMinutes} minutes
              </span>
            </div>
          </div>
        </div>

        {/* COST */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-primary-green">
            Cost Summary
          </h2>

          <div className="mt-5 space-y-4">
            <div className="flex justify-between gap-4">
              <span className="text-text-secondary">
                Estimated Energy
              </span>

              <span className="font-semibold">
                {booking.estimatedKwh} kWh
              </span>
            </div>

            <div className="flex justify-between gap-4 border-t border-border-soft pt-4">
              <span className="font-semibold">
                Estimated Cost
              </span>

              <span className="text-lg font-bold text-primary-green">
                Rp{" "}
                {Number(
                  booking.estimatedCost
                ).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* PAYMENT */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-primary-green">
            Payment
          </h2>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-text-secondary">
              Payment Status
            </span>

            <span className="rounded-full bg-[#c2f3db] px-4 py-1 text-sm font-semibold text-primary-green">
              {booking.payment?.status ?? "NOT PAID"}
            </span>
          </div>

          {booking.status === "PENDING" && !isExpired ? (
            <Link
              href={`/payment/${booking.id}`}
              className="mt-6 block w-full rounded-xl bg-primary-green px-6 py-3 text-center font-semibold text-white transition hover:opacity-90"
            >
              Proceed to Payment
            </Link>
          ) : booking.status === "PENDING" && isExpired ? (
            <button
              type="button"
              disabled
              className="mt-6 w-full cursor-not-allowed rounded-xl bg-gray-300 px-6 py-3 text-center font-semibold text-gray-500"
            >
              Booking Expired
            </button>
          ) : null}
        </div>
      </section>
      
      <Footer />
      </>
    </main>
  );
}