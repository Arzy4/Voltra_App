"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Input from "../components/input";
import StationCard from "../components/stationCard";
import Footer from "../components/footer";

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
  status: "AVAILABLE" | "MAINTENANCE" | "INACTIVE";
  description?: string;
  imageUrl?: string | null;
  slots: ChargingSlot[];
};

const StationMap = dynamic(
  () => import("../components/stationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center">
        Loading map...
      </div>
    ),
  }
);

export default function StationsPage() {
  type DisplayStatus =
  | "Available"
  | "Limited"
  | "Almost Full"
  | "Full"
  | "Maintenance"
  | "Inactive";

function getStationDisplayStatus(
  station: Station
): DisplayStatus {
  if (station.status === "MAINTENANCE") {
    return "Maintenance";
  }

  if (station.status === "INACTIVE") {
    return "Inactive";
  }

  const totalSlots = station.slots.length;

  const availableSlots = station.slots.filter(
    (slot) => slot.status === "AVAILABLE"
  ).length;

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
}

  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedStationId, setSelectedStationId] =
    useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [panelHeight, setPanelHeight] = useState(47);

  const filteredStations = stations.filter((station) => {
    const search = searchTerm.trim().toLowerCase();

    return (
      station.name.toLowerCase().includes(search) ||
      station.location.toLowerCase().includes(search) ||
      station.area.toLowerCase().includes(search) ||
      station.address.toLowerCase().includes(search)
    );
  });

  const isDragging = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(47);

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startHeight.current = panelHeight;

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!isDragging.current) return;

    const difference = startY.current - e.clientY;

    const differencePercent =
      (difference / window.innerHeight) * 100;

    const newHeight =
      startHeight.current + differencePercent;

    const limitedHeight = Math.min(
      80,
      Math.max(8, newHeight)
    );

    setPanelHeight(limitedHeight);
  };

  const handlePointerUp = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!isDragging.current) return;

    isDragging.current = false;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    if (panelHeight < 25) {
      setPanelHeight(15);
    } else if (panelHeight < 65) {
      setPanelHeight(47);
    } else {
      setPanelHeight(80);
    }
  };

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("NEXT_PUBLIC_API_URL is not defined.");
        }

        const response = await fetch(`${apiUrl}/stations`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch stations: ${response.status}`
          );
        }

        const result = await response.json();

        setStations(result.data ?? result);
      } catch (error) {
        console.error("Failed to fetch stations:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load charging stations."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStations();
  }, []);

  return (
    <>
    <main className="relative h-screen w-full overflow-hidden">
      {/* Full-screen map */}
      <div className="absolute inset-0 h-[90vh]">
        <StationMap selectedStationId={selectedStationId} stations={stations} />
      </div>

      {/* Search bar */}
      <div className="absolute top-4 left-1/2 z-30 w-full max-w-[700px] -translate-x-1/2 px-4">
        <Input
          type="text"
          placeholder="Search charging station..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white shadow-lg"
        />
      </div>

      {/* Draggable bottom panel */}
      <div
        style={{
          height: `${panelHeight}vh`,
        }}
        className="absolute bottom-0 left-0 right-0 z-20 flex flex-col rounded-t-[30px] bg-[#e3fff1] shadow-[0_-10px_30px_rgba(0,80,50,0.18)]"
      >
        {/* Drag handle */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="flex shrink-0 cursor-grab touch-none justify-center py-4 active:cursor-grabbing"
        >
          <div className="h-1.5 w-14 rounded-full bg-gray-400" />
        </div>

        {/* Scrollable cards */}
        <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-6 pb-6">
          <div className="hide-scrollbar grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <p className="col-span-full py-10 text-center text-text-secondary">
                Loading charging stations...
              </p>
            ) : error ? (
              <p className="col-span-full py-10 text-center text-red-500">
                {error}
              </p>
            ) : filteredStations.length === 0 ? (
              <p className="col-span-full py-10 text-center text-text-secondary">
                No charging stations found.
              </p>
            ) : (
              filteredStations.map((station) => (
                <StationCard
                  key={station.id}
                  station={station}
                  displayStatus={getStationDisplayStatus(station)}
                  onViewMap={() =>
                    setSelectedStationId(station.id)
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
    </>
  );
}