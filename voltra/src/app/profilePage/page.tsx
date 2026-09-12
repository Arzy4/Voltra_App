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
  role: "USER" | "ADMIN";
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

type ChargingSlot = {
  id: number;
  stationId: number;
  slotCode: string;
  chargerType: "NORMAL" | "FAST" | "ULTRA";
  powerKw: number;
  pricePerKwh: number;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
};

type Station = {
  id: number;
  name: string;
  location: string;
  area: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  status: "AVAILABLE" | "MAINTENANCE" | "INACTIVE";
  imageUrl?: string | null;
  slots: ChargingSlot[];
};

const CHARGER_DEFAULTS = {
  NORMAL: {
    powerKw: 22,
    pricePerKwh: 2500,
  },
  FAST: {
    powerKw: 60,
    pricePerKwh: 3750,
  },
  ULTRA: {
    powerKw: 150,
    pricePerKwh: 5500,
  },
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

  const [stations, setStations] = useState<Station[]>([]);
  const [isStationsLoading, setIsStationsLoading] = useState(false);
  const [stationSearch, setStationSearch] = useState("");
  const [isAddStationOpen, setIsAddStationOpen] = useState(false);

  const [stationForm, setStationForm] = useState({
    name: "",
    location: "",
    area: "",
    address: "",
    latitude: "",
    longitude: "",
    status: "AVAILABLE" as "AVAILABLE" | "MAINTENANCE" | "INACTIVE",
    normalAmount: "0",
    fastAmount: "0",
    ultraAmount: "0",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [preferredChargerType, setPreferredChargerType] = useState("NORMAL");
  const [defaultChargingDuration, setDefaultChargingDuration] = useState("60");

  const [bookingReminders, setBookingReminders] = useState(true);
  const [paymentUpdates, setPaymentUpdates] = useState(true);

  const [distanceUnit, setDistanceUnit] = useState("KM");
  const [language, setLanguage] = useState("EN");

  const [activeSection, setActiveSection] = useState<
    | "account"
    | "paymentHistory"
    | "paymentMethods"
    | "security"
    | "preferences"
    | "manageStations"
    | "manageSlots"
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
    const fetchStations = async () => {
      if (activeSection !== "manageStations") return;

      try {
        setIsStationsLoading(true);

        const response = await apiFetch("/stations");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to retrieve charging stations."
          );
        }

        setStations(result.data ?? result);
      } catch (error) {
        console.error("Failed to retrieve charging stations:", error);
        setStations([]);
      } finally {
        setIsStationsLoading(false);
      }
    };

    fetchStations();
  }, [activeSection]);

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

  async function handleUpdatePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      alert("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }

    try {
    const response = await apiFetch("/users/me/password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        Array.isArray(result.message)
          ? result.message.join(", ")
          : result.message || "Failed to update password."
      );
    }

    alert(result.message || "Password updated successfully!");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (error) {
      console.error("Failed to update password:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update password."
      );
    }
  }

  function handleSavePreferences() {
    const preferences = {
      preferredChargerType,
      defaultChargingDuration,
      bookingReminders,
      paymentUpdates,
      distanceUnit,
      language,
    };

    localStorage.setItem(
      "voltraPreferences",
      JSON.stringify(preferences)
    );

    alert("Preferences saved successfully!");
  }

  useEffect(() => {
    const savedPreferences = localStorage.getItem("voltraPreferences");

    if (!savedPreferences) return;

    try {
      const preferences = JSON.parse(savedPreferences);

      setPreferredChargerType(
        preferences.preferredChargerType ?? "NORMAL"
      );

      setDefaultChargingDuration(
        preferences.defaultChargingDuration ?? "60"
      );

      setBookingReminders(
        preferences.bookingReminders ?? true
      );

      setPaymentUpdates(
        preferences.paymentUpdates ?? true
      );

      setDistanceUnit(
        preferences.distanceUnit ?? "KM"
      );

      setLanguage(
        preferences.language ?? "EN"
      );
    } catch (error) {
      console.error("Failed to load preferences:", error);
    }
  }, []);

  const filteredStations = stations.filter((station) => {
    const search = stationSearch.trim().toLowerCase();

    return (
      station.name.toLowerCase().includes(search) ||
      station.location.toLowerCase().includes(search) ||
      station.area.toLowerCase().includes(search) ||
      station.address.toLowerCase().includes(search)
    );
  });

  async function handleCreateStation() {
    if (
      !stationForm.name.trim() ||
      !stationForm.location.trim() ||
      !stationForm.area.trim() ||
      !stationForm.address.trim() ||
      !stationForm.latitude.trim() ||
      !stationForm.longitude.trim()
    ) {
      alert("Please fill in all required station fields.");
      return;
    }

    try {
      const stationData = {
        name: stationForm.name.trim(),
        location: stationForm.location.trim(),
        area: stationForm.area.trim(),
        address: stationForm.address.trim(),
        latitude: stationForm.latitude,
        longitude: stationForm.longitude,
        status: stationForm.status,
      };

      const response = await apiFetch("/stations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stationData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(result.message)
            ? result.message.join(", ")
            : result.message || "Failed to create charging station."
        );
      }

      const createdStation = result.data ?? result;
      const stationId = createdStation.id;
      const slotRequests: Promise<Response>[] = [];

      const normalAmount = Number(stationForm.normalAmount);
      const fastAmount = Number(stationForm.fastAmount);
      const ultraAmount = Number(stationForm.ultraAmount);
      
      // Normal Loop
      for (let i = 1; i <= normalAmount; i++) {
        slotRequests.push(
          apiFetch("/charging-slots", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              slotCode: `ST${stationId}-N${String(i).padStart(2, "0")}`,
              stationId,
              chargerType: "NORMAL",
              powerKw: CHARGER_DEFAULTS.NORMAL.powerKw,
              pricePerKwh: CHARGER_DEFAULTS.NORMAL.pricePerKwh,
              status: "AVAILABLE",
            }),
          })
        );
      }

      // Fast Loop
      for (let i = 1; i <= fastAmount; i++) {
        slotRequests.push(
          apiFetch("/charging-slots", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              slotCode: `ST${stationId}-F${String(i).padStart(2, "0")}`,
              stationId,
              chargerType: "FAST",
              powerKw: CHARGER_DEFAULTS.FAST.powerKw,
              pricePerKwh: CHARGER_DEFAULTS.FAST.pricePerKwh,
              status: "AVAILABLE",
            }),
          })
        );
      }

      // Ultra Loop
      for (let i = 1; i <= ultraAmount; i++) {
        slotRequests.push(
          apiFetch("/charging-slots", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              slotCode: `ST${stationId}-U${String(i).padStart(2, "0")}`,
              stationId,
              chargerType: "ULTRA",
              powerKw: CHARGER_DEFAULTS.ULTRA.powerKw,
              pricePerKwh: CHARGER_DEFAULTS.ULTRA.pricePerKwh,
              status: "AVAILABLE",
            }),
          })
        );
      }

      const slotResponses = await Promise.all(slotRequests);
      const failedSlotResponse = slotResponses.find(
        (response) => !response.ok
      );

      if (failedSlotResponse) {
        throw new Error(
          "Station was created, but some charging slots failed to create."
        );
      }

      alert("Charging station and charging slots created successfully!");

      setIsAddStationOpen(false);

      setStationForm({
        name: "",
        location: "",
        area: "",
        address: "",
        latitude: "",
        longitude: "",
        status: "AVAILABLE",
        normalAmount: "0",
        fastAmount: "0",
        ultraAmount: "0",
      });

      const stationsResponse = await apiFetch("/stations");
      const stationsResult = await stationsResponse.json();

      if (stationsResponse.ok) {
        setStations(stationsResult.data ?? stationsResult);
      }

    } catch (error) {
      console.error("Failed to create charging station:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to create charging station."
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
        <aside className="h-full overflow-hidden rounded-2xl bg-white px-5 py-10 shadow-sm">
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

            {currentUser?.role === "ADMIN" && (
              <>
                <button
                  onClick={() => setActiveSection("manageStations")}
                  className={`w-full rounded-lg border-l-4 px-4 py-3 text-left transition ${
                    activeSection === "manageStations"
                      ? "border-primary-green bg-[#c2f3db] font-semibold text-primary-green"
                      : "border-transparent hover:bg-gray-50"
                  }`}
                >
                  Manage Stations
                </button>

                <button
                  onClick={() => setActiveSection("manageSlots")}
                  className={`w-full rounded-lg border-l-4 px-4 py-3 text-left transition ${
                    activeSection === "manageSlots"
                      ? "border-primary-green bg-[#c2f3db] font-semibold text-primary-green"
                      : "border-transparent hover:bg-gray-50"
                  }`}
                >
                  Manage Charging Slots
                </button>
              </>
            )}

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
        <section className="hide-scrollbar h-full overflow-hidden rounded-2xl bg-white shadow-sm px-8 py-10">
          <div className="hide-scrollbar h-full overflow-y-auto">
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

            {activeSection === "manageStations" && (
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-primary-green">
                      Manage Charging Stations
                    </h2>

                    <p className="mt-2 text-text-secondary">
                      Create, update, and manage VOLTRA charging stations.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddStationOpen(true)}
                    className="rounded-lg bg-primary-green px-5 py-3 font-semibold text-white transition hover:opacity-90"
                  >
                    + Add Station
                  </button>
                </div>

                <div className="mt-8">
                  <input
                    type="text"
                    value={stationSearch}
                    onChange={(e) => setStationSearch(e.target.value)}
                    placeholder="Search charging stations..."
                    className="w-full rounded-xl border border-border-soft px-4 py-3 outline-none transition focus:border-primary-green"
                  />
                </div>

                {isStationsLoading ? (
                  <div className="mt-6 rounded-xl border border-border-soft p-6 text-center">
                    <p className="text-text-secondary">
                      Loading charging stations...
                    </p>
                  </div>
                ) : filteredStations.length === 0 ? (
                  <div className="mt-6 rounded-xl border border-border-soft p-6 text-center">
                    <p className="font-semibold">
                      No Charging Stations
                    </p>

                    <p className="mt-2 text-sm text-text-secondary">
                      No charging stations are available yet.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {filteredStations.map((station) => (
                      <div
                        key={station.id}
                        className="rounded-xl border border-border-soft p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold">
                              {station.name}
                            </h3>

                            <p className="mt-1 text-sm text-text-secondary">
                              {station.location} · {station.area}
                            </p>

                            <p className="mt-1 text-sm text-text-secondary">
                              {station.address}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              station.status === "AVAILABLE"
                                ? "bg-[#c2f3db] text-primary-green"
                                : station.status === "MAINTENANCE"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {station.status}
                          </span>
                        </div>

                        <div className="mt-5 flex items-center justify-between">
                          <p className="text-sm font-semibold">
                            {station.slots.length} Charging Slots
                          </p>

                          <div className="flex gap-2">
                            <Link
                              href={`/stationPage/${station.id}`}
                              className="rounded-lg border border-border-soft px-4 py-2 text-sm font-semibold transition hover:bg-gray-50"
                            >
                              View
                            </Link>

                            <button
                              type="button"
                              className="rounded-lg border border-primary-green px-4 py-2 text-sm font-semibold text-primary-green transition hover:bg-[#c2f3db]"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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
                          href={`/payment/transaction/${payment.id}`}
                          className="mt-5 inline-block font-semibold text-primary-green hover:underline"
                        >
                          View Transaction
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

                {/* CHANGE PASSWORD */}
                <div className="mt-8 rounded-xl border border-border-soft p-6">
                  <div className="flex items-start justify-between gap-8">

                    {/* LEFT */}
                    <div>
                      <h3 className="text-lg font-bold">
                        Change Password
                      </h3>

                      <p className="mt-2 text-sm text-text-secondary">
                        Update your password to keep your account secure.
                      </p>
                    </div>

                    {/* RIGHT - SECURITY TIPS */}
                      <div className="w-[380px] rounded-xl bg-[#eefbf4] p-4">
                        <h4 className="font-bold text-primary-green">
                          Security Tips
                        </h4>

                        <ul className="mt-2 space-y-1 text-sm text-text-secondary">
                          <li>• Use at least 8 characters.</li>
                          <li>• Combine uppercase, lowercase, and numbers.</li>
                          <li>• Avoid reusing passwords from other accounts.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 space-y-5">
                      <div>
                        <label className="text-sm font-semibold">
                          Current Password
                        </label>

                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="mt-2 w-full rounded-lg border border-border-soft bg-white px-4 py-3 outline-none transition focus:border-primary-green"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold">
                          New Password
                        </label>

                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="mt-2 w-full rounded-lg border border-border-soft bg-white px-4 py-3 outline-none transition focus:border-primary-green"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold">
                          Confirm New Password
                        </label>

                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="mt-2 w-full rounded-lg border border-border-soft bg-white px-4 py-3 outline-none transition focus:border-primary-green"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={handleUpdatePassword}
                        className="rounded-lg bg-primary-green px-6 py-3 font-semibold text-white transition hover:opacity-90"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
              </div>
            )}

            {activeSection === "preferences" && (
              <div>
                <h2 className="text-2xl font-bold text-primary-green">
                  Preferences
                </h2>

                <p className="mt-2 text-text-secondary">
                  Customize your Voltra experience.
                </p>

                {/* TOP GRID */}
                <div className="mt-8 grid gap-6 md:grid-cols-2">

                  {/* CHARGING PREFERENCES */}
                  <div className="rounded-xl border border-border-soft p-6">
                    <h3 className="text-lg font-bold">
                      Charging Preferences
                    </h3>

                    <p className="mt-2 text-sm text-text-secondary">
                      Set your preferred charging options.
                    </p>

                    <div className="mt-6 space-y-5">

                      <div>
                        <label className="text-sm font-semibold">
                          Preferred Charger Type
                        </label>

                        <select
                          value={preferredChargerType}
                          onChange={(e) => setPreferredChargerType(e.target.value)}
                          className="mt-2 w-full rounded-lg border border-border-soft bg-white px-4 py-3 outline-none transition focus:border-primary-green"
                        >
                          <option value="NORMAL">Normal</option>
                          <option value="FAST">Fast</option>
                          <option value="ULTRA">Ultra</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-semibold">
                          Default Charging Duration
                        </label>

                        <select
                          value={defaultChargingDuration}
                          onChange={(e) => setDefaultChargingDuration(e.target.value)}
                          className="mt-2 w-full rounded-lg border border-border-soft bg-white px-4 py-3 outline-none transition focus:border-primary-green"
                        >
                          <option value="30">30 minutes</option>
                          <option value="60">60 minutes</option>
                          <option value="90">90 minutes</option>
                          <option value="120">120 minutes</option>
                        </select>
                      </div>

                    </div>
                  </div>

                  {/* NOTIFICATIONS */}
                  <div className="rounded-xl border border-border-soft p-6">
                    <h3 className="text-lg font-bold">
                      Notifications
                    </h3>

                    <p className="mt-2 text-sm text-text-secondary">
                      Choose which updates you want to receive.
                    </p>

                    <div className="mt-6 space-y-5">

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">
                            Booking Reminders
                          </p>

                          <p className="mt-1 text-sm text-text-secondary">
                            Reminders about upcoming charging sessions.
                          </p>
                        </div>

                        <input
                          type="checkbox"
                          checked={bookingReminders}
                          onChange={(e) => setBookingReminders(e.target.checked)}
                          className="h-5 w-5 accent-primary-green"
                        />
                      </div>

                      <div className="border-t border-border-soft pt-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">
                              Payment Updates
                            </p>

                            <p className="mt-1 text-sm text-text-secondary">
                              Updates about your payment status.
                            </p>
                          </div>

                          <input
                            type="checkbox"
                            checked={paymentUpdates}
                            onChange={(e) => setPaymentUpdates(e.target.checked)}
                            className="h-5 w-5 accent-primary-green"
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

                {/* DISPLAY & EXPERIENCE */}
                <div className="mt-6 rounded-xl border border-border-soft p-6">
                  <h3 className="text-lg font-bold">
                    Display & Experience
                  </h3>

                  <p className="mt-2 text-sm text-text-secondary">
                    Adjust how Voltra displays information.
                  </p>

                  <div className="mt-6 grid gap-5 md:grid-cols-2">

                    <div>
                      <label className="text-sm font-semibold">
                        Distance Unit
                      </label>

                      <select
                        value={distanceUnit}
                        onChange={(e) => setDistanceUnit(e.target.value)}
                        className="mt-2 w-full rounded-lg border border-border-soft bg-white px-4 py-3 outline-none transition focus:border-primary-green"
                      >
                        <option value="KM">Kilometers</option>
                        <option value="MILES">Miles</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold">
                        Language
                      </label>

                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="mt-2 w-full rounded-lg border border-border-soft bg-white px-4 py-3 outline-none transition focus:border-primary-green"
                      >
                        <option value="EN">English</option>
                        <option value="ID">Bahasa Indonesia</option>
                      </select>
                    </div>

                  </div>
                </div>

                {/* SAVE BUTTON */}
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSavePreferences}
                    className="rounded-lg bg-primary-green px-6 py-3 font-semibold text-white transition hover:opacity-90"
                  >
                    Save Preferences
                  </button>
                </div>

              </div>
            )}
          </div>
        </section>
      </div>
    </div>

    {isAddStationOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 pb-12">
        <div className="hide-scrollbar h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-primary-green">
                Add Charging Station
              </h2>

              <p className="mt-2 text-sm text-text-secondary">
                Create a new VOLTRA charging station.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddStationOpen(false)}
              className="text-2xl text-gray-400 transition hover:text-black"
            >
              ×
            </button>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold">
                Station Name
              </label>

              <input
                type="text"
                value={stationForm.name}
                onChange={(e) =>
                  setStationForm({
                    ...stationForm,
                    name: e.target.value,
                  })
                }
                placeholder="e.g. Tunjungan Plaza 6"
                className="mt-2 w-full rounded-lg border border-border-soft px-4 py-3 outline-none focus:border-primary-green"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                Location
              </label>

              <input
                type="text"
                value={stationForm.location}
                onChange={(e) =>
                  setStationForm({
                    ...stationForm,
                    location: e.target.value,
                  })
                }
                placeholder="e.g. Kedungdoro, Tegalsari"
                className="mt-2 w-full rounded-lg border border-border-soft px-4 py-3 outline-none focus:border-primary-green"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                Area
              </label>

              <input
                type="text"
                value={stationForm.area}
                onChange={(e) =>
                  setStationForm({
                    ...stationForm,
                    area: e.target.value,
                  })
                }
                placeholder="e.g. Tegalsari"
                className="mt-2 w-full rounded-lg border border-border-soft px-4 py-3 outline-none focus:border-primary-green"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                Status
              </label>

              <select
                value={stationForm.status}
                onChange={(e) =>
                  setStationForm({
                    ...stationForm,
                    status: e.target.value as
                      | "AVAILABLE"
                      | "MAINTENANCE"
                      | "INACTIVE",
                  })
                }
                className="mt-2 w-full rounded-lg border border-border-soft bg-white px-4 py-3 outline-none focus:border-primary-green"
              >
                <option value="AVAILABLE">Available</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold">
                Address
              </label>

              <input
                type="text"
                value={stationForm.address}
                onChange={(e) =>
                  setStationForm({
                    ...stationForm,
                    address: e.target.value,
                  })
                }
                placeholder="e.g. Jl. Basuki Rahmat No.8-12, Kedungdoro, Tegalsari, Surabaya"
                className="mt-2 w-full rounded-lg border border-border-soft px-4 py-3 outline-none focus:border-primary-green"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                Latitude
              </label>

              <input
                type="number"
                step="any"
                value={stationForm.latitude}
                onChange={(e) =>
                  setStationForm({
                    ...stationForm,
                    latitude: e.target.value,
                  })
                }
                placeholder="-7.2575"
                className="mt-2 w-full rounded-lg border border-border-soft px-4 py-3 outline-none focus:border-primary-green"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                Longitude
              </label>

              <input
                type="number"
                step="any"
                value={stationForm.longitude}
                onChange={(e) =>
                  setStationForm({
                    ...stationForm,
                    longitude: e.target.value,
                  })
                }
                placeholder="112.7521"
                className="mt-2 w-full rounded-lg border border-border-soft px-4 py-3 outline-none focus:border-primary-green"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold">
                Charging Slot Amount
              </label>

              <p className="mt-1 text-sm text-text-secondary">
                Set how many charging slots should be created for each charger type.
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium">
                    Normal
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={stationForm.normalAmount}
                    onChange={(e) =>
                      setStationForm({
                        ...stationForm,
                        normalAmount: e.target.value,
                      })
                    }
                    placeholder="0"
                    className="mt-2 w-full rounded-lg border border-border-soft px-4 py-3 outline-none focus:border-primary-green"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Fast
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={stationForm.fastAmount}
                    onChange={(e) =>
                      setStationForm({
                        ...stationForm,
                        fastAmount: e.target.value,
                      })
                    }
                    placeholder="0"
                    className="mt-2 w-full rounded-lg border border-border-soft px-4 py-3 outline-none focus:border-primary-green"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Ultra
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={stationForm.ultraAmount}
                    onChange={(e) =>
                      setStationForm({
                        ...stationForm,
                        ultraAmount: e.target.value,
                      })
                    }
                    placeholder="0"
                    className="mt-2 w-full rounded-lg border border-border-soft px-4 py-3 outline-none focus:border-primary-green"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddStationOpen(false)}
              className="rounded-lg border border-border-soft px-5 py-3 font-semibold transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCreateStation}
              className="rounded-lg bg-primary-green px-5 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Create Station
            </button>
          </div>
        </div>
      </div>
    )}

    <Footer />
  </main>
  );
}