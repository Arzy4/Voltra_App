"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/app/lib/apiFetch";

type BookingAdjustment = {
  id: number;
  bookingId: number;
  slotId: number;
  startTime: string;
  endTime: string;
  estimatedKwh: number;
  estimatedCost: number;
  adjustmentAmount: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  paymentMethod: "CASH" | "CARD" | "E_WALLET" | null;
  transactionId: string | null;

  booking: {
    id: number;
    bookingCode: string;
    startTime: string;
    endTime: string;
    estimatedCost: string;
    status: string;
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
  };
};

export default function AdjustmentPaymentPage() {
    const params = useParams();
    const adjustmentId = params.id as string;

    const [adjustment, setAdjustment] =
    useState<BookingAdjustment | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [isPaying, setIsPaying] = useState(false);
    const [paymentModal, setPaymentModal] = useState({
        open: false,
        type: "success" as "success" | "error",
        title: "",
        message: "",
    });

    const handlePayment = async () => {
        try {
            setIsPaying(true);

            const response = await apiFetch(
                `/payments/adjustments/${adjustmentId}/complete`,
                {
                    method: "PATCH",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to complete payment."
                );
            }

            setPaymentModal({
                open: true,
                type: "success",
                title: "Payment Successful",
                message:"Your additional payment has been completed and your booking has been updated.",
            });
        } catch (error) {
            setPaymentModal({
                open: true,
                type: "error",
                title: "Payment Failed",
                message: error instanceof Error
                    ? error.message
                    : "Failed to complete payment.",
            });
        } finally {
            setIsPaying(false);
        }
    };

    useEffect(() => {
    const fetchAdjustment = async () => {
        try {
        setIsLoading(true);
        setError("");

        const response = await apiFetch(
            `/payments/adjustments/${adjustmentId}`
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
            result.message || "Failed to load additional payment."
            );
        }

        setAdjustment(result.data);
        } catch (error) {
        setError(
            error instanceof Error
            ? error.message
            : "Failed to load additional payment."
        );
        } finally {
        setIsLoading(false);
        }
    };

    if (adjustmentId) {
        fetchAdjustment();
    }
    }, [adjustmentId]);

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#e3fff1]">
            <p className="text-gray-600">
                Loading additional payment...
            </p>
            </main>
        );
    }

    if (error || !adjustment) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#e3fff1]">
            <div className="rounded-2xl bg-white p-6 shadow-md">
                <p className="text-red-600">
                {error || "Adjustment not found."}
                </p>
            </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#e3fff1] px-6 py-12 mt-6">
            <div className="mx-auto max-w-xl">
                <div className="rounded-2xl bg-white p-6 shadow-md">
                    <div className="border-b border-gray-200 pb-5">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Additional Payment
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Complete the additional payment to confirm your
                            booking changes.
                        </p>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">
                                Booking Code
                            </p>
                            <p className="font-semibold text-gray-900">
                                {adjustment.booking.bookingCode}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                New Charging Time
                            </p>
                            <p className="font-semibold text-gray-900">
                                {new Date(adjustment.startTime).toLocaleString(
                                    "id-ID"
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                New Estimated Energy
                            </p>
                            <p className="font-semibold text-gray-900">
                                {adjustment.estimatedKwh} kWh
                            </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Previous Payment
                                </span>

                                <span className="font-medium text-gray-900">
                                    Rp{" "}
                                    {(
                                    adjustment.estimatedCost -
                                    adjustment.adjustmentAmount
                                    ).toLocaleString("id-ID")}
                                </span>
                            </div>

                            <div className="mt-3 flex justify-between">
                                <span className="text-gray-600">
                                    New Booking Cost
                                </span>

                                <span className="font-medium text-gray-900">
                                    Rp{" "}
                                    {adjustment.estimatedCost.toLocaleString(
                                    "id-ID"
                                    )}
                                </span>
                            </div>

                            <div className="my-4 border-t border-gray-200" />

                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-gray-900">
                                    Additional Payment
                                </span>

                                <span className="text-xl font-bold text-green-700">
                                    Rp{" "}
                                    {adjustment.adjustmentAmount.toLocaleString(
                                    "id-ID"
                                    )}
                                </span>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Payment Status
                            </p>

                            <span className="mt-1 inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                                {adjustment.paymentStatus}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handlePayment}
                        disabled={isPaying}
                        className="mt-6 w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700"
                    >
                        {isPaying
                            ? "Processing..."
                            : `Pay Rp ${adjustment.adjustmentAmount.toLocaleString(
                                "id-ID"
                        )}`}
                    </button>
                </div>
            </div>

            {paymentModal.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

                    {/* ICON */}
                    <div
                        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl ${
                        paymentModal.type === "success"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                    >
                        {paymentModal.type === "success" ? "✓" : "✕"}
                    </div>

                    {/* TITLE */}
                    <h2 className="mt-5 text-center text-2xl font-bold text-gray-900">
                        {paymentModal.title}
                    </h2>

                    {/* MESSAGE */}
                    <p className="mt-3 text-center text-sm leading-6 text-gray-500">
                        {paymentModal.message}
                    </p>

                    {/* BUTTON */}
                    <button
                        type="button"
                        onClick={() => {
                        if (paymentModal.type === "success") {
                            window.location.href =
                            `/bookingsPage/${adjustment.bookingId}`;
                        } else {
                            setPaymentModal((prev) => ({
                            ...prev,
                            open: false,
                            }));
                        }
                        }}
                        className={`mt-7 w-full cursor-pointer rounded-xl px-4 py-3 font-semibold text-white transition ${
                        paymentModal.type === "success"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                    >
                        {paymentModal.type === "success"
                        ? "Back to Booking"
                        : "Try Again"}
                    </button>
                </div>
            </div>
            )}
        </main>
    );
}