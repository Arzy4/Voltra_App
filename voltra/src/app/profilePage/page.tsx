"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "../components/footer";
import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "../lib/apiFetch";

type User = {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
};

type Payment = {
  id: number;
  bookingId: number;
  amount: string | number;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  paymentMethod: "CASH" | "CARD" | "E_WALLET";
  createdAt: string;
  updatedAt: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  const [payments, setPayments] = useState<Payment[]>([]);
  const [isPaymentsLoading, setIsPaymentsLoading] = useState(false);

  const [activeSection, setActiveSection] = useState<
    "account" | "paymentHistory" | "paymentMethods" | "security" | "preferences"
  >("account");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await apiFetch("/users/me");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to retrieve user profile."
          );
        }

        setCurrentUser(result.data);

        setEditForm({
          fullName: result.data.fullName ?? "",
          email: result.data.email ?? "",
          phoneNumber: result.data.phoneNumber ?? "",
        });

      } catch (error) {
        console.error("Failed to retrieve profile:", error);
        setCurrentUser(null);
      }
    };

    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      fetchCurrentUser();
    }
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      if (activeSection !== "paymentHistory") return;

      try {
        setIsPaymentsLoading(true);

        const response = await apiFetch("/payments");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to retrieve payment history."
          );
        }

        setPayments(result.data ?? result);
      } catch (error) {
        console.error("Failed to retrieve payment history:", error);
        setPayments([]);
      } finally {
        setIsPaymentsLoading(false);
      }
    };

    fetchPayments();
  }, [activeSection]);

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    alert("Logout successful!");
    router.push("/");
  }

  function handleCancelUpdate() {
    if (!currentUser) return;

    setEditForm({
      fullName: currentUser.fullName ?? "",
      email: currentUser.email ?? "",
      phoneNumber: currentUser.phoneNumber ?? "",
    });

    setIsEditing(false);
  }

  async function handleSaveUpdate() {
    if (!currentUser) return;

    try {
      const response = await apiFetch(`/users/${currentUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: editForm.fullName,
          email: editForm.email,
          phoneNumber: editForm.phoneNumber,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update account information."
        );
      }

      setCurrentUser(result.data);

      setEditForm({
        fullName: result.data.fullName ?? "",
        email: result.data.email ?? "",
        phoneNumber: result.data.phoneNumber ?? "",
      });

      setIsEditing(false);

      alert("Account updated successfully!");
    } catch (error) {
      console.error("Failed to update account:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update account."
      );
    }
  }

  return (
    <main className="h-screen overflow-hidden bg-background">
    <div className="mx-auto flex h-full max-w-6xl flex-col px-6 py-10">
      <h1 className="mb-8 shrink-0 text-3xl font-bold text-primary-green">
        Profile
      </h1>

      <div className="grid h-[600px] gap-8 md:grid-cols-[260px_1fr]">
        {/* LEFT SIDEBAR */}
        <aside className="h-full overflow-hidden rounded-2xl bg-white p-5 shadow-sm">
          <div className="border-b border-border-soft pb-6 text-center">
            <Image
              src="/avatar_placeholder.png"
              alt="Profile Picture Default"
              width={100}
              height={100}
              className="mx-auto rounded-full"
            />

            <h2 className="mt-4 text-lg font-bold">
              {currentUser?.fullName ?? "Guest User"}
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              {currentUser?.email ?? "Not logged in"}
            </p>
          </div>

          <nav className="mt-6">
            <button
              onClick={() => setActiveSection("account")}
              className={`w-full rounded-lg border-l-4 px-4 py-3 text-left transition ${
                activeSection === "account"
                  ? "border-primary-green bg-[#c2f3db] font-semibold text-primary-green"
                  : "border-transparent hover:bg-gray-50"
              }`}
            >
              Account Information
            </button>

            <button
              onClick={() => setActiveSection("paymentHistory")}
              className={`w-full rounded-lg border-l-4 px-4 py-3 text-left transition ${
                activeSection === "paymentHistory"
                  ? "border-primary-green bg-[#c2f3db] font-semibold text-primary-green"
                  : "border-transparent hover:bg-gray-50"
              }`}
            >
              Payment History
            </button>

            <button
              onClick={() => setActiveSection("paymentMethods")}
              className={`w-full rounded-lg border-l-4 px-4 py-3 text-left transition ${
                activeSection === "paymentMethods"
                  ? "border-primary-green bg-[#c2f3db] font-semibold text-primary-green"
                  : "border-transparent hover:bg-gray-50"
              }`}
            >
              Payment Methods
            </button>

            <button
              onClick={() => setActiveSection("security")}
              className={`w-full rounded-lg border-l-4 px-4 py-3 text-left transition ${
                activeSection === "security"
                  ? "border-primary-green bg-[#c2f3db] font-semibold text-primary-green"
                  : "border-transparent hover:bg-gray-50"
              }`}
            >
              Security
            </button>

            <button
              onClick={() => setActiveSection("preferences")}
              className={`w-full rounded-lg border-l-4 px-4 py-3 text-left transition ${
                activeSection === "preferences"
                  ? "border-primary-green bg-[#c2f3db] font-semibold text-primary-green"
                  : "border-transparent hover:bg-gray-50"
              }`}
            >
              Preferences
            </button>

            <div className="my-4 border-t border-border-soft" />

            {currentUser ? (
              <button
                onClick={handleLogout}
                className="w-full rounded-lg px-4 py-3 font-semibold text-red-600 transition hover:bg-red-50 text-center"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="block w-full rounded-lg px-4 py-3 font-semibold text-black transition hover:bg-gray-50 text-center"
              >
                Login
              </Link>
            )}
          </nav>
        </aside>

        {/* RIGHT CONTENT */}
        <section className="h-full overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="h-full overflow-y-auto p-8">
            {activeSection === "account" && (
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-primary-green">
                      Account Information
                    </h2>

                    <p className="mt-2 text-text-secondary">
                      Manage your personal account information.
                    </p>
                  </div>

                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="rounded-lg border border-primary-green px-5 py-2 font-semibold text-primary-green transition hover:bg-[#c2f3db]"
                    >
                      Update
                    </button>
                  )}
                </div>

                <div className="mt-8 space-y-6">
                  {/* FULL NAME */}
                  <div>
                    <label className="text-sm font-semibold">
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={isEditing ? editForm.fullName : currentUser?.fullName ?? ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          fullName: e.target.value,
                        })
                      }
                      readOnly={!isEditing}
                      className={`mt-2 w-full rounded-lg border px-4 py-3 outline-none transition ${
                        isEditing
                          ? "border-border-soft bg-white focus:border-primary-green"
                          : "border-border-soft bg-gray-50"
                      }`}
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="text-sm font-semibold">
                      Email
                    </label>

                    <input
                      type="email"
                      value={isEditing ? editForm.email : currentUser?.email ?? ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          email: e.target.value,
                        })
                      }
                      readOnly={!isEditing}
                      className={`mt-2 w-full rounded-lg border px-4 py-3 outline-none transition ${
                        isEditing
                          ? "border-border-soft bg-white focus:border-primary-green"
                          : "border-border-soft bg-gray-50"
                      }`}
                    />
                  </div>

                  {/* PHONE NUMBER */}
                  <div>
                    <label className="text-sm font-semibold">
                      Phone Number
                    </label>

                    <input
                      type="text"
                      value={
                        isEditing
                          ? editForm.phoneNumber
                          : currentUser?.phoneNumber ?? ""
                      }
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          phoneNumber: e.target.value,
                        })
                      }
                      readOnly={!isEditing}
                      className={`mt-2 w-full rounded-lg border px-4 py-3 outline-none transition ${
                        isEditing
                          ? "border-border-soft bg-white focus:border-primary-green"
                          : "border-border-soft bg-gray-50"
                      }`}
                    />
                  </div>
                </div>

                {/* EDIT BUTTONS */}
                {isEditing && (
                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCancelUpdate}
                      className="rounded-lg border border-border-soft px-5 py-3 font-semibold transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveUpdate}
                      className="rounded-lg bg-primary-green px-5 py-3 font-semibold text-white transition hover:opacity-90"
                    >
                      Save Update
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeSection === "paymentHistory" && (
              <div>
                <h2 className="text-2xl font-bold text-primary-green">
                  Payment History
                </h2>

                <p className="mt-2 text-text-secondary">
                  View your previous payment transactions.
                </p>

                {isPaymentsLoading ? (
                  <div className="mt-8 rounded-xl border border-border-soft p-6 text-center">
                    <p className="text-text-secondary">
                      Loading payment history...
                    </p>
                  </div>
                ) : payments.length === 0 ? (
                  <div className="mt-8 rounded-xl border border-border-soft p-6 text-center">
                    <p className="font-semibold">
                      No Payment History
                    </p>

                    <p className="mt-2 text-sm text-text-secondary">
                      Your payment transactions will appear here after you make a payment.
                    </p>
                  </div>
                ) : (
                  <div className="mt-8 space-y-4">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="rounded-xl border border-border-soft p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm text-text-secondary">
                              Payment #{payment.id}
                            </p>

                            <p className="mt-1 text-xl font-bold">
                              Rp {Number(payment.amount).toLocaleString("id-ID")}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-sm font-semibold ${
                              payment.status === "PAID"
                                ? "bg-[#c2f3db] text-primary-green"
                                : payment.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-700"
                                : payment.status === "FAILED"
                                ? "bg-red-100 text-red-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-3">
                          <div>
                            <p className="text-sm text-text-secondary">
                              Booking
                            </p>

                            <p className="mt-1 font-semibold">
                              #{payment.bookingId}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-text-secondary">
                              Payment Method
                            </p>

                            <p className="mt-1 font-semibold">
                              {payment.paymentMethod === "E_WALLET"
                                ? "E-Wallet"
                                : payment.paymentMethod === "CARD"
                                ? "Card"
                                : "Cash"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-text-secondary">
                              Date
                            </p>

                            <p className="mt-1 font-semibold">
                              {new Date(payment.createdAt).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>

                        <Link
                          href={`/bookingsPage/${payment.bookingId}`}
                          className="mt-5 inline-block font-semibold text-primary-green hover:underline"
                        >
                          View Booking Details
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === "paymentMethods" && (
                <div>
                  <h2 className="text-2xl font-bold text-primary-green">
                    Payment Methods
                  </h2>

                  <p className="mt-2 text-text-secondary">
                    Manage your saved payment and billing information.
                  </p>

                  {/* SAVED CARD */}
                  <div className="mt-8 rounded-xl border border-border-soft p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-text-secondary">
                          Card
                        </p>

                        <h3 className="mt-2 text-lg font-bold">
                          Visa
                        </h3>

                        <p className="mt-1 font-medium tracking-wider">
                          **** **** **** 1089
                        </p>

                        <p className="mt-2 text-sm text-text-secondary">
                          Expires 08/29
                        </p>
                      </div>

                      <span className="rounded-full bg-[#c2f3db] px-3 py-1 text-sm font-semibold text-primary-green">
                        Default
                      </span>
                    </div>
                  </div>

                  {/* BILLING ADDRESS */}
                  <div className="mt-6 rounded-xl border border-border-soft p-6">
                    <h3 className="text-lg font-bold">
                      Billing Address
                    </h3>

                    <div className="mt-4 space-y-1 text-sm">
                      <p className="font-semibold">
                        {currentUser?.fullName ?? "—"}
                      </p>

                      <p className="text-text-secondary">
                        Jl. Example Address
                      </p>

                      <p className="text-text-secondary">
                        Surabaya, 60241
                      </p>
                    </div>

                    <button
                      type="button"
                      className="mt-5 rounded-lg border border-primary-green px-5 py-2.5 font-semibold text-primary-green transition hover:bg-[#c2f3db]"
                    >
                      Update Billing Address
                    </button>
                  </div>

                  {/* SECURITY INFO */}
                  <div className="mt-6 rounded-xl bg-[#eefbf4] p-4">
                    <p className="text-sm text-text-secondary">
                      For security, Voltra only displays limited card information.
                      Your full card number and security code are not shown here.
                    </p>
                  </div>
                </div>
            )}

            {activeSection === "security" && (
              <div>
                <h2 className="text-2xl font-bold text-primary-green">
                  Security
                </h2>

                <p className="mt-2 text-text-secondary">
                  Manage your password and account security.
                </p>

                <div className="mt-8 rounded-xl border border-border-soft p-6">
                  <p className="text-text-secondary">
                    Password and security settings will appear here.
                  </p>
                </div>
              </div>
            )}

            {activeSection === "preferences" && (
              <div>
                <h2 className="text-2xl font-bold text-primary-green">
                  Preferences
                </h2>

                <p className="mt-2 text-text-secondary">
                  Customize your Voltra charging experience.
                </p>

                <div className="mt-8 rounded-xl border border-border-soft p-6">
                  <p className="text-text-secondary">
                    Charging and notification preferences will appear here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>

    <Footer />
  </main>
  );
}