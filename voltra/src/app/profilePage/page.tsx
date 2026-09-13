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
  createdAt?: string;
  updatedAt?: string;
};

type Station = {
  id: number;
  name: string;
  location: string;
  area: string;
  address: string;
  latitude: number;
  longitude: number;
  status: "AVAILABLE" | "MAINTENANCE" | "INACTIVE";
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

  const [isCreatingStation, setIsCreatingStation] = useState(false);
  const [stationToDelete, setStationToDelete] = useState<Station | null>(null);
  const [isDeletingStation, setIsDeletingStation] = useState(false);

  const [stationToEdit, setStationToEdit] = useState<Station | null>(null);
  const [isUpdatingStation, setIsUpdatingStation] = useState(false);

  const [editStationForm, setEditStationForm] = useState({
    name: "",
    location: "",
    area: "",
    address: "",
    latitude: "",
    longitude: "",
    status: "AVAILABLE" as "AVAILABLE" | "MAINTENANCE" | "INACTIVE",
  });

  const [chargingSlots, setChargingSlots] = useState<ChargingSlot[]>([]);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [selectedStationFilter, setSelectedStationFilter] =
    useState<string>("ALL");

  const [slotSearchTerm, setSlotSearchTerm] = useState("");

  const [slotToDelete, setSlotToDelete] = useState<ChargingSlot | null>(null);
  const [isDeletingSlot, setIsDeletingSlot] = useState(false);
  const [slotToEdit, setSlotToEdit] = useState<ChargingSlot | null>(null);
  const [isUpdatingSlot, setIsUpdatingSlot] = useState(false);

  const [editSlotForm, setEditSlotForm] = useState({
    slotCode: "",
    stationId: "",
    chargerType: "NORMAL" as "NORMAL" | "FAST" | "ULTRA",
    powerKw: "",
    pricePerKwh: "",
    status: "AVAILABLE" as "AVAILABLE" | "OCCUPIED" | "MAINTENANCE",
  });

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
    const fetchStations = async () => {
      if (
        activeSection !== "manageStations" &&
        activeSection !== "manageSlots"
      ) {
        return;
      }

      try {
        setIsStationsLoading(true);

        const response = await apiFetch("/stations");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch charging stations."
          );
        }

        setStations(result.data ?? result);
      } catch (error) {
        console.error("Failed to fetch stations:", error);
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
      setIsCreatingStation(true);

      const response = await apiFetch("/stations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: stationForm.name,
            location: stationForm.location,
            area: stationForm.area,
            address: stationForm.address,
            latitude: Number(stationForm.latitude),
            longitude: Number(stationForm.longitude),
            status: stationForm.status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to create charging station."
        );
      }

      const createdStation = result.data ?? result;

      setStations((prevStations) => [
        ...prevStations,
        {
          ...createdStation,
          slots: createdStation.slots ?? [],
        },
      ]);
      
      setStationForm({
        name: "",
        location: "",
        area: "",
        address: "",
        latitude: "",
        longitude: "",
        status: "AVAILABLE",
      });

      setIsAddStationOpen(false);

      alert("Charging station created successfully.");
    } catch (error) {
      console.error("Failed to create station:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to create charging station."
      );
    } finally {
      setIsCreatingStation(false);
    }
  };

  const handleUpdateStation = async () => {
    if (!stationToEdit) return;

    try {
      setIsUpdatingStation(true);

      const response = await apiFetch(
        `/stations/${stationToEdit.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editStationForm.name,
            location: editStationForm.location,
            area: editStationForm.area,
            address: editStationForm.address,
            latitude: Number(editStationForm.latitude),
            longitude: Number(editStationForm.longitude),
            status: editStationForm.status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update charging station."
        );
      }

      const updatedStation = result.data ?? result;

      setStations((prevStations) =>
        prevStations.map((station) =>
          station.id === stationToEdit.id
            ? {
                ...station,
                ...updatedStation,
              }
            : station
        )
      );

      setStationToEdit(null);

      alert("Charging station updated successfully.");
    } catch (error) {
      console.error("Failed to update station:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update charging station."
      );
    } finally {
      setIsUpdatingStation(false);
    }
  };

  const handleDeleteStation = async () => {
    if (!stationToDelete) return;

    try {
      setIsDeletingStation(true);

      const response = await apiFetch(
        `/stations/${stationToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete charging station."
        );
      }

      setStations((prevStations) =>
        prevStations.filter(
          (station) => station.id !== stationToDelete.id
        )
      );

      setStationToDelete(null);

      alert("Charging station deleted successfully.");
    } catch (error) {
      console.error("Failed to delete station:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete charging station."
      );
    } finally {
      setIsDeletingStation(false);
    }
  };

  useEffect(() => {
    const fetchChargingSlots = async () => {
      if (activeSection !== "manageSlots") return;

      try {
        setIsSlotsLoading(true);
        setSlotsError(null);

        const response = await apiFetch("/charging-slots");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch charging slots."
          );
        }

        setChargingSlots(result.data ?? result);
      } catch (error) {
        console.error("Failed to fetch charging slots:", error);

        setSlotsError(
          error instanceof Error
            ? error.message
            : "Failed to load charging slots."
        );
      } finally {
        setIsSlotsLoading(false);
      }
    };

    fetchChargingSlots();
  }, [activeSection]);

  const filteredChargingSlots = chargingSlots.filter((slot) => {
    const matchesStation =
      selectedStationFilter === "ALL" ||
      String(slot.stationId) === selectedStationFilter;

    const search = slotSearchTerm.trim().toLowerCase();

    const matchesSearch =
      search === "" ||
      slot.slotCode.toLowerCase().includes(search);

    return matchesStation && matchesSearch;
  });

  const handleUpdateSlot = async () => {
    if (!slotToEdit) return;

    try {
      setIsUpdatingSlot(true);

      const response = await apiFetch(
        `/charging-slots/${slotToEdit.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slotCode: editSlotForm.slotCode,
            stationId: Number(editSlotForm.stationId),
            chargerType: editSlotForm.chargerType,
            powerKw: Number(editSlotForm.powerKw),
            pricePerKwh: Number(editSlotForm.pricePerKwh),
            status: editSlotForm.status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update charging slot."
        );
      }

      const updatedSlot = result.data ?? result;

      setChargingSlots((prevSlots) =>
        prevSlots.map((slot) =>
          slot.id === slotToEdit.id
            ? {
                ...slot,
                ...updatedSlot,
              }
            : slot
        )
      );

      setSlotToEdit(null);

      alert("Charging slot updated successfully.");
    } catch (error) {
      console.error("Failed to update charging slot:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update charging slot."
      );
    } finally {
      setIsUpdatingSlot(false);
    }
  };

  const handleDeleteSlot = async () => {
    if (!slotToDelete) return;

    try {
      setIsDeletingSlot(true);

      const response = await apiFetch(
        `/charging-slots/${slotToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete charging slot."
        );
      }

      setChargingSlots((prevSlots) =>
        prevSlots.filter(
          (slot) => slot.id !== slotToDelete.id
        )
      );

      setSlotToDelete(null);

      alert("Charging slot deleted successfully.");
    } catch (error) {
      console.error("Failed to delete charging slot:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete charging slot."
      );
    } finally {
      setIsDeletingSlot(false);
    }
  };

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

            {currentUser?.role === "USER" && (
              <>
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
              </>
            )}

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
                              onClick={() => {
                                setStationToEdit(station);

                                setEditStationForm({
                                  name: station.name,
                                  location: station.location,
                                  area: station.area,
                                  address: station.address,
                                  latitude: String(station.latitude),
                                  longitude: String(station.longitude),
                                  status: station.status,
                                });
                              }}
                              className="rounded-lg border border-primary-green px-4 py-2 text-sm font-semibold text-primary-green transition hover:bg-[#c2f3db]"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => setStationToDelete(station)}
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

            {activeSection === "manageSlots" && (
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-text-primary">
                      Manage Charging Slots
                    </h2>

                    <p className="mt-1 text-sm text-text-secondary">
                      Create, update, and manage charging slots.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="rounded-lg bg-primary-green px-5 py-3 font-semibold text-white transition hover:opacity-90"
                  >
                    + Add Slot
                  </button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-primary">
                      Station
                    </label>

                    <select
                      value={selectedStationFilter}
                      onChange={(e) => setSelectedStationFilter(e.target.value)}
                      className="w-full rounded-lg border border-border-soft bg-white px-3 py-2 text-sm outline-none focus:border-primary-green"
                    >
                      <option value="ALL">
                        All Charging Stations
                      </option>

                      {stations.map((station) => (
                        <option
                          key={station.id}
                          value={String(station.id)}
                        >
                          {station.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-primary">
                      Search
                    </label>

                    <input
                      type="text"
                      value={slotSearchTerm}
                      onChange={(e) => setSlotSearchTerm(e.target.value)}
                      placeholder="Search slot code..."
                      className="w-full rounded-lg border border-border-soft bg-white px-3 py-2 text-sm outline-none focus:border-primary-green"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {isSlotsLoading && (
                    <p className="text-sm text-text-secondary">
                      Loading charging slots...
                    </p>
                  )}

                  {slotsError && (
                    <p className="text-sm text-red-500">
                      {slotsError}
                    </p>
                  )}

                  {!isSlotsLoading &&
                    !slotsError &&
                    filteredChargingSlots.length === 0 && (
                      <p className="text-sm text-text-secondary">
                        No charging slots found.
                      </p>
                    )}

                  {!isSlotsLoading &&
                    !slotsError &&
                    filteredChargingSlots.map((slot) => {
                      const station = stations.find(
                        (station) => station.id === slot.stationId
                      );

                      return (
                        <div
                          key={slot.id}
                          className="rounded-2xl border border-border-soft bg-white p-5 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-text-primary">
                                {slot.slotCode}
                              </h3>

                              <p className="mt-1 text-sm text-text-secondary">
                                {station?.name ?? `Station #${slot.stationId}`}
                              </p>
                            </div>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                slot.status === "AVAILABLE"
                                  ? "bg-green-100 text-green-700"
                                  : slot.status === "OCCUPIED"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {slot.status}
                            </span>
                          </div>

                          <div className="mt-4">
                            <p className="text-sm text-text-primary">
                              {slot.chargerType} Charging · {slot.powerKw} kW
                            </p>

                            <p className="mt-1 text-sm text-text-secondary">
                              Rp {Number(slot.pricePerKwh).toLocaleString("id-ID")} / kWh
                            </p>
                          </div>

                          <div className="mt-5 flex justify-end gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                setSlotToEdit(slot);

                                setEditSlotForm({
                                  slotCode: slot.slotCode,
                                  stationId: String(slot.stationId),
                                  chargerType: slot.chargerType,
                                  powerKw: String(slot.powerKw),
                                  pricePerKwh: String(slot.pricePerKwh),
                                  status: slot.status,
                                });
                              }}
                              className="rounded-lg border border-primary-green px-4 py-2 text-sm font-medium text-primary-green hover:bg-green-50"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => setSlotToDelete(slot)}
                              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>

    {/* MODAL POP UP */}
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
              disabled={isCreatingStation}
              className="rounded-lg bg-primary-green px-5 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Create Station
            </button>
          </div>
        </div>
      </div>
    )}

    {stationToEdit && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
        <div className="hide-scrollbar max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-primary">
              Edit Charging Station
            </h2>

            <button
              type="button"
              onClick={() => setStationToEdit(null)}
              className="text-2xl text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-sm font-medium">
                Station Name
              </label>

              <input
                type="text"
                value={editStationForm.name}
                onChange={(e) =>
                  setEditStationForm({
                    ...editStationForm,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Location
              </label>

              <input
                type="text"
                value={editStationForm.location}
                onChange={(e) =>
                  setEditStationForm({
                    ...editStationForm,
                    location: e.target.value,
                  })
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Area
              </label>

              <input
                type="text"
                value={editStationForm.area}
                onChange={(e) =>
                  setEditStationForm({
                    ...editStationForm,
                    area: e.target.value,
                  })
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Status
              </label>

              <select
                value={editStationForm.status}
                onChange={(e) =>
                  setEditStationForm({
                    ...editStationForm,
                    status: e.target.value as
                      | "AVAILABLE"
                      | "MAINTENANCE"
                      | "INACTIVE",
                  })
                }
                className="w-full rounded-lg border px-3 py-2"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">
                Address
              </label>

              <input
                type="text"
                value={editStationForm.address}
                onChange={(e) =>
                  setEditStationForm({
                    ...editStationForm,
                    address: e.target.value,
                  })
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Latitude
              </label>

              <input
                type="number"
                step="any"
                value={editStationForm.latitude}
                onChange={(e) =>
                  setEditStationForm({
                    ...editStationForm,
                    latitude: e.target.value,
                  })
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Longitude
              </label>

              <input
                type="number"
                step="any"
                value={editStationForm.longitude}
                onChange={(e) =>
                  setEditStationForm({
                    ...editStationForm,
                    longitude: e.target.value,
                  })
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setStationToEdit(null)}
              disabled={isUpdatingStation}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleUpdateStation}
              disabled={isUpdatingStation}
              className="rounded-lg bg-primary-green px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdatingStation
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    )}

    {stationToDelete && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <h2 className="text-xl font-bold text-text-primary">
            Delete Charging Station?
          </h2>

          <p className="mt-3 text-sm text-text-secondary">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-text-primary">
              {stationToDelete.name}
            </span>
            ?
          </p>

          <p className="mt-2 text-sm text-red-500">
            This action cannot be undone.
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setStationToDelete(null)}
              disabled={isDeletingStation}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDeleteStation}
              disabled={isDeletingStation}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDeletingStation
                ? "Deleting..."
                : "Delete Station"}
            </button>
          </div>
        </div>
      </div>
    )}

    {slotToEdit && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
        <div className="hide-scrollbar max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-primary">
              Edit Charging Slot
            </h2>

            <button
              type="button"
              onClick={() => setSlotToEdit(null)}
              className="text-2xl text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-sm font-medium">
                Slot Code
              </label>

              <input
                type="text"
                value={editSlotForm.slotCode}
                onChange={(e) =>
                  setEditSlotForm({
                    ...editSlotForm,
                    slotCode: e.target.value,
                  })
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Station
              </label>

              <select
                value={editSlotForm.stationId}
                onChange={(e) =>
                  setEditSlotForm({
                    ...editSlotForm,
                    stationId: e.target.value,
                  })
                }
                className="w-full rounded-lg border px-3 py-2"
              >
                {stations.map((station) => (
                  <option
                    key={station.id}
                    value={String(station.id)}
                  >
                    {station.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Charger Type
              </label>

              <select
                value={editSlotForm.chargerType}
                onChange={(e) =>
                  setEditSlotForm({
                    ...editSlotForm,
                    chargerType: e.target.value as
                      | "NORMAL"
                      | "FAST"
                      | "ULTRA",
                  })
                }
                className="w-full rounded-lg border px-3 py-2"
              >
                <option value="NORMAL">NORMAL</option>
                <option value="FAST">FAST</option>
                <option value="ULTRA">ULTRA</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Status
              </label>

              <select
                value={editSlotForm.status}
                onChange={(e) =>
                  setEditSlotForm({
                    ...editSlotForm,
                    status: e.target.value as
                      | "AVAILABLE"
                      | "OCCUPIED"
                      | "MAINTENANCE",
                  })
                }
                className="w-full rounded-lg border px-3 py-2"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="OCCUPIED">OCCUPIED</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Power
              </label>

              <input
                type="number"
                value={editSlotForm.powerKw}
                onChange={(e) =>
                  setEditSlotForm({
                    ...editSlotForm,
                    powerKw: e.target.value,
                  })
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Price / kWh
              </label>

              <input
                type="number"
                value={editSlotForm.pricePerKwh}
                onChange={(e) =>
                  setEditSlotForm({
                    ...editSlotForm,
                    pricePerKwh: e.target.value,
                  })
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setSlotToEdit(null)}
              disabled={isUpdatingSlot}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleUpdateSlot}
              disabled={isUpdatingSlot}
              className="rounded-lg bg-primary-green px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {isUpdatingSlot ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    )}

    {slotToDelete && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <h2 className="text-xl font-bold text-text-primary">
            Delete Charging Slot?
          </h2>

          <p className="mt-3 text-sm text-text-secondary">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-text-primary">
              {slotToDelete.slotCode}
            </span>
            ?
          </p>

          <p className="mt-2 text-sm text-red-500">
            This action cannot be undone.
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setSlotToDelete(null)}
              disabled={isDeletingSlot}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDeleteSlot}
              disabled={isDeletingSlot}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDeletingSlot ? "Deleting..." : "Delete Slot"}
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