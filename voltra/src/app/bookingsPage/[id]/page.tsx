"use client";

import { useParams } from "next/navigation";
import { apiFetch } from "../../lib/apiFetch";
import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "@/app/components/footer";
import { useRouter } from "next/navigation";

type BookingDetail = {
  id: number;
  bookingCode: string;
  startTime: string;
  endTime: string;
  estimatedKwh: string;
  estimatedCost: string;
  netPaidAmount?: number;

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

type Station = {
  id: number;
  name: string;
  location: string;
  area: string;
  address: string;

   slots: {
    id: number;
    slotCode: string;
    chargerType: "NORMAL" | "FAST" | "ULTRA";
    powerKw: number;
    pricePerKwh: number;
    status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
  }[];
};


export default function BookingDetailPage() {
  const router = useRouter();
  
  const params = useParams();

  const rawBookingId = params.id;

  const bookingId = Array.isArray(rawBookingId)
    ? rawBookingId[0]
    : rawBookingId;

  const [booking, setBooking] =
    useState<BookingDetail | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [showUpdateModal, setShowUpdateModal] =
    useState(false);

  const [showSaveConfirmation, setShowSaveConfirmation] =
    useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const [stations, setStations] = useState<Station[]>([]);

  const [selectedStationId, setSelectedStationId] =
    useState<number>(0);

  const [selectedSlotId, setSelectedSlotId] =
    useState<number>(0);

  const [editStartTime, setEditStartTime] =
    useState("");

  const [editDuration, setEditDuration] =
    useState<number>(60);

  const [isCancelling, setIsCancelling] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);

  const [isCancellationSuccess, setIsCancellationSuccess] =
    useState(false);

  const getBookingStatusStyle = (status: BookingDetail["status"]) => {
    if (status === "PENDING") {
      return "bg-orange-100 text-orange-600";
    }

    if (status === "CANCELLED") {
      return "bg-red-100 text-red-600";
    }

    return "bg-[#c2f3db] text-primary-green";
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

  const handleSaveChanges = async () => {
    if (
      !booking ||
      !selectedSlotId ||
      !editStartTime
    ) {
      return;
    }

    try {
      setIsSaving(true);

      const response = await apiFetch(
        `/bookings/${booking.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slotId: selectedSlotId,
            startTime: new Date(editStartTime).toISOString(),
            durationMinutes: editDuration,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update booking."
        );
      }

      if (
        result.paymentAdjustment?.type === "ADDITIONAL_PAYMENT" &&
        result.paymentAdjustment?.adjustmentId
      ) {
        setShowSaveConfirmation(false);
        setShowUpdateModal(false);

        router.push(
          `/payment/adjustment/${result.paymentAdjustment.adjustmentId}`
        );

        return;
      }

      setShowSaveConfirmation(false);
      setShowUpdateModal(false);

      showModal(
        "success",
        "Booking Updated",
        `Booking ${booking.bookingCode} updated successfully`
      );

    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update booking.";

      // Close confirmation modal
      setShowSaveConfirmation(false);

      // Show result modal
      showModal(
        "error",
        "Update Failed",
        message
      );

    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;

    try {
      setIsCancelling(true);

      const response = await apiFetch(`/bookings/${booking.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "CANCELLED",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to cancel booking."
        );
      }

      setBooking((prev) =>
        prev
          ? {
              ...prev,
              status: "CANCELLED",
            }
          : prev
      );

      setShowCancelModal(false);
      setIsCancellationSuccess(true);

      const refundedAmount = booking.payment?.status === "PAID"
        ? Number(
            booking.netPaidAmount ??
            booking.payment.amount
          )
        : 0;

      showModal(
        "success",
        "Booking Cancelled",
        refundedAmount > 0
          ? `Booking ${booking.bookingCode} has been cancelled. Rp ${refundedAmount.toLocaleString(
              "id-ID"
            )} has been refunded.`
          : `Booking ${booking.bookingCode} has been cancelled successfully.`
      );
    } catch (error) {
      const message =error instanceof Error
        ? error.message
        : "Failed to cancel booking.";

      setShowCancelModal(false);

      showModal(
        "error",
        "Cancellation Failed",
        message
      );
    } finally {
      setIsCancelling(false);
    }
  };

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

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await apiFetch("/stations");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to retrieve stations."
          );
        }

        setStations(result.data ?? []);
      } catch (error) {
        console.error("Failed to retrieve stations:", error);
        setStations([]);
      }
    };

    fetchStations();
  }, []);

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

  const selectedStation = stations.find(
    (station) => station.id === selectedStationId
  );

  const availableSlots =
    selectedStation?.slots.filter(
      (slot) =>
        slot.status === "AVAILABLE" ||
        slot.id === booking.slot.id
    ) ?? [];

  const selectedSlot = availableSlots.find(
    (slot) => slot.id === selectedSlotId
  );

  const updatedEstimatedKwh = selectedSlot
    ? selectedSlot.powerKw * (editDuration / 60)
    : 0;

  const updatedEstimatedCost = selectedSlot
    ? updatedEstimatedKwh * Number(selectedSlot.pricePerKwh)
    : 0;

  const paidAmount = booking.payment?.status === "PAID"
    ? Number(booking.netPaidAmount ?? booking.payment.amount)
    : 0;

  const priceDifference = updatedEstimatedCost - paidAmount;

  const paymentAdjustment =
    booking.payment?.status !== "PAID"
      ? "UNPAID"
      : priceDifference > 0
        ? "ADDITIONAL_PAYMENT"
        : priceDifference < 0
          ? "REFUND"
          : "NO_CHANGE";

  return (
    <main className="min-h-screen bg-background pb-16">
    <>
      {/* HEADER */}
      <section className="rounded-b-[24px] bg-primary-green px-6 py-6 text-white">
        <div className="mx-auto max-w-3xl flex justify-between">

          {/* BACK TO BOOKINGS */}
          <Link
            href={backToBookingsHref}
            className="my-4 inline-flex w-fit cursor-pointer items-center gap-2 text-sm font-semibold text-white transition hover:opacity-70"
          >
            <span>←</span>
            Back to Bookings
          </Link>

          {/* UPDATE BOOKING */}
          {isActiveBooking && booking.status !== "ONGOING" && (
            <button
              type="button"
              onClick={() => {
                const currentStartTime = new Date(booking.startTime);

                const localStartTime = new Date(
                  currentStartTime.getTime() -
                    currentStartTime.getTimezoneOffset() * 60 * 1000
                )
                  .toISOString()
                  .slice(0, 16);

                const currentDuration =
                  (new Date(booking.endTime).getTime() -
                    currentStartTime.getTime()) /
                  (1000 * 60);

                setSelectedStationId(booking.slot.station.id);
                setSelectedSlotId(booking.slot.id);
                setEditStartTime(localStartTime);
                setEditDuration(currentDuration);
                setShowUpdateModal(true);
              }}
              className="cursor-pointer rounded-xl bg-white px-4 py-2 text-sm font-semibold text-primary-green transition hover:opacity-90 mt-4"
            >
              Update Booking
            </button>
          )}
        </div>

        {/* BOOKING HEADER */}
        <div className="mx-auto mt-6 sm:mt-8 flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm opacity-80">
              Booking Details
            </p>

            <h1 className="mt-1 break-words text-xl sm:text-2xl font-bold">
              {booking.bookingCode}
            </h1>

            <p className="mt-3 sm:mt-4 text-sm opacity-90">
              Your charging reservation details and payment information.
            </p>
          </div>

          <span className={`w-fit shrink-0 self-center rounded-full px-4 py-1 text-sm font-semibold sm:self-auto sm:text-lg ${getBookingStatusStyle(booking.status)}`}
          >
            {booking.status}
          </span>
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
              {booking.slot.station.location}, {booking.slot.station.address}
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

        {booking && ["PENDING", "CONFIRMED", "ONGOING"].includes(booking.status) && (
          <button
            type="button"
            onClick={() => setShowCancelModal(true)}
            disabled={isCancelling}
            className="mt-3 w-full rounded-xl border bg-red-500 px-6 py-3 font-semibold text-red-900 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel Booking
          </button>
        )}
      </section>

      {/* UPDATE BOOKING MODAL */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 mb-15">
          <div className="flex h-[600px] w-full max-w-lg flex-col rounded-2xl bg-white p-6 shadow-xl">
            
            {/* MODAL HEADER */}
            <div className="shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Update Booking
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {booking.bookingCode}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="cursor-pointer text-2xl text-gray-400 transition hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <p className="mt-6 text-sm text-gray-500">
                Update your charging reservation.
              </p>
            </div>

            {/* CURRENT BOOKING */}
            <div className="hide-scrollbar mt-6 min-h-0 flex-1 space-y-4 overflow-y-auto pr-2">

              {/* STATION */}
              <div>
                <label
                  htmlFor="chargingStation"
                  className="text-sm font-semibold text-gray-700"
                >
                  Charging Station
                </label>

                <select
                  id="chargingStation"
                  value={selectedStationId}
                  onChange={(e) =>{
                    setSelectedStationId(Number(e.target.value));
                    setSelectedSlotId(0);
                  }}
                  className="mt-2 w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-primary-green"
                >
                  {stations.map((station) => (
                    <option
                      key={station.id}
                      value={station.id}
                    >
                      {station.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* CHARGING SLOT */}
              <div>
                <label
                  htmlFor="chargingSlot"
                  className="text-sm font-semibold text-gray-700"
                >
                  Charging Slot
                </label>

                <select
                  id="chargingSlot"
                  value={selectedSlotId}
                  onChange={(e) =>
                    setSelectedSlotId(Number(e.target.value))
                  }
                  className="mt-2 w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-primary-green"
                >
                  <option value={0} disabled>
                    Select a charging slot
                  </option>

                  {availableSlots.map((slot) => (
                    <option
                      key={slot.id}
                      value={slot.id}
                    >
                      {slot.slotCode} • {slot.chargerType} •{" "}
                      {slot.powerKw} kW
                    </option>
                  ))}
                </select>
              </div>

              {/* CURRENT SCHEDULE */}
              <div>
                <label
                  htmlFor="bookingStartTime"
                  className="text-sm font-semibold text-gray-700"
                >
                  Start Date & Time
                </label>

                <input
                  id="bookingStartTime"
                  type="datetime-local"
                  value={editStartTime}
                  onChange={(e) => setEditStartTime(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-primary-green"
                />
              </div>

              {/* DURATION */}
              <div>
                <label
                  htmlFor="bookingDuration"
                  className="text-sm font-semibold text-gray-700"
                >
                  Duration
                </label>

                <select
                  id="bookingDuration"
                  value={editDuration}
                  onChange={(e) =>
                    setEditDuration(Number(e.target.value))
                  }
                  className="mt-2 w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-primary-green"
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1 hour 30 minutes</option>
                  <option value={120}>2 hours</option>
                  <option value={180}>3 hours</option>
                </select>
              </div>

              {/* UPDATED ESTIMATE */}
              <div className="rounded-xl bg-[#e3fff1] p-4">
                <p className="text-sm font-semibold text-gray-700">
                  Updated Estimate
                </p>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Estimated Energy
                    </span>

                    <span className="text-sm font-semibold text-gray-900">
                      {updatedEstimatedKwh.toFixed(2)} kWh
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Estimated Cost
                    </span>

                    <span className="font-bold text-primary-green">
                      Rp{" "}
                      {updatedEstimatedCost.toLocaleString("id-ID")}
                    </span>
                  </div>

                  {booking.payment?.status === "PAID" && (
                    <>
                      <div className="my-3 border-t border-green-200" />

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Already Paid
                        </span>

                        <span className="text-sm font-semibold text-gray-900">
                          Rp {paidAmount.toLocaleString("id-ID")}
                        </span>
                      </div>

                      {paymentAdjustment === "ADDITIONAL_PAYMENT" && (
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm font-semibold text-orange-600">
                            Additional Payment
                          </span>

                          <span className="font-bold text-orange-600">
                            Rp {priceDifference.toLocaleString("id-ID")}
                          </span>
                        </div>
                      )}

                      {paymentAdjustment === "REFUND" && (
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm font-semibold text-blue-600">
                            Refund Amount
                          </span>

                          <span className="font-bold text-blue-600">
                            Rp {Math.abs(priceDifference).toLocaleString("id-ID")}
                          </span>
                        </div>
                      )}

                      {paymentAdjustment === "NO_CHANGE" && (
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm font-semibold text-green-600">
                            Payment Adjustment
                          </span>

                          <span className="font-bold text-green-600">
                            No additional payment
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

            </div>

            {/* ACTIONS */}
            <div className="mt-4 flex shrink-0 justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => setShowUpdateModal(false)}
                className="cursor-pointer rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => setShowSaveConfirmation(true)}
                disabled={
                  !selectedStationId ||
                  !selectedSlotId ||
                  !editStartTime
                }
                className="cursor-pointer rounded-xl bg-primary-green px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAVE CONFIRMATION MODAL */}
      {showSaveConfirmation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <h2 className="text-xl font-bold text-gray-900">
              Confirm Booking Update
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to save these changes?
            </p>

            {/* PAYMENT ADJUSTMENT SUMMARY */}
            {booking.payment?.status === "PAID" && (
              <div className="mt-5 rounded-xl bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Updated Cost
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    Rp {updatedEstimatedCost.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Already Paid
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    Rp {paidAmount.toLocaleString("id-ID")}
                  </span>
                </div>

                {paymentAdjustment === "ADDITIONAL_PAYMENT" && (
                  <div className="mt-3 border-t border-gray-200 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-orange-600">
                        Additional Payment
                      </span>

                      <span className="font-bold text-orange-600">
                        Rp {priceDifference.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      You will need to complete the additional payment
                      before the updated booking is confirmed.
                    </p>
                  </div>
                )}

                {paymentAdjustment === "REFUND" && (
                  <div className="mt-3 border-t border-gray-200 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-blue-600">
                        Refund Amount
                      </span>

                      <span className="font-bold text-blue-600">
                        Rp {Math.abs(priceDifference).toLocaleString("id-ID")}
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      The price difference will be refunded after
                      the booking update is completed.
                    </p>
                  </div>
                )}

                {paymentAdjustment === "NO_CHANGE" && (
                  <div className="mt-3 border-t border-gray-200 pt-3">
                    <p className="text-sm font-semibold text-green-600">
                      No additional payment or refund is required.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowSaveConfirmation(false)}
                disabled={isSaving}
                className="cursor-pointer rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Go Back
              </button>

              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="cursor-pointer rounded-xl bg-primary-green px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Yes, Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AFTER CONFIRMATION MODAL */}
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
                  if (isCancellationSuccess) {
                    router.push("/bookingsPage/historyPage");
                  } else {
                    window.location.reload();
                  }
                }
              }}
              className={`mt-7 w-full cursor-pointer rounded-xl px-4 py-3 font-semibold text-white duration-300 ${
                modal.type === "success"
                  ? "bg-primary-green hover:opacity-90"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {modal.type === "success" ? "Done" : "Try Again"}
            </button>

          </div>
        </div>
      )}

      {/* CANCEL BOOKING CONFIRMATION */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900">
              Cancel Booking
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to cancel booking{" "}
              <span className="font-semibold text-gray-900">
                {booking.bookingCode}
              </span>
              ?
            </p>

            {booking.payment?.status === "PAID" ? (
              <div className="mt-4 rounded-xl bg-[#e3fff1] p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-600">
                    Refund Amount
                  </span>

                  <span className="font-bold text-primary-green">
                    Rp{" "}
                    {Number(
                      booking.netPaidAmount ?? booking.payment.amount
                    ).toLocaleString("id-ID")}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  Your current net paid amount will be refunded when
                  this booking is cancelled.
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-500">
                This booking has not been paid, so no refund is required.
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                className="cursor-pointer rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Keep Booking
              </button>

              <button
                type="button"
                onClick={handleCancelBooking}
                disabled={isCancelling}
                className="cursor-pointer rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
      </>
    </main>
  );
}