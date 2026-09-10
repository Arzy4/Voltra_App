"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "../../lib/apiFetch";

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

return (
  <main className="min-h-screen bg-background px-6 py-13">
    <div className="mx-auto h-[680px] max-w-5xl overflow-hidden rounded-3xl bg-white shadow-lg">
      <div className="grid h-full md:grid-cols-2">

        {/* LEFT SIDE - PAYMENT SUMMARY */}
        <section className="h-full p-8 md:p-12">
          <h1 className="text-4xl font-bold text-primary-green">
            Payment
          </h1>

          <p className="mt-3 text-lg font-semibold">
            #{booking.bookingCode}
          </p>

          <p className="mt-2 text-sm text-text-secondary">
            Complete your payment to confirm your booking.
          </p>

          <div className="my-8 border-t border-border-soft" />

          <div className="space-y-6">
            <div className="grid grid-cols-[140px_1fr] gap-4">
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

          <div className="my-8 border-t border-border-soft" />

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

                <span className="text-3xl font-bold text-primary-green">
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
                          value={cardNumber}
                          onChange={(e) =>
                            setCardNumber(e.target.value)
                          }
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
                            value={expiryDate}
                            onChange={(e) =>
                              setExpiryDate(e.target.value)
                            }
                            placeholder="MM / YY"
                            className="mt-2 w-full rounded-lg border border-border-soft bg-white px-4 py-3 outline-none transition focus:border-primary-green"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">
                            CVC / CVV
                          </label>

                          <input
                            type="password"
                            value={cvv}
                            onChange={(e) =>
                              setCvv(e.target.value)
                            }
                            placeholder="***"
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