"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "../../../lib/apiFetch";

type PaymentDetail = {
  id: number;
  transactionId: string | null;

  // Original payment
  amount?: number | string;

  // Booking adjustment
  adjustmentAmount?: number | string;
  type?: "ADDITIONAL_PAYMENT" | "REFUND";

  status:
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED"
    | "COMPLETED"
    | "CANCELLED";

  paymentStatus?: "PENDING" | "PAID" | "FAILED";

  paymentMethod:
    | "CARD"
    | "E_WALLET"
    | "CASH"
    | null;

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

  const rawTransactionId = params.id;
  const transactionRouteId = Array.isArray(rawTransactionId)
    ? rawTransactionId[0]
    : rawTransactionId;

  const isOriginalPayment =
    transactionRouteId?.startsWith("PAYMENT-") ?? false;

  const isAdjustment =
    transactionRouteId?.startsWith("ADJUSTMENT-") ?? false;

  const transactionNumericId = transactionRouteId
    ? transactionRouteId.replace(
        /^(PAYMENT|ADJUSTMENT)-/,
        ""
      )
    : "";

  const [payment, setPayment] = useState<PaymentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayment = async () => {
      if (
        !transactionRouteId ||
        (!isOriginalPayment && !isAdjustment) ||
        !/^\d+$/.test(transactionNumericId)
      ) {
        setError("Invalid transaction ID.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const endpoint = isOriginalPayment
          ? `/payments/${transactionNumericId}`
          : `/payments/adjustments/${transactionNumericId}`;

        const response = await apiFetch(endpoint);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            Array.isArray(result.message)
              ? result.message.join(", ")
              : result.message ||
                  "Failed to fetch transaction."
          );
        }

        setPayment(result.data);
      } catch (error) {
        console.error(
          "Failed to fetch transaction:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch transaction."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayment();
  }, [
    transactionRouteId,
    transactionNumericId,
    isOriginalPayment,
    isAdjustment,
  ]);

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

  const transactionAmount =
    payment.type === "ADDITIONAL_PAYMENT" ||
    payment.type === "REFUND"
      ? Number(payment.adjustmentAmount)
      : Number(payment.amount);

  const transactionLabel =
    payment.type === "ADDITIONAL_PAYMENT"
      ? "Additional Payment Successful"
      : payment.type === "REFUND"
        ? "Refund Processed"
        : payment.status === "PAID"
          ? "Payment Successful"
          : payment.status === "PENDING"
            ? "Payment Pending"
            : payment.status === "FAILED"
              ? "Payment Failed"
              : "Payment Refunded";

  const displayStatus =
    payment.type === "ADDITIONAL_PAYMENT"
      ? payment.paymentStatus ?? payment.status
      : payment.type === "REFUND"
        ? "REFUNDED"
        : payment.status;

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 font-semibold text-primary-green hover:underline"
        >
          ← Back to Payment History
        </button>

        <div className="rounded-2xl bg-white p-5 shadow-lg sm:rounded-3xl sm:p-8 md:p-10">
            {/* HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div>
                <h1 className="text-2xl font-bold text-primary-green sm:text-3xl md:text-4xl text-center sm:text-left">
                    Transaction Details
                </h1>

                <p className="mt-2 text-text-secondary text-center sm:text-left">
                    Here&apos;s the detailed information about your payment transaction.
                </p>
                </div>

                <span
                className={`w-fit shrink-0 rounded-full px-4 py-2 text-sm font-bold self-center ${
                    payment.status === "PAID" || payment.status === "COMPLETED"
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
            <div className="mt-6 sm:mt-8 rounded-2xl border border-primary-green/20 bg-[#eefbf4] p-5 sm:p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-green text-3xl font-bold text-white">
                {displayStatus === "PAID" ||
                displayStatus === "REFUNDED"
                  ? "✓"
                  : "•"}
                </div>

                <p className="mt-4 text-xl font-bold text-primary-green">
                  {transactionLabel}
                </p>

                <p className="mt-3 break-words text-2xl sm:text-3xl md:text-4xl font-bold">
                  {payment.type === "REFUND" ? "- " : ""}
                  Rp {transactionAmount.toLocaleString("id-ID")}
                </p>

                <p className="mt-5 text-sm text-text-secondary">
                Transaction ID
                </p>

                <p className="mt-1 break-all text-sm sm:text-base font-semibold">
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
                    <div className="flex items-start gap-4">
                        <span className="w-[95px] shrink-0 text-text-secondary sm:w-[140px]">
                        Payment ID
                        </span>

                        <span className="min-w-0 flex-1 break-words text-right font-semibold">
                        #{payment.id}
                        </span>
                    </div>

                    <div className="flex items-start gap-4">
                        <span className="w-[95px] shrink-0 text-text-secondary sm:w-[140px]">
                        Transaction ID
                        </span>

                        <span className="min-w-0 flex-1 break-words text-right font-semibold">
                        {payment.transactionId ?? "-"}
                        </span>
                    </div>

                    <div className="flex items-start gap-4">
                        <span className="w-[95px] shrink-0 text-text-secondary sm:w-[140px]">
                        Payment Method
                        </span>

                        <span className="min-w-0 flex-1 break-words text-right font-semibold">
                        {payment.paymentMethod === "CARD"
                            ? "Card"
                            : "E-Wallet"}
                        </span>
                    </div>

                    <div className="flex items-start gap-4">
                        <span className="w-[95px] shrink-0 text-text-secondary sm:w-[140px]">
                        Transaction Date
                        </span>

                        <span className="min-w-0 flex-1 break-words text-right font-semibold">
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
                    <div className="flex items-start gap-4">
                    <span className="w-[95px] shrink-0 text-text-secondary sm:w-[140px]">
                        Booking Code
                    </span>

                    <span className="min-w-0 flex-1 break-words text-right font-semibold">
                        {payment.booking.bookingCode}
                    </span>
                    </div>

                    <div className="flex items-start gap-4">
                    <span className="w-[95px] shrink-0 text-text-secondary sm:w-[140px]">
                        Station
                    </span>

                    <span className="min-w-0 flex-1 break-words text-right font-semibold">
                        {payment.booking.slot.station.name}
                    </span>
                    </div>

                    <div className="flex items-start gap-4">
                    <span className="w-[95px] shrink-0 text-text-secondary sm:w-[140px]">
                        Charging Slot
                    </span>

                    <span className="min-w-0 flex-1 break-words text-right font-semibold">
                        {payment.booking.slot.slotCode}
                    </span>
                    </div>

                    <div className="flex items-start gap-4">
                    <span className="w-[95px] shrink-0 text-text-secondary sm:w-[140px]">
                        Charger Type
                    </span>

                    <span className="min-w-0 flex-1 break-words text-right font-semibold">
                        {payment.booking.slot.chargerType.charAt(0) +
                        payment.booking.slot.chargerType
                            .slice(1)
                            .toLowerCase()}{" "}
                        Charging · {payment.booking.slot.powerKw} kW
                    </span>
                    </div>

                    <div className="flex items-start gap-4">
                    <span className="w-[95px] shrink-0 text-text-secondary sm:w-[140px]">
                        Estimated Energy
                    </span>

                    <span className="min-w-0 flex-1 break-words text-right font-semibold">
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