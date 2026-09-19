"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "../../lib/apiFetch";
import { useRouter } from "next/navigation";
import Link from "next/link";

type BookingDetail = {
  id: number;
  bookingCode: string;
  estimatedKwh: string;
  estimatedCost: string;

  slot: {
    slotCode: string;
    chargerType: string;
    powerKw: number;

    station: {
      name: string;
      location: string;
      address: string;
    };
  };
};

export default function PaymentPage() {
    const router = useRouter();
    const params = useParams();
    const bookingId = params.id as string;

    const [booking, setBooking] = useState<BookingDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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

      // Maximum: MMYY
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

    useEffect(() => {
      const fetchBooking = async () => {
        try {
          const response = await apiFetch(`/bookings/${bookingId}`);
          const result = await response.json();

          if (!response.ok) {
            throw new Error(
              result.message || "Failed to fetch booking."
            );
          }

          setBooking(result.data);
        } catch (error) {
          console.error("Failed to fetch booking:", error);
        } finally {
          setIsLoading(false);
        }
      };

      if (bookingId) {
        fetchBooking();
      }
    }, [bookingId]);

    if (isLoading) {
      return (
        <main className="flex min-h-screen items-center justify-center">
          <p className="text-text-secondary">
            Loading payment...
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

    async function handlePay() {
      try {
        if (!booking) return;

        if (!fullName || !address || !city || !postalCode) {
          showModal(
            "error",
            "Incomplete Address",
            "Please complete your billing address."
          );
          return;
        }

        if (
          paymentMethod === "CARD" &&
          (!cardholderName || !cardNumber || !expiryDate || !cvv)
        ) {
          showModal(
            "error",
            "Incomplete Card Details",
            "Please complete your card details."
          );
          return;
        }

        // 1. Create payment
        const createResponse = await apiFetch("/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: booking.id,
            paymentMethod: paymentMethod,
          }),
        });

        const createResult = await createResponse.json();

        if (!createResponse.ok) {
          throw new Error(
            Array.isArray(createResult.message)
              ? createResult.message.join(", ")
              : createResult.message || "Failed to create payment."
          );
        }

        const payment = createResult.data;

        // 2. Simulate successful payment
        const completeResponse = await apiFetch(
          `/payments/${payment.id}/complete`,
          {
            method: "PATCH",
          }
        );

        const completeResult = await completeResponse.json();

        if (!completeResponse.ok) {
          throw new Error(
            Array.isArray(completeResult.message)
              ? completeResult.message.join(", ")
              : completeResult.message || "Failed to complete payment."
          );
        }

          showModal(
          "success",
          "Payment Success!",
          "Your booking has been confirmed."
        );
      } catch (error) {
        showModal(
          "error",
          "Payment Failed",
          error instanceof Error
            ? error.message
            : "We couldn't process your payment. Please try again."
        );
      }
    }

return (
  <main className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10 lg:py-13">
    <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-lg md:h-[680px]">
      <div className="grid md:h-full md:grid-cols-2">

        {/* LEFT SIDE - PAYMENT SUMMARY */}
        <section className="h-full p-5 sm:p-8 md:p-10 lg:p-12">
          <Link
            href="/bookingsPage/activePage"
            className="mb-4 inline-flex cursor-pointer items-center gap-2 font-semibold text-primary-green transition hover:opacity-70"
          >
            <span>←</span>
            Back to Bookings
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-primary-green">
            Payment
          </h1>

          <p className="mt-3 text-lg font-semibold">
            #{booking.bookingCode}
          </p>

          <p className="mt-2 text-sm text-text-secondary">
            Complete your payment to confirm your booking.
          </p>

          <div className="my-4 border-t border-border-soft" />

          <div className="space-y-6">
            <div className="grid grid-cols-[110px_1fr] gap-3 sm:grid-cols-[140px_1fr] sm:gap-4">
              <span className="text-text-secondary">
                Station
              </span>

              <div>
                <p className="font-semibold">
                  {booking.slot.station.name}
                </p>

                <p className="mt-1 text-sm text-text-secondary">
                  {booking.slot.station.address}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[140px_1fr] gap-4">
              <span className="text-text-secondary">
                Charger
              </span>

              <div>
                <p className="font-semibold">
                  {booking.slot.chargerType}
                </p>

                <p className="mt-1 text-sm text-text-secondary">
                  {booking.slot.powerKw} kW · {booking.slot.slotCode}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[140px_1fr] gap-4">
              <span className="text-text-secondary">
                Estimated Energy
              </span>

              <p className="font-semibold">
                {booking.estimatedKwh} kWh
              </p>
            </div>
          </div>

          <div className="my-4 border-t border-border-soft" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">
                Amount
              </span>

              <span className="font-semibold">
                Rp{" "}
                {Number(
                  booking.estimatedCost
                ).toLocaleString("id-ID")}
              </span>
            </div>

            <div className="border-t border-border-soft pt-5">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">
                  Amount to pay
                </span>

                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-green">
                  Rp{" "}
                  {Number(
                    booking.estimatedCost
                  ).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-[#eefbf4] p-4 text-sm text-text-secondary">
            Once the payment is successful, your booking will be
            confirmed.
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
              {paymentMethod === "CARD" ? (
                <>
                  {/* CARD DETAILS */}
                  <div>
                    <h3 className="text-xl font-bold text-primary-green">
                      Card Details
                    </h3>

                    <div className="mt-6 space-y-5">
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

                  {/* ADDRESS DETAILS */}
                  <div className="mt-10">
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

                  <button
                    type="button"
                    onClick={handlePay}
                    className="mt-10 w-full rounded-full bg-primary-green px-6 py-4 font-semibold text-white transition hover:opacity-90"
                  >
                    Pay Rp{" "}
                    {Number(
                      booking.estimatedCost
                    ).toLocaleString("id-ID")}
                  </button>
                </>
              ) : (
                <>
                  {/* E-WALLET ONLY */}
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

                  <button
                    type="button"
                    className="mt-10 w-full rounded-full bg-primary-green px-6 py-4 font-semibold text-white transition hover:opacity-90"
                  >
                    Continue to E-Wallet
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>

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
                router.push(`/bookingsPage/${booking.id}`);
              }
            }}
            className={`mt-7 w-full rounded-xl px-4 py-3 font-semibold text-white duration-300 ${
              modal.type === "success"
                ? "bg-primary-green hover:opacity-90"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {modal.type === "success" ? "View Booking Detail" : "Try Again"}
          </button>

        </div>
      </div>
    )}
  </main>
)
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
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="60241"
              className="mt-2 w-full rounded-lg border border-border-soft bg-white px-4 py-3 outline-none transition focus:border-primary-green"
            />
          </div>
        </div>
      </div>
    </div>
  );
}