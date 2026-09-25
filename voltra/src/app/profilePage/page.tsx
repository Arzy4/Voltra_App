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

type Vehicle = {
  id: number;
  userId: number;
  vehicleName: string;
  brand: string;
  model: string;
  preferredChargerType: "NORMAL" | "FAST" | "ULTRA";
  defaultChargingDuration: number;
  createdAt: string;
  updatedAt: string;
};

type PaymentHistoryItem = {
  id: string;
  bookingId: number;
  bookingCode: string;

  type:
    | "PAYMENT"
    | "ADDITIONAL_PAYMENT"
    | "REFUND";

  amount: number;

  status:
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED";

  paymentMethod:
    | "CASH"
    | "CARD"
    | "E_WALLET"
    | null;

  transactionId: string | null;
  createdAt: string;
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

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isVehiclesLoading, setIsVehiclesLoading] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [isDeleteVehicleOpen, setIsDeleteVehicleOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [isDeletingVehicle, setIsDeletingVehicle] = useState(false);
  const [isUpdateVehicleOpen, setIsUpdateVehicleOpen] = useState(false);
  const [vehicleToUpdate, setVehicleToUpdate] = useState<Vehicle | null>(null);
  const [isUpdatingVehicle, setIsUpdatingVehicle] = useState(false);

  const [vehicleForm, setVehicleForm,] = useState({
    vehicleName: "",
    brand: "",
    model: "",
    preferredChargerType: "NORMAL" as "NORMAL" | "FAST" | "ULTRA",
    defaultChargingDuration: "60"
  });

    const [updateVehicleForm, setUpdateVehicleForm] = useState({
    vehicleName: "",
    brand: "",
    model: "",
    preferredChargerType: "NORMAL" as "NORMAL" | "FAST" | "ULTRA",
    defaultChargingDuration: "60",
  });

  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [isPaymentsLoading, setIsPaymentsLoading] = useState(false);

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
    | "vehicle"
    | "paymentHistory"
    | "paymentMethods"
    | "security"
    | "preferences"
    | "manageStations"
    | "manageSlots"
  >("account");

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

        const response = await apiFetch("/payments/history");
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

  useEffect(() => {
    const fetchVehicles = async () => {
      if (activeSection !== "vehicle") return;

      try {
        setIsVehiclesLoading(true);

        const response = await apiFetch("/vehicles");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to retrieve vehicles."
          );
        }

        setVehicles(result.data ?? []);
      } catch (error) {
        console.error("Failed to retrieve vehicles:", error);
        setVehicles([]);
      } finally {
        setIsVehiclesLoading(false);
      }
    };

    fetchVehicles();
  }, [activeSection]);

  async function handleAddVehicle() {
    if (
      !vehicleForm.vehicleName.trim() ||
      !vehicleForm.brand.trim() ||
      !vehicleForm.model.trim()
    ) {
      alert("Please fill in all vehicle fields.");
      return;
    }

    try {
      setIsAddingVehicle(true);

      const response = await apiFetch("/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleName: vehicleForm.vehicleName.trim(),
          brand: vehicleForm.brand.trim(),
          model: vehicleForm.model.trim(),
          preferredChargerType: vehicleForm.preferredChargerType,
          defaultChargingDuration: Number(
            vehicleForm.defaultChargingDuration
          ),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(result.message)
            ? result.message.join(", ")
            : result.message || "Failed to add vehicle."
        );
      }

      // Add the newly created vehicle to the UI
      setVehicles((prev) => [
        result.data,
        ...prev,
      ]);

      // Reset the form
      setVehicleForm({
        vehicleName: "",
        brand: "",
        model: "",
        preferredChargerType: "NORMAL",
        defaultChargingDuration: "60",
      });

      // Close modal
      setIsAddVehicleOpen(false);

    } catch (error) {
      console.error("Failed to add vehicle:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to add vehicle."
      );
    } finally {
      setIsAddingVehicle(false);
    }
  }

  async function handleUpdateVehicle() {
    if (!vehicleToUpdate) return;

    if (
      !updateVehicleForm.vehicleName.trim() ||
      !updateVehicleForm.brand.trim() ||
      !updateVehicleForm.model.trim()
    ) {
      alert("Please fill in all vehicle fields.");
      return;
    }

    try {
      setIsUpdatingVehicle(true);

      const response = await apiFetch(
        `/vehicles/${vehicleToUpdate.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vehicleName: updateVehicleForm.vehicleName.trim(),
            brand: updateVehicleForm.brand.trim(),
            model: updateVehicleForm.model.trim(),
            preferredChargerType:
              updateVehicleForm.preferredChargerType,
            defaultChargingDuration: Number(
              updateVehicleForm.defaultChargingDuration
            ),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(result.message)
            ? result.message.join(", ")
            : result.message || "Failed to update vehicle."
        );
      }

      setVehicles((prev) =>
        prev.map((vehicle) =>
          vehicle.id === vehicleToUpdate.id
            ? result.data
            : vehicle
        )
      );

      setIsUpdateVehicleOpen(false);
      setVehicleToUpdate(null);
    } catch (error) {
      console.error("Failed to update vehicle:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update vehicle."
      );
    } finally {
      setIsUpdatingVehicle(false);
    }
}

  async function handleDeleteVehicle() {
    if (!vehicleToDelete) return;

    try {
      setIsDeletingVehicle(true);

      const response = await apiFetch(
        `/vehicles/${vehicleToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(result.message)
            ? result.message.join(", ")
            : result.message || "Failed to delete vehicle."
        );
      }

      // Remove the deleted vehicle from the UI
      setVehicles((prev) =>
        prev.filter(
          (vehicle) => vehicle.id !== vehicleToDelete.id
        )
      );

      // Close modal
      setIsDeleteVehicleOpen(false);
      setVehicleToDelete(null);

    } catch (error) {
      console.error("Failed to delete vehicle:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete vehicle."
      );
    } finally {
      setIsDeletingVehicle(false);
    }
}

  function handleLogout() {
    setModal({
      open: true,
      type: "error",
      title: "Log Out?",
      message: "Are you sure you want to log out of your VOLTRA account?",
    });
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

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 sm:px-6 pt-6 sm:pt-10 pb-22 md:pb-10">
        <h1 className="mb-6 sm:mb-8 shrink-0 text-2xl sm:text-3xl font-bold text-primary-green">
          Profile
        </h1>

        <div className="grid grid-cols-1 gap-6 md:h-[600px] md:grid-cols-[260px_1fr] md:gap-8">
          {/* LEFT SIDEBAR */}
          <aside className="flex rounded-2xl bg-white px-4 sm:px-5 py-6 md:h-full md:flex-col md:overflow-hidden md:py-10 shadow-sm">
            <div className="border-b border-border-soft pb-4 md:pb-6 text-center">
              <Image
                src="/avatar_placeholder.png"
                alt="Profile Picture Default"
                width={100}
                height={100}
                className="mx-auto h-20 w-20 md:h-[100px] md:w-[100px] rounded-full"
              />

              <h2 className="mt-4 text-lg font-bold">
                {currentUser?.fullName ?? "Guest User"}
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                {currentUser?.email ?? "Not logged in"}
              </p>
            </div>

            <nav className="hide-scrollbar mt-4 flex gap-2 overflow-x-auto pb-2 md:mt-6 md:block md:min-h-0 md:flex-1 md:overflow-y-auto md:overflow-x-hidden md:pb-0">
              <button
                onClick={() => setActiveSection("account")}
                className={`w-full rounded-lg border-l-4 px-3 py-3 text-center text-sm transition md:px-4 md:text-base md:text-left ${
                  activeSection === "account"
                    ? "border-primary-green bg-[#c2f3db] font-semibold text-primary-green"
                    : "border-transparent hover:bg-gray-50"
                }`}
              >
                Account Information
              </button>

              <button
                onClick={() => setActiveSection("vehicle")}
                className={`w-full rounded-lg border-l-4 px-3 py-3 text-center text-sm transition md:px-4 md:text-base md:text-left ${
                  activeSection === "vehicle"
                    ? "border-primary-green bg-[#c2f3db] font-semibold text-primary-green"
                    : "border-transparent hover:bg-gray-50"
                }`}
              >
                Vehicle Information
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
            </nav>

            <div className="my-3 border-t border-border-soft" />

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

              {activeSection === "vehicle" && (
                <div className="flex h-full min-h-0 flex-col">
                  <div className="shrink-0 flex justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-primary-green">
                        Vehicle Information
                      </h2>

                      <p className="mt-2 text-text-secondary">
                        Manage the vehicles and charging presets you commonly use with VOLTRA.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddVehicleOpen(true)}
                      className="rounded-lg bg-primary-green px-5 py-3 font-semibold text-white transition hover:opacity-90"
                    >
                      + Add Vehicle
                    </button>
                  </div>

                  <div className="hide-scrollbar mt-8 min-h-0 flex-1 overflow-y-auto">
                    {isVehiclesLoading ? (
                      <div className="mt-8 rounded-xl border border-border-soft p-6 text-centerrounded-xl border border-border-soft p-6 text-center">
                        <p className="text-text-secondary">
                          Loading vehicles...
                        </p>
                      </div>
                    ) : vehicles.length === 0 ? (
                      <div className="rounded-xl border border-border-soft p-6 text-center">
                        <p className="font-semibold">
                          No Vehicle Presets
                        </p>

                        <p className="mt-2 text-sm text-text-secondary">
                          Add a vehicle to create your first charging preset.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {vehicles.map((vehicle) => (
                          <div
                            key={vehicle.id}
                            className="rounded-xl border border-border-soft p-6"
                          >
                            {/* HEADER */}
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-sm font-semibold text-text-secondary">
                                  Vehicle
                                </p>

                                <h3 className="mt-1 text-xl font-bold">
                                  {vehicle.vehicleName}
                                </h3>
                              </div>

                              <div className="flex gap-4">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setVehicleToUpdate(vehicle);

                                    setUpdateVehicleForm({
                                      vehicleName: vehicle.vehicleName,
                                      brand: vehicle.brand,
                                      model: vehicle.model,
                                      preferredChargerType: vehicle.preferredChargerType,
                                      defaultChargingDuration:
                                        vehicle.defaultChargingDuration.toString(),
                                    });

                                    setIsUpdateVehicleOpen(true);
                                  }}
                                  className="rounded-lg border border-primary-green px-5 py-2.5 font-semibold text-primary-green transition hover:bg-[#c2f3db]"
                                >
                                  Update
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setVehicleToDelete(vehicle);
                                    setIsDeleteVehicleOpen(true);
                                  }}
                                  className="rounded-lg bg-red-500 px-5 py-2.5 font-semibold text-white hover:bg-red-600"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>

                            {/* VEHICLE + CHARGING INFORMATION */}
                            <div className="mt-6 grid gap-6 border-t border-border-soft pt-6 sm:grid-cols-3">

                              {/* VEHICLE DETAILS */}
                              <div>
                                <p className="text-sm text-text-secondary">
                                  Vehicle Model
                                </p>

                                <p className="mt-1 font-semibold">
                                  {vehicle.brand} | {vehicle.model}
                                </p>
                              </div>

                              {/* CHARGER TYPE */}
                              <div>
                                <p className="text-sm text-text-secondary">
                                  Preferred Charger Type
                                </p>

                                <p className="mt-1 font-semibold text-primary-green">
                                  {vehicle.preferredChargerType}
                                </p>
                              </div>

                              {/* DURATION */}
                              <div>
                                <p className="text-sm text-text-secondary">
                                  Default Charging Duration
                                </p>

                                <p className="mt-1 font-semibold">
                                  {vehicle.defaultChargingDuration} minutes
                                </p>
                              </div>

                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
                              <p className="text-sm font-semibold text-text-secondary">
                                {payment.type === "PAYMENT"
                                  ? "Original Payment"
                                  : payment.type === "ADDITIONAL_PAYMENT"
                                    ? "Additional Payment"
                                    : "Refund"}
                              </p>

                              <p className="mt-1 text-sm text-text-secondary">
                                {payment.bookingCode}
                              </p>

                              <p
                                className={`mt-2 text-xl font-bold ${
                                  payment.type === "REFUND"
                                    ? "text-red-600"
                                    : payment.type === "ADDITIONAL_PAYMENT"
                                      ? "text-primary-green"
                                      : ""
                                }`}
                              >
                                {payment.type === "REFUND"
                                  ? "- "
                                  : payment.type === "ADDITIONAL_PAYMENT"
                                    ? "+ "
                                    : ""}
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
                                #{payment.bookingCode}
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

                          {payment.transactionId && (
                            <div className="mt-5 border-b border-border-soft py-4">
                              <p className="text-sm text-text-secondary">
                                Transaction ID
                              </p>

                              <p className="mt-1 break-all font-semibold">
                                {payment.transactionId}
                              </p>
                            </div>
                          )}

                          <Link
                            href={`/payment/transaction/${payment.id}`}
                            className="mt-4 flex font-semibold text-primary-green hover:underline justify-center items-center"
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
                            <option value="60">1 hour</option>
                            <option value="90">1.5 hours</option>
                            <option value="120">2 hours</option>
                            <option value="180">3 hours</option>
                            <option value="240">4 hours</option>
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

      {isAddVehicleOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
            
            {/* HEADER */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-primary-green">
                  Add Vehicle
                </h2>

                <p className="mt-2 text-sm text-text-secondary">
                  Add a vehicle and set its default charging preferences.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddVehicleOpen(false)}
                className="text-2xl text-gray-400 transition hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {/* FORM */}
            <div className="mt-7 space-y-5">
              
              {/* VEHICLE NAME */}
              <div>
                <label className="text-sm font-semibold">
                  Vehicle Name
                </label>

                <input
                  type="text"
                  value={vehicleForm.vehicleName}
                  onChange={(e) =>
                    setVehicleForm({
                      ...vehicleForm,
                      vehicleName: e.target.value,
                    })
                  }
                  placeholder="e.g. Jason's Tesla"
                  className="mt-2 w-full rounded-lg border border-border-soft px-4 py-3 outline-none transition focus:border-primary-green"
                />
              </div>

              {/* BRAND + MODEL */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold">
                    Brand
                  </label>

                  <input
                    type="text"
                    value={vehicleForm.brand}
                    onChange={(e) =>
                      setVehicleForm({
                        ...vehicleForm,
                        brand: e.target.value,
                      })
                    }
                    placeholder="e.g. Tesla"
                    className="mt-2 w-full rounded-lg border border-border-soft px-4 py-3 outline-none transition focus:border-primary-green"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    Model
                  </label>

                  <input
                    type="text"
                    value={vehicleForm.model}
                    onChange={(e) =>
                      setVehicleForm({
                        ...vehicleForm,
                        model: e.target.value,
                      })
                    }
                    placeholder="e.g. Model 3"
                    className="mt-2 w-full rounded-lg border border-border-soft px-4 py-3 outline-none transition focus:border-primary-green"
                  />
                </div>
              </div>

              {/* CHARGER TYPE */}
              <div>
                <label className="text-sm font-semibold">
                  Preferred Charger Type
                </label>

                <select
                  value={vehicleForm.preferredChargerType}
                  onChange={(e) =>
                    setVehicleForm({
                      ...vehicleForm,
                      preferredChargerType: e.target.value as
                        | "NORMAL"
                        | "FAST"
                        | "ULTRA",
                    })
                  }
                  className="mt-2 w-full rounded-lg border border-border-soft bg-white px-4 py-3 outline-none transition focus:border-primary-green"
                >
                  <option value="NORMAL">Normal</option>
                  <option value="FAST">Fast</option>
                  <option value="ULTRA">Ultra</option>
                </select>
              </div>

              {/* DURATION */}
              <div>
                <label className="text-sm font-semibold">
                  Default Charging Duration
                </label>

                <select
                  value={vehicleForm.defaultChargingDuration}
                  onChange={(e) =>
                    setVehicleForm({
                      ...vehicleForm,
                      defaultChargingDuration: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-lg border border-border-soft bg-white px-4 py-3 outline-none transition focus:border-primary-green"
                >
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                  <option value="180">3 hours</option>
                  <option value="240">4 hours</option>
                </select>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddVehicleOpen(false)}
                className="rounded-lg border border-border-soft px-5 py-3 font-semibold transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddVehicle}
                disabled={isAddingVehicle}
                className="rounded-lg bg-primary-green px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAddingVehicle ? "Adding..." : "Add Vehicle"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isUpdateVehicleOpen && vehicleToUpdate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">

            {/* HEADER */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-primary-green">
                  Update Vehicle
                </h2>

                <p className="mt-2 text-sm text-text-secondary">
                  Update your vehicle and its default charging preferences.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsUpdateVehicleOpen(false);
                  setVehicleToUpdate(null);
                }}
                className="text-2xl text-gray-400 transition hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {/* FORM */}
            <div className="mt-7 space-y-5">

              {/* VEHICLE NAME */}
              <div>
                <label className="text-sm font-semibold">
                  Vehicle Name
                </label>

                <input
                  type="text"
                  value={updateVehicleForm.vehicleName}
                  onChange={(e) =>
                    setUpdateVehicleForm({
                      ...updateVehicleForm,
                      vehicleName: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-lg border border-border-soft px-4 py-3 outline-none transition focus:border-primary-green"
                />
              </div>

              {/* BRAND + MODEL */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold">
                    Brand
                  </label>

                  <input
                    type="text"
                    value={updateVehicleForm.brand}
                    onChange={(e) =>
                      setUpdateVehicleForm({
                        ...updateVehicleForm,
                        brand: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-lg border border-border-soft px-4 py-3 outline-none transition focus:border-primary-green"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    Model
                  </label>

                  <input
                    type="text"
                    value={updateVehicleForm.model}
                    onChange={(e) =>
                      setUpdateVehicleForm({
                        ...updateVehicleForm,
                        model: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-lg border border-border-soft px-4 py-3 outline-none transition focus:border-primary-green"
                  />
                </div>
              </div>

              {/* CHARGER TYPE */}
              <div>
                <label className="text-sm font-semibold">
                  Preferred Charger Type
                </label>

                <select
                  value={updateVehicleForm.preferredChargerType}
                  onChange={(e) =>
                    setUpdateVehicleForm({
                      ...updateVehicleForm,
                      preferredChargerType: e.target.value as
                        | "NORMAL"
                        | "FAST"
                        | "ULTRA",
                    })
                  }
                  className="mt-2 w-full rounded-lg border border-border-soft bg-white px-4 py-3 outline-none transition focus:border-primary-green"
                >
                  <option value="NORMAL">Normal</option>
                  <option value="FAST">Fast</option>
                  <option value="ULTRA">Ultra</option>
                </select>
              </div>

              {/* DURATION */}
              <div>
                <label className="text-sm font-semibold">
                  Default Charging Duration
                </label>

                <select
                  value={updateVehicleForm.defaultChargingDuration}
                  onChange={(e) =>
                    setUpdateVehicleForm({
                      ...updateVehicleForm,
                      defaultChargingDuration: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-lg border border-border-soft bg-white px-4 py-3 outline-none transition focus:border-primary-green"
                >
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                  <option value="180">3 hours</option>
                  <option value="240">4 hours</option>
                </select>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsUpdateVehicleOpen(false);
                  setVehicleToUpdate(null);
                }}
                disabled={isUpdatingVehicle}
                className="rounded-lg border border-border-soft px-5 py-3 font-semibold transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdateVehicle}
                disabled={isUpdatingVehicle}
                className="rounded-lg bg-primary-green px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUpdatingVehicle ? "Updating..." : "Save Update"}
              </button>
            </div>

          </div>
        </div>
      )}

      {isDeleteVehicleOpen && vehicleToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">

            {/* ICON */}
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
              <span className="text-2xl font-bold">!</span>
            </div>

            {/* TITLE */}
            <h2 className="text-center text-2xl font-bold text-gray-900">
              Delete Vehicle?
            </h2>

            {/* MESSAGE */}
            <p className="mt-3 text-center text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {vehicleToDelete.vehicleName}
              </span>
              ? This vehicle preset will be permanently removed.
            </p>

            {/* VEHICLE INFO */}
            <div className="mt-6 rounded-xl bg-gray-50 p-4 text-center">
              <p className="font-semibold">
                {vehicleToDelete.brand} | {vehicleToDelete.model}
              </p>

              <p className="mt-1 text-sm text-text-secondary">
                {vehicleToDelete.preferredChargerType} •{" "}
                {vehicleToDelete.defaultChargingDuration} minutes
              </p>
            </div>

            {/* ACTIONS */}
            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteVehicleOpen(false);
                  setVehicleToDelete(null);
                }}
                disabled={isDeletingVehicle}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteVehicle}
                disabled={isDeletingVehicle}
                className="w-full rounded-xl bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeletingVehicle ? "Deleting..." : "Delete Vehicle"}
              </button>
            </div>

          </div>
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">

            <div
              className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full ${
                modal.type === "success"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              <span className="text-2xl">
                {modal.type === "success" ? "✓" : "!"}
              </span>
            </div>

            <h2 className="text-center text-2xl font-bold text-gray-900">
              {modal.type === "success"
                ? "See You Again!"
                : "Log Out?"}
            </h2>

            <p className="mt-3 text-center text-gray-600">
              {modal.type === "success"
                ? "You have been logged out of VOLTRA successfully."
                : "Are you sure you want to log out of your VOLTRA account?"}
            </p>

            {modal.type === "success" ? (
              <button
                type="button"
                onClick={() => {
                  setModal((prev) => ({
                    ...prev,
                    open: false,
                  }));

                  router.push("/");
                }}
                className="mt-7 w-full rounded-xl bg-primary-green px-4 py-3 font-semibold text-white duration-300 hover:opacity-90"
              >
                Back to Home
              </button>
            ) : (
              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setModal((prev) => ({
                      ...prev,
                      open: false,
                    }));
                  }}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 duration-300 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("currentUser");

                    setCurrentUser(null);

                    setModal({
                      open: true,
                      type: "success",
                      title: "See You Again!",
                      message: "You have been logged out of VOLTRA successfully.",
                    });
                  }}
                  className="w-full rounded-xl bg-red-500 px-4 py-3 font-semibold text-white duration-300 hover:bg-red-600"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}