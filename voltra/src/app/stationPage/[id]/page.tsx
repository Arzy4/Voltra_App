"use client";

import { useEffect, useState } from "react";
import ChargingOptionCard from "../../components/chargingOptionCard";
import ChargingSlotCard from "../../components/chargingSlotCard";
import BookingSummary from "../../components/bookingSummary";
import Link from "next/link";

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
  status: string;
  slots: ChargingSlot[];
};

type DisplayStatus =
  | "Available"
  | "Limited"
  | "Almost Full"
  | "Full"
  | "Maintenance"
  | "Inactive";

type StationDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
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

export default function StationDetailPage({
    params,
}: StationDetailPageProps) {
    const [stationId, setStationId] = useState<string | null>(null);
    const [station, setStation] = useState<Station | null>(null);
    const [isStationLoading, setIsStationLoading] = useState(true);
    const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
    const [selectedVehiclePreset, setSelectedVehiclePreset] = useState<Vehicle | null>(null);
    const [presetVehicles, setPresetVehicles] = useState<Vehicle[]>([]);
    const [isVehiclesLoading, setIsVehiclesLoading] = useState(false);

    const [presetAssignedSlot, setPresetAssignedSlot] =
        useState<ChargingSlot | null>(null);

    const [presetBookingStep, setPresetBookingStep] =
        useState<"preset" | "schedule" | "summary">("preset");
        
    const [presetBookingSchedule, setPresetBookingSchedule] = useState<{
        selectedDate: string;
        startTime: string;
        durationMinutes: number;
    } | null>(null);

    const handleClosePresetModal = () => {
        setSelectedVehiclePreset(null);
        setPresetBookingSchedule(null);
        setPresetBookingStep("preset")
        setPresetAssignedSlot(null);
    };

    const handleUseVehiclePreset = () => {
        if (!selectedVehiclePreset) return;

        setPresetBookingSchedule(null);
        setPresetBookingStep("schedule");
        setPresetAssignedSlot(null);
    };

    const statusStyles: Record<DisplayStatus, string> = {
        Available: "bg-available text-white",
        Limited: "bg-limited text-yellow-900",
        "Almost Full": "bg-almostFull text-orange-900",
        Full: "bg-full text-white",
        Maintenance: "bg-maintenance1 text-white",
        Inactive: "bg-gray-500 text-white",
    };

    useEffect(() => {
        async function resolveParams() {
            const resolvedParams = await params;
            setStationId(resolvedParams.id);
        }

        resolveParams();
        }, [params]);

    useEffect(() => {
        if (!stationId) return;

        async function fetchStation() {
            try {
            setIsStationLoading(true);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            if (!apiUrl) {
                throw new Error(
                "NEXT_PUBLIC_API_URL is not defined."
                );
            }

            const response = await fetch(
                `${apiUrl}/stations/${stationId}`,
                {
                cache: "no-store",
                }
            );

            if (!response.ok) {
                throw new Error(
                `Failed to fetch station: ${response.status}`
                );
            }

            const result = await response.json();

            setStation(result.data ?? result);
            } catch (error) {
            console.error("Failed to fetch station:", error);
            setStation(null);
            } finally {
            setIsStationLoading(false);
            }
        }

        fetchStation();
    }, [stationId]);

    if (isStationLoading) {
        return (
            <main className="min-h-screen bg-[#e3fff1] p-10">
            <p className="text-lg font-semibold text-primary-green">
                Loading station...
            </p>
            </main>
        );
    }

    if (!station) {
        return(
            <main className="min-h-screen bg-[#e3fff1] p-10">
                <h1 className="text-4xl font-bold">
                    Station not found
                </h1>
            </main>
        );
    }

    const chargerTypes = ["NORMAL", "FAST", "ULTRA"] as const;

    const chargingTypes = chargerTypes
    .map((chargerType) => {
        const matchingSlots = station.slots.filter(
        (slot) => slot.chargerType === chargerType
        );

        if (matchingSlots.length === 0) {
        return null;
        }

        const availableSlotsForType = matchingSlots.filter(
        (slot) => slot.status === "AVAILABLE"
        );

        const firstSlot = matchingSlots[0];

        return {
        type:
            chargerType.charAt(0) +
            chargerType.slice(1).toLowerCase(),

        power: Number(firstSlot.powerKw),

        pricePerKwh: Number(firstSlot.pricePerKwh),

        total: matchingSlots.length,

        available: availableSlotsForType.length,
        };
    })
    .filter(
        (
        charger
        ): charger is {
        type: string;
        power: number;
        pricePerKwh: number;
        total: number;
        available: number;
        } => charger !== null
    );

    const totalSlots = station.slots.length;

    const availableSlots = station.slots.filter(
    (slot) => slot.status === "AVAILABLE"
    ).length;

    const usedSlots = totalSlots - availableSlots;

    const getDisplayStatus = (): DisplayStatus => {
        if (station.status === "MAINTENANCE") {
            return "Maintenance";
        }

        if (station.status === "INACTIVE") {
            return "Inactive";
        }

        if (totalSlots === 0 || availableSlots === 0) {
            return "Full";
        }

        const availabilityPercentage =
            (availableSlots / totalSlots) * 100;

        if (availabilityPercentage <= 25) {
            return "Almost Full";
        }

        if (availabilityPercentage <= 50) {
            return "Limited";
        }

        return "Available";
    };

    const displayStatus: DisplayStatus = getDisplayStatus();

    const fetchVehicles = async () => {
        try {
            setIsVehiclesLoading(true);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const token = localStorage.getItem("accessToken");

            if (!apiUrl) {
            throw new Error("NEXT_PUBLIC_API_URL is not defined.");
            }

            if (!token) {
            throw new Error("Access token not found.");
            }

            const response = await fetch(`${apiUrl}/vehicles`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });

            if (!response.ok) {
            throw new Error(
                `Failed to fetch vehicles: ${response.status}`
            );
            }

            const result = await response.json();

            setPresetVehicles(result.data ?? []);
        } catch (error) {
            console.error("Failed to fetch vehicles:", error);
            setPresetVehicles([]);
        } finally {
            setIsVehiclesLoading(false);
        }
    };

    const presetChargingOption = selectedVehiclePreset && station
        ? station.slots.find(
            (slot) =>
            slot.chargerType ===
                selectedVehiclePreset.preferredChargerType &&
            slot.status === "AVAILABLE"
        )
        : null;

    return (
        <main className="min-h-screen bg-[#e3fff1] px-4 sm:px-8 lg:px-20 pt-8 sm:pt-12 pb-10 lg:pb-12">
            <section className="grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12">

                {/* LEFT - Station Information */}
                <div>
                     <Link
                        href="/stationPage"
                        className="mb-6 inline-flex items-center gap-2 font-semibold text-primary-green transition hover:opacity-70"
                    >
                        <span>←</span>
                        Back to Stations
                    </Link>

                    <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-center md:text-left">
                        {station.name}
                    </h1>

                    <p className="mt-2 text-base sm:text-lg leading-relaxed text-center md:text-left">
                        {station.location}, {station.address}
                    </p>

                    <div className="mt-6 text-center md:text-left">
                    <span
                        className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold ${
                        statusStyles[displayStatus]
                        }`}
                    >
                        {displayStatus}
                    </span>
                    </div>
                </div>

                {/* RIGHT - Charging Availability */}
                <div>
                    <h2 className="py-4 sm:pt-4 text-2xl sm:text-3xl font-bold text-center md:text-left">
                    Charging Availability
                    </h2>

                    <div className="grid grid-cols-3 rounded-2xl sm:rounded-3xl bg-primary-green px-3 py-6 sm:p-8 text-white">

                    <div className="text-center">
                        <p className="text-xs sm:text-sm opacity-80">
                        Total Slots
                        </p>

                        <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold">
                        {totalSlots}
                        </p>
                    </div>

                    <div className="text-center">
                        <p className="text-xs sm:text-sm opacity-80">
                        Available
                        </p>

                        <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold">
                        {availableSlots}
                        </p>
                    </div>

                    <div className="text-center">
                        <p className="text-xs sm:text-sm opacity-80">
                        In Use
                        </p>

                        <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold">
                        {usedSlots}
                        </p>
                    </div>

                    </div>
                </div>

            </section>

            <section className="mt-10 sm:mt-14">
                <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold sm:text-3xl">
                        Charging Options
                        </h2>

                        <p className="mt-2 text-sm text-text-secondary">
                        Choose a charging option manually or use one of your saved vehicle presets.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={async () => {
                            setSelectedVehiclePreset(null);
                            setIsPresetModalOpen(true);

                            await fetchVehicles();
                        }}
                        className="shrink-0 rounded-xl border border-primary-green px-5 py-3 font-semibold text-primary-green transition hover:bg-[#c2f3db]"
                    >
                        Use Saved Vehicle Preset
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {chargingTypes.map((charger) => (
                        <ChargingOptionCard
                        key={charger.type}
                        stationId={station.id}
                        type={charger.type}
                        power={charger.power}
                        total={charger.total}
                        available={charger.available}
                        pricePerKwh={charger.pricePerKwh}
                        />
                    ))}
                </div>
            </section>

            {isPresetModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">

                    <div className="flex max-h-[80vh] w-full max-w-lg flex-col rounded-2xl bg-white p-8 shadow-2xl">

                        {/* HEADER */}
                        <div className="shrink-0">
                            <h2 className="text-2xl font-bold text-primary-green">
                            Choose Vehicle Preset
                            </h2>

                            <p className="mt-2 text-sm text-text-secondary">
                            Select one of your saved vehicles to use its charging preferences.
                            </p>
                        </div>

                        {/* VEHICLE PRESETS */}
                        <div className="hide-scrollbar mt-6 min-h-0 flex-1 space-y-4 overflow-y-auto">

                            {presetVehicles.map((vehicle) => {
                                const isSelected =
                                    selectedVehiclePreset?.id === vehicle.id;

                                return (
                                    <button
                                        key={vehicle.id}
                                        type="button"
                                        onClick={() => setSelectedVehiclePreset(vehicle)}
                                        className={`w-full rounded-xl border p-5 text-left transition ${
                                            isSelected
                                            ? "border-primary-green bg-[#eefbf4]"
                                            : "border-border-soft bg-white hover:border-primary-green"
                                        }`}
                                    >
                                        {/* VEHICLE NAME */}
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm text-text-secondary">
                                                    Vehicle
                                                </p>

                                                <h3 className="mt-1 text-lg font-bold">
                                                    {vehicle.vehicleName}
                                                </h3>
                                            </div>

                                            {isSelected && (
                                                <span className="rounded-full bg-primary-green px-3 py-1 text-xs font-semibold text-white">
                                                    Selected
                                                </span>
                                            )}
                                        </div>

                                        {/* VEHICLE INFORMATION */}
                                        <div className="mt-4 grid grid-cols-3 border-t border-border-soft pt-4">

                                            <div className="text-left">
                                                <p className="text-xs text-text-secondary">
                                                    Vehicle Model
                                                </p>

                                                <p className="mt-1 text-sm font-semibold">
                                                    {vehicle.brand} | {vehicle.model}
                                                </p>
                                            </div>

                                            <div className="text-center">
                                                <p className="text-xs text-text-secondary">
                                                    Charger
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-primary-green">
                                                    {vehicle.preferredChargerType}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-xs text-text-secondary">
                                                    Duration
                                                </p>

                                                <p className="mt-1 text-sm font-semibold">
                                                    {vehicle.defaultChargingDuration} min
                                                </p>
                                            </div>

                                        </div>
                                    </button>
                                );
                            })}

                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="mt-6 flex shrink-0 justify-end gap-3 border-t border-border-soft pt-5">

                            <button
                                type="button"
                                onClick={handleClosePresetModal}
                                className="rounded-lg border border-border-soft px-5 py-3 font-semibold transition hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleUseVehiclePreset}
                                disabled={!selectedVehiclePreset}
                                className="rounded-lg bg-primary-green px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Use This Preset
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {isPresetModalOpen && presetBookingStep === "schedule" && selectedVehiclePreset && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
                    <div className="hide-scrollbar max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-[30px] bg-[#e3fff1] p-8 shadow-2xl">
                        <ChargingSlotCard
                            type={selectedVehiclePreset.preferredChargerType}
                            power={
                                presetChargingOption
                                ? Number(presetChargingOption.powerKw)
                                : undefined
                            }
                            pricePerKwh={
                                presetChargingOption
                                ? Number(presetChargingOption.pricePerKwh)
                                : undefined
                            }
                            isPresetBooking
                            vehicleName={selectedVehiclePreset.vehicleName}
                            initialDurationMinutes={
                                selectedVehiclePreset.defaultChargingDuration
                            }
                            onBack={() => {
                                setPresetBookingStep("preset");
                            }}
                            onClose={handleClosePresetModal}
                            onContinue={(
                                selectedDate,
                                startTime,
                                durationMinutes
                            ) => {
                                const compatibleSlots = station.slots.filter(
                                    (slot) =>
                                    slot.status === "AVAILABLE" &&
                                    slot.chargerType ===
                                        selectedVehiclePreset.preferredChargerType
                                );

                                if (compatibleSlots.length === 0) {
                                    alert(
                                    `No available ${selectedVehiclePreset.preferredChargerType.toLowerCase()} charging slots at this station.`
                                    );
                                    return;
                                }

                                const randomSlot =
                                    compatibleSlots[
                                    Math.floor(Math.random() * compatibleSlots.length)
                                    ];

                                setPresetAssignedSlot(randomSlot);

                                setPresetBookingSchedule({
                                    selectedDate,
                                    startTime,
                                    durationMinutes,
                                });

                                setPresetBookingStep("summary");
                            }}
                        />
                    </div>
                </div>
            )}

            {isPresetModalOpen && presetBookingStep === "summary" && selectedVehiclePreset && presetAssignedSlot && presetBookingSchedule && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
                    <div className="hide-scrollbar max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-[30px] bg-[#e3fff1] p-8 shadow-2xl">
                        <BookingSummary
                            slotCode={presetAssignedSlot.slotCode}
                            type={
                                presetAssignedSlot.chargerType.charAt(0) +
                                presetAssignedSlot.chargerType
                                .slice(1)
                                .toLowerCase()
                            }
                            power={Number(presetAssignedSlot.powerKw)}
                            pricePerKwh={Number(
                                presetAssignedSlot.pricePerKwh
                            )}
                            selectedDate={
                                presetBookingSchedule.selectedDate
                            }
                            startTime={
                                presetBookingSchedule.startTime
                            }
                            durationMinutes={
                                presetBookingSchedule.durationMinutes
                            }
                            onBack={() => {
                                setPresetAssignedSlot(null);
                                setPresetBookingStep("schedule");
                            }}
                            onClose={handleClosePresetModal}
                            onConfirm={async () => {
                                const bookingData = {
                                    slotId: presetAssignedSlot.id,
                                    startTime: new Date(
                                    `${presetBookingSchedule.selectedDate}T${presetBookingSchedule.startTime}:00`
                                    ).toISOString(),
                                    durationMinutes:
                                    presetBookingSchedule.durationMinutes,
                                };

                                const apiUrl =
                                    process.env.NEXT_PUBLIC_API_URL;

                                const accessToken =
                                    localStorage.getItem("accessToken");

                                if (!apiUrl) {
                                    throw new Error(
                                    "NEXT_PUBLIC_API_URL is not defined."
                                    );
                                }

                                if (!accessToken) {
                                    throw new Error("Please login first.");
                                }

                                const response = await fetch(
                                    `${apiUrl}/bookings`,
                                    {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${accessToken}`,
                                    },
                                    body: JSON.stringify(bookingData),
                                    }
                                );

                                const result = await response.json();

                                if (!response.ok) {
                                    throw new Error(
                                    Array.isArray(result.message)
                                        ? result.message.join(", ")
                                        : result.message ||
                                            "Failed to create booking."
                                    );
                                }

                                const newBooking = result.data;

                                localStorage.setItem(
                                    "latestBookingId",
                                    String(newBooking.id)
                                );
                            }}
                        />
                    </div>
                </div>
            )}
        </main>
    );
}