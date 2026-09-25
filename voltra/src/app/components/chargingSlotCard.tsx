"use client";

import { useState } from "react";

type ChargingSlotCardProps = {
  slotCode?: string;
  type: string;
  power?: number;
  pricePerKwh?: number;

  isPresetBooking?: boolean;
  vehicleName?: string;
  initialDurationMinutes?: number;

  onBack: () => void;
  onClose: () => void;

  onContinue: (
    selectedDate: string,
    startTime: string,
    durationMinutes: number
  ) => void;
};

export default function ChargingSlotCard({
  slotCode,
  type,
  power,
  pricePerKwh,
  isPresetBooking = false,
  vehicleName,
  initialDurationMinutes,
  onBack,
  onClose,
  onContinue,
}: ChargingSlotCardProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [durationMinutes, setDurationMinutes] =
    useState<number | null>(initialDurationMinutes ?? null);

  const durationOptions = [
    { label: "30 min", value: 30 },
    { label: "1 hour", value: 60 },
    { label: "1.5 hours", value: 90 },
    { label: "2 hours", value: 120 },
    { label: "3 hours", value: 180 },
    { label: "4 hours", value: 240 },
  ];

  const startTimeOptions = [
  "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30",
  "20:00",
];

  return (
    <>
      {/* SLOT DETAIL HEADER */}
      <div className="flex items-start justify-between gap-3 sm:gap-6">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-4 sm:mb-5 inline-flex items-center gap-1 text-sm sm:text-base font-semibold text-primary-green hover:underline"
          >
            <span className="shrink-0">←</span>
            <span>
              {isPresetBooking
                ? "Back to Vehicle Presets"
                : "Back to Charging Slots"}
            </span>
          </button>

          {isPresetBooking ? (
            <>
              <p className="font-semibold text-primary-green">
                VEHICLE PRESET
              </p>

              <h2 className="mt-1 text-4xl font-bold">
                {vehicleName}
              </h2>

              <p className="mt-2 text-text-secondary">
                {type.charAt(0).toUpperCase() +
                  type.slice(1).toLowerCase()}{" "}
                Charging
                {power !== undefined && ` · ${power} kW`}
              </p>

              {pricePerKwh !== undefined && (
                <p className="mt-1 font-semibold">
                  Rp {pricePerKwh.toLocaleString("id-ID")} / kWh
                </p>
              )}
            </>
          ) : (
            <>
              <p className="font-semibold text-primary-green">
                CHARGING SLOT
              </p>

              <h2 className="mt-1 text-4xl font-bold">
                {slotCode}
              </h2>

              <p className="mt-2 text-text-secondary">
                {type} Charging · {power} kW
              </p>

              <p className="mt-1 font-semibold">
                Rp {pricePerKwh?.toLocaleString("id-ID")} / kWh
              </p>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold duration-300 hover:opacity-70"
        >
          ×
        </button>
      </div>

      <hr className="my-4 border-primary-green/20" />

      {/* CHARGING SCHEDULE */}
      <div>
        <h3 className="text-2xl font-bold">
          Charging Schedule
        </h3>

        <p className="mt-1 text-text-secondary">
          Choose your charging date, start time, and duration.
        </p>

        {/* DATE + START TIME */}
        <div className="mt-6 grid gap-5">
          <div>
            <label className="mb-2 block font-semibold">
              Charging Date
            </label>

            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-xl border border-border-soft bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary-green"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Start Time
            </label>

            <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {startTimeOptions.map((time) => (
                    <button
                    key={time}
                    type="button"
                    onClick={() => setStartTime(time)}
                    className={`rounded-xl border px-4 py-3 font-semibold duration-300 ${
                        startTime === time
                        ? "border-primary-green bg-primary-green text-white"
                        : "border-primary-green/20 bg-white hover:border-primary-green"
                    }`}
                    >
                    {time}
                    </button>
                ))}
            </div>
          </div>
        </div>

        {/* DURATION */}
        <div className="mt-7">
          <label className="block font-semibold">
            Charging Duration
          </label>

          <p className="mt-1 text-sm text-text-secondary">
            How long would you like to reserve this charging slot?
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {durationOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDurationMinutes(option.value)}
                className={`rounded-xl border px-4 py-3 font-semibold duration-300 ${
                  durationMinutes === option.value
                    ? "border-primary-green bg-primary-green text-white"
                    : "border-primary-green bg-white text-primary-green hover:bg-[#c2f3db]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTINUE */}
        <button
          type="button"
          onClick={() => {
                if (durationMinutes === null) return;

                onContinue(
                selectedDate,
                startTime,
                durationMinutes
                );
            }}
          disabled={
            !selectedDate ||
            !startTime ||
            durationMinutes === null
          }
          className="mt-8 w-full rounded-xl bg-primary-green px-6 py-4 font-semibold text-white duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue to Booking Summary
        </button>
      </div>
    </>
  );
}