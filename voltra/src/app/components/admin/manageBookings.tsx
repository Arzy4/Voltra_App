"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/apiFetch";

type Booking = {
  id: number;
  userId: number;
  slotId: number;
  bookingCode: string;
  startTime: string;
  endTime: string;
  estimatedKwh: number | null;
  estimatedCost: number | null;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "ONGOING"
    | "COMPLETED"
    | "CANCELLED";
  createdAt: string;
  updatedAt: string;

  user: {
    id: number;
    fullName: string;
    email: string;
  };

  slot: {
    id: number;
    slotCode: string;
    chargerType: "NORMAL" | "FAST" | "ULTRA";
    powerKw: number;
    pricePerKwh: number;

    station: {
      id: number;
      name: string;
    };
  };

  payment: {
    id: number;
    amount: number;
    status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
    paymentMethod: "CASH" | "CARD" | "E_WALLET";
  } | null;
};

export default function ManageBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    const [editStatus, setEditStatus] =
    useState<Booking["status"]>("PENDING");
    const [editStartTime, setEditStartTime] = useState("");
    const [editDuration, setEditDuration] = useState(60);

    const openManageModal = (booking: Booking) => {
    const startTime = new Date(booking.startTime);
    const endTime = new Date(booking.endTime);

    const durationMinutes = Math.round(
        (endTime.getTime() - startTime.getTime()) / (60 * 1000)
    );

    const localStartTime = new Date(
        startTime.getTime() - startTime.getTimezoneOffset() * 60 * 1000
    )
        .toISOString()
        .slice(0, 16);

    setSelectedBooking(booking);
    setEditStatus(booking.status);
    setEditStartTime(localStartTime);
    setEditDuration(durationMinutes);
    };

    const [isSaving, setIsSaving] = useState(false);

    const [showUpdateConfirmation, setShowUpdateConfirmation] =
    useState(false);

    const [updateResult, setUpdateResult] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const handleSaveChanges = async () => {
        if (!selectedBooking || !editStartTime) {
            return;
        }

        try {
            setIsSaving(true);

            const response = await apiFetch(
            `/bookings/${selectedBooking.id}`,
            {
                method: "PATCH",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                status: editStatus,
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

            // Update table
            setBookings((currentBookings) =>
                currentBookings.map((booking) =>
                    booking.id === selectedBooking.id
                    ? {
                        ...booking,
                        ...result.data,
                        user: booking.user,
                        slot: booking.slot,
                        payment: booking.payment,
                        }
                    : booking
                )
            );

            // Close confirmation + manage modal
            setShowUpdateConfirmation(false);
            setSelectedBooking(null);

            // SHOW SUCCESS MODAL HERE
            setUpdateResult({
                type: "success",
                message: "Booking updated successfully.",
            });

        } catch (error) {
            console.error("Failed to update booking:", error);

            setShowUpdateConfirmation(false);

            setUpdateResult({
                type: "error",
                message:
                error instanceof Error
                    ? error.message
                    : "Failed to update booking.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        const fetchBookings = async () => {
            try {
            setIsLoading(true);

            const response = await apiFetch("/bookings");
            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                result.message || "Failed to retrieve bookings."
                );
            }

            setBookings(result.data ?? []);
            } catch (error) {
            console.error("Failed to retrieve bookings:", error);
            setBookings([]);
            } finally {
            setIsLoading(false);
            }
        };

        fetchBookings();
    }, []);

    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* HEADER */}
            <div className="shrink-0">
                <h1 className="text-2xl font-bold text-primary-green">
                Manage Bookings
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                View and manage customer charging bookings.
                </p>
            </div>

            <div className="mt-6 flex min-h-0 flex-1 flex-col overflow-hidden">
                {isLoading ? (
                    <div className="flex h-40 items-center justify-center">
                    <p className="text-sm text-gray-500">
                        Loading bookings...
                    </p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="flex h-40 items-center justify-center">
                    <p className="text-sm text-gray-500">
                        No bookings found.
                    </p>
                    </div>
                ) : (
                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    {/* TABLE HEADER */}
                    <div className="grid shrink-0 grid-cols-[1.1fr_1.4fr_1.5fr_1.5fr_1fr_1fr_0.8fr] gap-4 border-b border-gray-200 bg-gray-50 px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                        <p>Booking</p>
                        <p>Customer</p>
                        <p>Station / Slot</p>
                        <p>Schedule</p>
                        <p>Est. Cost</p>
                        <p>Status</p>
                        <p>Action</p>
                    </div>

                    {/* BOOKING ROWS */}
                    <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto">
                        {bookings.map((booking) => (
                            <div
                            key={booking.id}
                            className="grid grid-cols-[1.1fr_1.4fr_1.5fr_1.5fr_1fr_1fr_0.8fr] items-center gap-4 border-b border-gray-100 px-5 py-4 last:border-b-0"
                            >
                            {/* BOOKING */}
                            <p className="truncate text-sm font-semibold text-gray-900">
                                {booking.bookingCode}
                            </p>

                            {/* CUSTOMER */}
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-gray-900">
                                {booking.user.fullName}
                                </p>

                                <p className="truncate text-xs text-gray-500">
                                {booking.user.email}
                                </p>
                            </div>

                            {/* STATION / SLOT */}
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-gray-900">
                                {booking.slot.station.name}
                                </p>

                                <p className="text-xs text-gray-500">
                                {booking.slot.slotCode} • {booking.slot.chargerType}
                                </p>
                            </div>

                            {/* SCHEDULE */}
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                {new Date(booking.startTime).toLocaleDateString()}
                                </p>

                                <p className="text-xs text-gray-500">
                                {new Date(booking.startTime).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                                {" - "}
                                {new Date(booking.endTime).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                                </p>
                            </div>

                            {/* COST */}
                            <p className="text-sm font-semibold text-gray-900">
                                Rp{" "}
                                {Number(booking.estimatedCost ?? 0).toLocaleString(
                                "id-ID"
                                )}
                            </p>

                            {/* STATUS */}
                            <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                                {booking.status}
                            </span>

                            {/* ACTION */}
                            <button
                                type="button"
                                onClick={() => openManageModal(booking)}
                                className="cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                                Manage
                            </button>
                            </div>
                        ))}
                        </div>
                    </div>
                )}
            </div>

            {selectedBooking && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                    {/* MODAL HEADER */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Manage Booking
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                {selectedBooking.bookingCode}
                            </p>
                        </div>

                        <button
                        type="button"
                        onClick={() => setSelectedBooking(null)}
                        className="cursor-pointer text-xl text-gray-400 transition hover:text-gray-700"
                        >
                        ×
                        </button>
                    </div>

                    {/* BOOKING INFORMATION */}
                    <div className="mt-6 space-y-4">
                        <div>
                            <p className="text-xs font-medium uppercase text-gray-400">
                                Customer
                            </p>

                            <p className="mt-1 font-semibold text-gray-900">
                                {selectedBooking.user.fullName}
                            </p>

                            <p className="text-sm text-gray-500">
                                {selectedBooking.user.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase text-gray-400">
                                Station / Slot
                            </p>

                            <p className="mt-1 font-semibold text-gray-900">
                                {selectedBooking.slot.station.name}
                            </p>

                            <p className="text-sm text-gray-500">
                                {selectedBooking.slot.slotCode} •{" "}
                                {selectedBooking.slot.chargerType}
                            </p>
                        </div>

                        {/* BOOKING STATUS */}
                        <div>
                            <label
                                htmlFor="bookingStatus"
                                className="text-sm font-semibold text-gray-700"
                            >
                                Booking Status
                            </label>

                            <select
                                id="bookingStatus"
                                value={editStatus}
                                onChange={(e) =>
                                setEditStatus(e.target.value as Booking["status"])
                                }
                                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-primary-green"
                            >
                                <option value="PENDING">Pending</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="ONGOING">Ongoing</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>

                        {/* START DATE & TIME */}
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
                                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-primary-green"
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
                                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-primary-green"
                            >
                                <option value={30}>30 minutes</option>
                                <option value={60}>1 hour</option>
                                <option value={90}>1 hour 30 minutes</option>
                                <option value={120}>2 hours</option>
                                <option value={180}>3 hours</option>
                            </select>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={() => setSelectedBooking(null)}
                            className="cursor-pointer rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowUpdateConfirmation(true)}
                            disabled={isSaving}
                            className="cursor-pointer rounded-xl bg-primary-green px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
            )}

            {/* UPDATE CONFIRMATION MODAL */}
            {showUpdateConfirmation && selectedBooking && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                    <h2 className="text-xl font-bold text-gray-900">
                        Confirm Booking Update
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Are you sure you want to update this booking?
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setShowUpdateConfirmation(false)}
                            disabled={isSaving}
                            className="cursor-pointer rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                            Go Back
                        </button>

                        <button
                            type="button"
                            onClick={handleSaveChanges}
                            disabled={isSaving}
                            className="cursor-pointer rounded-xl bg-primary-green px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                            {isSaving ? "Updating..." : "Yes, Update"}
                        </button>
                    </div>
                </div>
            </div>
            )}

            {/* UPDATE RESULT MODAL */}
            {updateResult && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
                <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">

                    {/* ICON */}
                    <div
                        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold ${
                        updateResult.type === "success"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                    >
                        {updateResult.type === "success" ? "✓" : "!"}
                    </div>

                    {/* TITLE */}
                    <h2 className="mt-4 text-xl font-bold text-gray-900">
                        {updateResult.type === "success"
                        ? "Booking Updated"
                        : "Update Failed"}
                    </h2>

                    {/* MESSAGE */}
                    <p className="mt-2 text-sm text-gray-500">
                        {updateResult.message}
                    </p>

                    {/* BUTTON */}
                    <button
                        type="button"
                        onClick={() => setUpdateResult(null)}
                        className={`mt-6 w-full cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 ${
                        updateResult.type === "success"
                            ? "bg-primary-green"
                            : "bg-red-500"
                        }`}
                    >
                        OK
                    </button>
                </div>
            </div>
            )}
        </div>
    );
}