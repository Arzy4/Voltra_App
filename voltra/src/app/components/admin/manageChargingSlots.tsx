"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/apiFetch";

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

export default function ManageChargingSlots() {
    const [stations, setStations] = useState<Station[]>([]);
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

    const fetchStations = async () => {
        try {
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
        }
    };

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
    
            const response = await apiFetch(`/charging-slots/${slotToEdit.id}`,
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

    useEffect(() => {
        const fetchChargingSlots = async () => {
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
        fetchStations();
    }, []);

    return(
        <div className="flex h-full min-h-0 flex-col">
            <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-primary-green">
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

                <div className="hide-scrollbar mt-6 min-h-0 flex-1 space-y-4 overflow-y-auto pb-8 pr-2">
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

        </div>
    );
}