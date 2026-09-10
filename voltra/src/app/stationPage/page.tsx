"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";

import Input from "../components/input";
import StationCard from "../components/stationCard";
import { ChargingStationsData } from "../data/chargingStationsData";
import Footer from "../components/footer";

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
  const [selectedStationId, setSelectedStationId] =
    useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [panelHeight, setPanelHeight] = useState(47);

  const filteredStations = ChargingStationsData.filter((station) => {
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

  return (
    <>
    <main className="relative h-screen w-full overflow-hidden">
      {/* Full-screen map */}
      <div className="absolute inset-0 h-[90vh]">
        <StationMap selectedStationId={selectedStationId} />
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
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStations.map((station) => (
              <StationCard
                key={station.id}
                station={station}
                onViewMap={() =>
                  setSelectedStationId(station.id)
                }
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
    </>
  );
}