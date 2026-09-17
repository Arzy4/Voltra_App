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

    const [paymentMethod, setPaymentMethod] = useState<
        "CARD" | "E_WALLET"
    >("CARD");

    const [cardholderName, setCardholderName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");

    const [fullName, setFullName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");

    const [paymentModal, setPaymentModal] = useState({
        open: false,
        type: "success" as "success" | "error",
        title: "",
        message: "",
    });

    function handleCardNumberChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const digits = e.target.value
            .replace(/\D/g, "")
            .slice(0, 16);

        const formatted = digits.replace(
            /(\d{4})(?=\d)/g,
            "$1 "
        );

        setCardNumber(formatted);
    }

    function handleCardExpiryChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        let digits = e.target.value.replace(/\D/g, "");

        // Maximum MMYY
        digits = digits.slice(0, 4);

        // Month cannot exceed 12
        if (digits.length >= 2) {
            const month = Number(digits.slice(0, 2));

            if (month > 12) {
            digits = `12${digits.slice(2)}`;
            }
        }

        if (digits.length > 2) {
            setExpiryDate(
            `${digits.slice(0, 2)} / ${digits.slice(2)}`
            );
        } else {
            setExpiryDate(digits);
        }
    }

    function handleCvvChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const digits = e.target.value
            .replace(/\D/g, "")
            .slice(0, 3);

        setCvv(digits);
    }

    const handlePayment = async () => {
        try {
            if (!fullName || !address || !city || !postalCode) {
                setPaymentModal({
                    open: true,
                    type: "error",
                    title: "Incomplete Address",
                    message: "Please complete your billing address.",
                });

                return;
                }

                if (
                paymentMethod === "CARD" &&
                (!cardholderName ||
                    cardNumber.replace(/\s/g, "").length !== 16 ||
                    expiryDate.length !== 7 ||
                    cvv.length !== 3)
                ) {
                setPaymentModal({
                    open: true,
                    type: "error",
                    title: "Incomplete Card Details",
                    message: "Please complete your card details correctly.",
                });

                return;
            }

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
        <main className="min-h-screen bg-background px-6 py-13">
            <div className="mx-auto h-[680px] max-w-5xl overflow-hidden rounded-3xl bg-white shadow-lg">
                <div className="grid h-full md:grid-cols-2">

                    {/* LEFT SIDE - ADJUSTMENT SUMMARY */}
                    <section className="h-full p-12 mt-6">
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
                    </section>

                    {/* RIGHT SIDE - PAYMENT FORM */}
                    <section className="hide-scrollbar h-full overflow-hidden border-t border-border-soft bg-[#f8fffb] p-8 md:border-l md:border-t-0 md:px-12 py-6">
                        <div className="hide-scrollbar h-full overflow-y-auto p-8 md:p-12">
                            <h2 className="text-2xl font-bold text-primary-green">
                            Payment Method
                            </h2>

                            {/* PAYMENT METHOD SELECTOR */}
                            <div className="mt-6 flex gap-8">
                                <label className="flex cursor-pointer items-center gap-2">
                                    <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="CARD"
                                    checked={paymentMethod === "CARD"}
                                    onChange={() => setPaymentMethod("CARD")}
                                    className="accent-primary-green"
                                    />

                                    <span className="font-semibold">
                                    Card
                                    </span>
                                </label>

                                <label className="flex cursor-pointer items-center gap-2">
                                    <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="E_WALLET"
                                    checked={paymentMethod === "E_WALLET"}
                                    onChange={() => setPaymentMethod("E_WALLET")}
                                    className="accent-primary-green"
                                    />

                                    <span className="font-semibold">
                                    E-Wallet
                                    </span>
                                </label>
                            </div>

                            {/* PAYMENT CONTENT */}
                            <div className="mt-10">
                                {paymentMethod === "CARD" && (
                                    <div>
                                        <h3 className="text-xl font-bold text-primary-green">
                                            Card Details
                                        </h3>

                                        <div className="mt-6 space-y-5">
                                            {/* CARDHOLDER NAME */}
                                            <div>
                                                <label className="text-sm font-medium">
                                                    Cardholder&apos;s Name
                                                </label>

                                                <input
                                                    type="text"
                                                    value={cardholderName}
                                                    onChange={(e) =>
                                                    setCardholderName(e.target.value)
                                                    }
                                                    placeholder="Name on card"
                                                    className="mt-2 w-full rounded-lg border border-border-soft bg-white px-4 py-3 outline-none transition focus:border-primary-green"
                                                />
                                            </div>

                                            {/* CARD NUMBER */}
                                            <div>
                                                <label className="text-sm font-medium">
                                                    Card Number
                                                </label>

                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={cardNumber}
                                                    onChange={handleCardNumberChange}
                                                    maxLength={19}
                                                    placeholder="1234 5678 9012 3456"
                                                    className="mt-2 w-full rounded-lg border border-border-soft bg-white px-4 py-3 outline-none transition focus:border-primary-green"
                                                />
                                            </div>

                                            {/* EXPIRY + CVC */}
                                            <div className="grid grid-cols-2 gap-5">
                                                <div>
                                                    <label className="text-sm font-medium">
                                                    Expiry Date
                                                    </label>

                                                    <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={expiryDate}
                                                    onChange={handleCardExpiryChange}
                                                    maxLength={7}
                                                    placeholder="MM / YY"
                                                    className="mt-2 w-full rounded-lg border border-border-soft bg-white px-4 py-3 outline-none transition focus:border-primary-green"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium">
                                                    CVC / CVV
                                                    </label>

                                                    <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={cvv}
                                                    onChange={handleCvvChange}
                                                    maxLength={3}
                                                    placeholder="123"
                                                    className="mt-2 w-full rounded-lg border border-border-soft bg-white px-4 py-3 outline-none transition focus:border-primary-green"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ADDRESS DETAILS */}
                                <div className={paymentMethod === "CARD" ? "mt-10" : ""}>
                                    <AddressDetails
                                        fullName={fullName}
                                        setFullName={setFullName}
                                        address={address}
                                        setAddress={setAddress}
                                        city={city}
                                        setCity={setCity}
                                        postalCode={postalCode}
                                        setPostalCode={setPostalCode}
                                    />
                                </div>

                                {/* PAY BUTTON */}
                                <button
                                type="button"
                                onClick={handlePayment}
                                disabled={isPaying}
                                className="mt-10 w-full rounded-full bg-primary-green px-6 py-4 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                {isPaying
                                    ? "Processing..."
                                    : `Pay Rp ${adjustment.adjustmentAmount.toLocaleString(
                                        "id-ID"
                                    )}`}
                                </button>
                            </div>
                        </div>
                    </section>

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

type AddressDetailsProps = {
  fullName: string;
  setFullName: (value: string) => void;

  address: string;
  setAddress: (value: string) => void;

  city: string;
  setCity: (value: string) => void;

  postalCode: string;
  setPostalCode: (value: string) => void;
};

function AddressDetails({
  fullName,
  setFullName,
  address,
  setAddress,
  city,
  setCity,
  postalCode,
  setPostalCode,
}: AddressDetailsProps) {
  return (
    <div>
      <h3 className="text-xl font-bold text-primary-green">
        Address Details
      </h3>

      <div className="mt-6 space-y-5">
        <div>
          <label className="text-sm font-medium">
            Full Name
          </label>

          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
            className="mt-2 w-full rounded-lg border border-border-soft bg-white px-4 py-3 outline-none transition focus:border-primary-green"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Address
          </label>

          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Your address"
            className="mt-2 w-full rounded-lg border border-border-soft bg-white px-4 py-3 outline-none transition focus:border-primary-green"
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium">
              City
            </label>

            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Surabaya"
              className="mt-2 w-full rounded-lg border border-border-soft bg-white px-4 py-3 outline-none transition focus:border-primary-green"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Postal Code
            </label>

            <input
              type="text"
              value={postalCode}
              onChange={(e) =>
                setPostalCode(e.target.value)
              }
              placeholder="60241"
              className="mt-2 w-full rounded-lg border border-border-soft bg-white px-4 py-3 outline-none transition focus:border-primary-green"
            />
          </div>
        </div>
      </div>
    </div>
  );
}