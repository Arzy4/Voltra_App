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

export default function ManageStations() {
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
    status: "AVAILABLE" as
      | "AVAILABLE"
      | "MAINTENANCE"
      | "INACTIVE",
  });

  const [isCreatingStation, setIsCreatingStation] = useState(false);
  const [stationToEdit, setStationToEdit] =useState<Station | null>(null);
  const [isUpdatingStation, setIsUpdatingStation] =useState(false);
  const [stationToDelete, setStationToDelete] =useState<Station | null>(null);
  const [isDeletingStation, setIsDeletingStation] =useState(false);
  const [editStationForm, setEditStationForm] = useState({
    name: "",
    location: "",
    area: "",
    address: "",
    latitude: "",
    longitude: "",
    status: "AVAILABLE" as
      | "AVAILABLE"
      | "MAINTENANCE"
      | "INACTIVE",
  });

  const filteredStations = stations.filter((station) => {
    const search = stationSearch.trim().toLowerCase();

    return (
      station.name.toLowerCase().includes(search) ||
      station.location.toLowerCase().includes(search) ||
      station.area.toLowerCase().includes(search) ||
      station.address.toLowerCase().includes(search)
    );
  });

  useEffect(() => {
    const fetchStations = async () => {
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
    }, []);

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

    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="flex min-h-0 flex-1 flex-col">
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

                <div className="hide-scrollbar mt-6 min-h-0 flex-1 space-y-4 overflow-y-auto pb-8 pr-2">
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
        </div>
    );
}