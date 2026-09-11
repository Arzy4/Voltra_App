"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "../../../lib/apiFetch";

type PaymentDetail = {
  id: number;
  transactionId: string | null;
  amount: number | string;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  paymentMethod: "CARD" | "E_WALLET";
  createdAt: string;

  booking: {
    id: number;
    bookingCode: string;
    estimatedKwh: number | string | null;

    slot: {
      slotCode: string;
      chargerType: "NORMAL" | "FAST" | "ULTRA";
      powerKw: number;

      station: {
        name: string;
      };
    };
  };
};

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();

  const rawPaymentId = params.id;
  const paymentId = Array.isArray(rawPaymentId)
    ? rawPaymentId[0]
    : rawPaymentId;

  const [payment, setPayment] = useState<PaymentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayment = async () => {
      if (!paymentId || !/^\d+$/.test(paymentId)) {
        setError("Invalid payment ID.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiFetch(`/payments/${paymentId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            Array.isArray(result.message)
              ? result.message.join(", ")
              : result.message || "Failed to fetch payment."
          );
        }

        setPayment(result.data);
      } catch (error) {
        console.error("Failed to fetch payment:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch payment."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayment();
  }, [paymentId]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-text-secondary">
          Loading transaction...
        </p>
      </main>
    );
  }

  if (error || !payment) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="font-semibold text-red-500">
            {error || "Transaction not found."}
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-4 font-semibold text-primary-green hover:underline"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 font-semibold text-primary-green hover:underline"
        >
          ← Back to Payment History
        </button>

        <div className="rounded-3xl bg-white p-8 shadow-lg md:p-10">
            {/* HEADER */}
            <div className="flex items-start justify-between gap-6">
                <div>
                <h1 className="text-4xl font-bold text-primary-green">
                    Transaction Details
                </h1>

                <p className="mt-2 text-text-secondary">
                    Here&apos;s the detailed information about your payment transaction.
                </p>
                </div>

                <span
                className={`rounded-full px-5 py-2 text-sm font-bold ${
                    payment.status === "PAID"
                    ? "bg-emerald-100 text-emerald-700"
                    : payment.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : payment.status === "FAILED"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
                >
                {payment.status}
                </span>
            </div>

            {/* PAYMENT RESULT */}
            <div className="mt-8 rounded-2xl border border-primary-green/20 bg-[#eefbf4] p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-green text-3xl font-bold text-white">
                {payment.status === "PAID" ? "✓" : "•"}
                </div>

                <p className="mt-4 text-xl font-bold text-primary-green">
                {payment.status === "PAID"
                    ? "Payment Successful"
                    : payment.status === "PENDING"
                    ? "Payment Pending"
                    : payment.status === "FAILED"
                    ? "Payment Failed"
                    : "Payment Refunded"}
                </p>

                <p className="mt-3 text-4xl font-bold">
                Rp {Number(payment.amount).toLocaleString("id-ID")}
                </p>

                <p className="mt-5 text-sm text-text-secondary">
                Transaction ID
                </p>

                <p className="mt-1 font-semibold">
                {payment.transactionId ?? "-"}
                </p>

                <p className="mt-3 text-sm text-text-secondary">
                {new Date(payment.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })}
                </p>
            </div>

            {/* TRANSACTION INFORMATION */}
            <div className="mt-6 rounded-2xl border border-border-soft p-6">
                <h2 className="text-xl font-bold">
                Transaction Information
                </h2>

                <div className="mt-5 space-y-4">
                    <div className="flex gap-4 justify-between">
                        <span className="text-text-secondary">
                        Payment ID
                        </span>

                        <span className="font-semibold">
                        #{payment.id}
                        </span>
                    </div>

                    <div className="flex gap-4 justify-between">
                        <span className="text-text-secondary">
                        Transaction ID
                        </span>

                        <span className="font-semibold">
                        {payment.transactionId ?? "-"}
                        </span>
                    </div>

                    <div className="flex gap-4 justify-between">
                        <span className="text-text-secondary">
                        Payment Method
                        </span>

                        <span className="font-semibold">
                        {payment.paymentMethod === "CARD"
                            ? "Card"
                            : "E-Wallet"}
                        </span>
                    </div>

                    <div className="flex gap-4 justify-between">
                        <span className="text-text-secondary">
                        Payment Status
                        </span>

                        <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                            payment.status === "PAID"
                            ? "bg-paid text-white"
                            : payment.status === "PENDING"
                            ? "bg-pending text-yellow-700"
                            : payment.status === "FAILED"
                            ? "bg-failed text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                        >
                        {payment.status}
                        </span>
                    </div>

                    <div className="flex gap-4 justify-between">
                        <span className="text-text-secondary">
                        Transaction Date
                        </span>

                        <span className="font-semibold">
                        {new Date(payment.createdAt).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                        </span>
                    </div>
                </div>
            </div>

            {/* BOOKING INFORMATION */}
            <div className="mt-6 rounded-2xl border border-border-soft p-6">
                <h2 className="text-xl font-bold">
                    Booking Information
                </h2>

                <div className="mt-5 space-y-4">
                    <div className="flex gap-4 justify-between">
                    <span className="text-text-secondary">
                        Booking Code
                    </span>

                    <span className="font-semibold">
                        {payment.booking.bookingCode}
                    </span>
                    </div>

                    <div className="flex gap-4 justify-between">
                    <span className="text-text-secondary">
                        Station
                    </span>

                    <span className="font-semibold">
                        {payment.booking.slot.station.name}
                    </span>
                    </div>

                    <div className="flex gap-4 justify-between">
                    <span className="text-text-secondary">
                        Charging Slot
                    </span>

                    <span className="font-semibold">
                        {payment.booking.slot.slotCode}
                    </span>
                    </div>

                    <div className="flex gap-4 justify-between">
                    <span className="text-text-secondary">
                        Charger Type
                    </span>

                    <span className="font-semibold">
                        {payment.booking.slot.chargerType.charAt(0) +
                        payment.booking.slot.chargerType
                            .slice(1)
                            .toLowerCase()}{" "}
                        Charging · {payment.booking.slot.powerKw} kW
                    </span>
                    </div>

                    <div className="flex gap-4 justify-between">
                    <span className="text-text-secondary">
                        Estimated Energy
                    </span>

                    <span className="font-semibold">
                        {payment.booking.estimatedKwh ?? "-"} kWh
                    </span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}