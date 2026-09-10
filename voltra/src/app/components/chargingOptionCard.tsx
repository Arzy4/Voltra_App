"use client";

import { useState, useEffect } from "react";
import ChargingSlotCard from "./chargingSlotCard";
import BookingSummary from "./bookingSummary";
import type { ChargingSlot } from "../types/station";

type ChargingOptionCardProps = {
  stationId: number;
  type: string;
  power: number;
  total: number;
  available: number;
  pricePerKwh: number;
  
};

type SelectedSlot = {
  id: number;
  slotCode: string;
};

export default function ChargingOptionCard({
  stationId,
  type,
  power,
  total,
  available,
  pricePerKwh,
}: ChargingOptionCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    const [slots, setSlots] = useState<ChargingSlot[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    useEffect(() => {
      const fetchSlots = async () => {
        try {
          setIsLoadingSlots(true);

          const apiUrl = process.env.NEXT_PUBLIC_API_URL;

          if (!apiUrl) {
            throw new Error("NEXT_PUBLIC_API_URL is not defined.");
          }

          const response = await fetch(`${apiUrl}/charging-slots`);

          if (!response.ok) {
            throw new Error(
              `Failed to fetch charging slots: ${response.status}`
            );
          }

          const result = await response.json();

          setSlots(result.data ?? result);
        } catch (error) {
          console.error("Failed to fetch charging slots:", error);
        } finally {
          setIsLoadingSlots(false);
        }
      };

      fetchSlots();
    }, []);

    const normalizedType =
      type.toUpperCase() as ChargingSlot["chargerType"];

    const filteredSlots = slots.filter(
      (slot) =>
        Number(slot.stationId) === Number(stationId) &&
        slot.chargerType.toUpperCase() === normalizedType
    );

    const [selectedSlot, setSelectedSlot] =
    useState<SelectedSlot | null>(null);

    const usedSlots = total - available;

    const handleOpenModal = () => {
        setSelectedSlot(null);
        setBookingSchedule(null);
        setModalStep("slots");
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedSlot(null);
        setBookingSchedule(null);
        setModalStep("slots");
        setIsOpen(false);
    };

    const [bookingSchedule, setBookingSchedule] = useState<{
        selectedDate: string;
        startTime: string;
        durationMinutes: number;
    } | null>(null);

    const [modalStep, setModalStep] =
    useState<"slots" | "schedule" | "summary">("slots");

  

  return (
    <>
      {/* CHARGING OPTION CARD */}
      <div className="flex flex-col rounded-3xl bg-[#c2f3db] p-7 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-primary-green">
              {type.toUpperCase()} CHARGING
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              {power} kW
            </h3>
          </div>

          <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary-green">
            {available} Available
          </span>
        </div>

        <hr className="my-6 border-primary-green/20" />

        {/* PRICE */}
        <div>
          <p className="text-sm text-text-secondary">
            Price
          </p>

          <p className="mt-1 text-2xl font-bold">
            Rp {pricePerKwh.toLocaleString("id-ID")}
            <span className="text-sm font-normal">
              {" "}/ kWh
            </span>
          </p>
        </div>

        {/* SLOT USAGE */}
        <div className="mt-6">
          <p className="text-sm text-text-secondary">
            Slot Usage
          </p>

          <div className="mt-1 flex items-center justify-between gap-4">
            <p className="font-semibold">
              {available} / {total} available
            </p>

            <p className="text-sm">
              {usedSlots} in use
            </p>
          </div>
        </div>

        {/* OPEN MODAL */}
        <button
          type="button"
          onClick={handleOpenModal}
          className="mt-8 w-full rounded-xl bg-primary-green px-6 py-3 font-semibold text-white duration-300 hover:opacity-90"
        >
          View Charging Slots
        </button>
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="hide-scrollbar max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-[30px] bg-[#e3fff1] p-8 shadow-2xl">

            {/* NO SLOT SELECTED */}
                {modalStep === "slots" && (
                <>
                    {/* POPUP HEADER */}
                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <p className="font-semibold text-primary-green">
                            {type.toUpperCase()} CHARGING
                            </p>

                            <h2 className="mt-1 text-3xl font-bold">
                            Charging Slots
                            </h2>

                            <p className="mt-2 text-text-secondary">
                            {power} kW · Rp{" "}
                            {pricePerKwh.toLocaleString("id-ID")} / kWh
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold duration-300 hover:opacity-70"
                        >
                            ×
                        </button>
                    </div>

                    <hr className="my-6 border-primary-green/20" />

                    {/* CHARGING SLOTS */}
                    <div className="grid gap-4 sm:grid-cols-2">
                    {isLoadingSlots ? (
                      <p className="text-text-secondary">
                          Loading charging slots...
                        </p>
                      ) : filteredSlots.length === 0 ? (
                        <p className="col-span-full text-center text-text-secondary">
                          No charging slots found for this station.
                        </p>
                      ) : (
                        filteredSlots.map((slot) => {
                        const getSlotStatusColor = () => {
                          switch (slot.status) {
                            case "AVAILABLE":
                              return "bg-available text-white";

                            case "OCCUPIED":
                              return "bg-occupied text-white";

                            case "MAINTENANCE":
                              return "bg-maintenance text-white";

                            default:
                              return "bg-gray-300 text-gray-700";
                          }
                        };

                        return (
                          <div
                            key={slot.id}
                            className={`rounded-2xl border p-5 ${
                              slot.status === "AVAILABLE"
                                ? "border-green-300 bg-white"
                                : slot.status === "MAINTENANCE"
                                  ? "border-amber-300 bg-amber-50"
                                  : "border-red-200 bg-red-50"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-sm text-text-secondary">
                                  Charging Slot
                                </p>

                                <h3 className="mt-1 text-2xl font-bold">
                                  {slot.slotCode.split("-").slice(1).join("-")}
                                </h3>
                              </div>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${getSlotStatusColor()}`}
                              >
                                {slot.status}
                              </span>
                            </div>

                            <hr className="my-4 border-gray-200" />

                            <div className="flex items-end justify-between gap-4">
                              <div>
                                <p className="font-semibold">
                                  {type} Charging
                                </p>

                                <p className="text-sm text-text-secondary">
                                  {slot.powerKw} kW
                                </p>

                                <p className="mt-2 text-sm font-semibold">
                                  Rp {slot.pricePerKwh.toLocaleString("id-ID")} / kWh
                                </p>
                              </div>

                              {slot.status === "AVAILABLE" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedSlot({
                                      id: slot.id,
                                      slotCode: slot.slotCode,
                                    });
                                    setModalStep("schedule");
                                  }}
                                  className="rounded-xl bg-primary-green px-5 py-2 font-semibold text-white duration-300 hover:opacity-90"
                                >
                                  Select
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
                )}

                {/* STEP 2: CHARGING SCHEDULE */}
                {modalStep === "schedule" && selectedSlot && (
                <ChargingSlotCard
                    slotCode={selectedSlot.slotCode}
                    type={type}
                    power={power}
                    pricePerKwh={pricePerKwh}
                    onBack={() => {
                    setSelectedSlot(null);
                    setModalStep("slots");
                    }}
                    onClose={handleCloseModal}
                    onContinue={(
                    selectedDate,
                    startTime,
                    durationMinutes
                    ) => {
                    setBookingSchedule({
                        selectedDate,
                        startTime,
                        durationMinutes,
                    });

                    setModalStep("summary");
                    }}
                />
                )}

                {/* STEP 3: BOOKING SUMMARY */}
                {modalStep === "summary" &&
                selectedSlot &&
                bookingSchedule && (
                  <BookingSummary
                    slotCode={selectedSlot.slotCode}
                    type={type}
                    power={power}
                    pricePerKwh={pricePerKwh}
                    selectedDate={bookingSchedule.selectedDate}
                    startTime={bookingSchedule.startTime}
                    durationMinutes={bookingSchedule.durationMinutes}
                    onBack={() => setModalStep("schedule")}
                    onClose={handleCloseModal}
                    onConfirm={async () => {
                      const bookingData = {
                        slotId: selectedSlot.id,
                        startTime: `${bookingSchedule.selectedDate}T${bookingSchedule.startTime}:00`,
                        durationMinutes: bookingSchedule.durationMinutes,
                      };

                      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                      const accessToken = localStorage.getItem("accessToken");

                      if (!apiUrl) {
                        throw new Error("NEXT_PUBLIC_API_URL is not defined.");
                      }

                      if (!accessToken) {
                        alert("Please login first.");
                        return;
                      }

                      const response = await fetch(`${apiUrl}/bookings`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify(bookingData),
                      });

                      const result = await response.json();

                      console.log("Booking response:", result);
                    }}
                  />
                )}
            </div>
        </div>
      )}
    </>
  );
}