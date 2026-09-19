"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type BookingSummaryProps = {
  slotCode: string;
  type: string;
  power: number;
  pricePerKwh: number;
  selectedDate: string;
  startTime: string;
  durationMinutes: number;
  onBack: () => void;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export default function BookingSummary({
  slotCode,
  type,
  power,
  pricePerKwh,
  selectedDate,
  startTime,
  durationMinutes,
  onBack,
  onClose,
  onConfirm,
}: BookingSummaryProps) {
  const router =useRouter();

  const durationHours = durationMinutes / 60;

  const estimatedKwh = power * durationHours;

  const estimatedTotal = estimatedKwh * pricePerKwh;

  const formatDuration = () => {
    if (durationMinutes === 30) return "30 minutes";
    if (durationMinutes === 60) return "1 hour";
    if (durationMinutes === 90) return "1.5 hours";
    if (durationMinutes === 120) return "2 hours";

    return `${durationMinutes} minutes`;
  };

  const calculateEndTime = () => {
    const [hours, minutes] = startTime.split(":").map(Number);

    const start = new Date();
    start.setHours(hours, minutes, 0, 0);

    start.setMinutes(start.getMinutes() + durationMinutes);

    return start.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

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

  const handleConfirmBooking = async () => {
    try {
      await onConfirm();

      showModal(
        "success",
        "Booking Confirmed!",
        "Your charging slot has been booked successfully."
      );
    } catch (error) {
      showModal(
        "error",
        "Booking Failed",
        error instanceof Error
          ? error.message
          : "We couldn't create your booking. Please try again."
      );
    }
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3 sm:gap-6">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-4 sm:mb-5 inline-flex items-center gap-1 text-sm sm:text-base font-semibold text-primary-green hover:underline"
          >
            <span className="shrink-0">←</span>
            <span>Back to Charging Slots</span>
          </button>

          <h2 className="mt-1 text-3xl font-bold">
            Booking Summary
          </h2>

          <p className="mt-2 text-text-secondary">
            Review your charging reservation before confirming.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold duration-300 hover:opacity-70"
        >
          ×
        </button>
      </div>

      <hr className="my-6 border-primary-green/20" />

      {/* CHARGING DETAILS */}
      <div>
        <h3 className="text-xl font-bold">
          Charging Details
        </h3>

        <div className="mt-3 grid grid-cols-1 gap-4 rounded-2xl bg-white p-4 sm:grid-cols-2 sm:gap-5 sm:p-5">
          <div className="flex items-center justify-between gap-4 lg:block">
            <p className="text-sm text-text-secondary">
              Charging Slot
            </p>

            <p className="lg:mt-1 font-bold">
              {slotCode}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 lg:block">
            <p className="text-sm text-text-secondary">
              Charger Type
            </p>

            <p className="lg:mt-1 font-bold">
              {type}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 lg:block">
            <p className="text-sm text-text-secondary">
              Charging Power
            </p>

            <p className="lg:mt-1 font-bold">
              {power} kW
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 lg:block">
            <p className="text-sm text-text-secondary">
              Price
            </p>

            <p className="lg:mt-1 font-bold">
              Rp {pricePerKwh.toLocaleString("id-ID")} / kWh
            </p>
          </div>
        </div>
      </div>

      {/* SCHEDULE */}
      <div className="mt-6">
        <h3 className="text-xl font-bold">
          Schedule
        </h3>

        <div className="mt-3 grid grid-cols-1 gap-4 rounded-2xl bg-white p-4 sm:grid-cols-2 sm:gap-5 sm:p-5">
          <div className="flex items-center justify-between gap-4 lg:block">
            <p className="text-sm text-text-secondary">
              Date
            </p>

            <p className="lg:mt-1 font-bold">
              {selectedDate}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 lg:block">
            <p className="text-sm text-text-secondary">
              Start Time
            </p>

            <p className="lg:mt-1 font-bold">
              {startTime}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 lg:block">
            <p className="text-sm text-text-secondary">
              Duration
            </p>

            <p className="lg:mt-1 font-bold">
              {formatDuration()}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 lg:block">
            <p className="text-sm text-text-secondary">
              End Time
            </p>

            <p className="lg:mt-1 font-bold">
              {calculateEndTime()}
            </p>
          </div>
        </div>
      </div>

      {/* PRICE SUMMARY */}
      <div className="mt-6">
        <h3 className="text-xl font-bold">
          Price Summary
        </h3>

        <div className="mt-3 rounded-2xl bg-[#c2f3db] p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-text-secondary">
              Price / kWh
            </p>

            <p className="font-semibold">
              Rp {pricePerKwh.toLocaleString("id-ID")}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-text-secondary">
              Estimated Energy
            </p>

            <p className="font-semibold">
              {estimatedKwh.toFixed(1)} kWh
            </p>
          </div>

          <hr className="my-4 border-primary-green/20" />

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4 text-center">
            <p className="text-base sm:text-lg font-bold">
              Estimated Total
            </p>

            <p className="text-xl sm:text-2xl font-bold text-primary-green">
              Rp {estimatedTotal.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-text-secondary">
        * Final cost may depend on the actual energy consumed.
      </p>

      {/* CONFIRM */}
      <button
        type="button"
        onClick={handleConfirmBooking}
        className="mt-6 w-full rounded-xl bg-primary-green px-6 py-4 font-semibold text-white duration-300 hover:opacity-90"
      >
        Confirm Booking
      </button>

      {/* MODAL POP UP */}
      {/* Before and After Confirmation Pop Up */}
      {modal.open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">

            <div
              className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full ${
                modal.type === "success"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              <span className="text-2xl">
                {modal.type === "success" ? "✓" : "✕"}
              </span>
            </div>

            <h2 className="text-center text-2xl font-bold text-gray-900">
              {modal.title}
            </h2>

            <p className="mt-3 text-center text-gray-600">
              {modal.message}
            </p>

            <button
              type="button"
              onClick={() => {
                setModal((prev) => ({
                  ...prev,
                  open: false,
                }));

                if (modal.type === "success") {
                  const bookingId = localStorage.getItem("latestBookingId");

                  if (bookingId) {
                    router.push(`/payment/${bookingId}`);
                  }
                }
              }}
              className={`mt-7 w-full rounded-xl px-4 py-3 font-semibold text-white duration-300 ${
                modal.type === "success"
                  ? "bg-primary-green hover:opacity-90"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {modal.type === "success" ? "Proceed To Payment" : "Try Again"}
            </button>

          </div>
        </div>
      )}
    </>
  );
}