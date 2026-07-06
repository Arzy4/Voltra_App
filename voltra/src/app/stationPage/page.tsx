"use client";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import StationCard from "../components/stationCard";
import { ChargingStationsData } from "../data/chargingStationsData";
import dynamic from "next/dynamic";

export default function StationsPage() {
  const StationMap = dynamic(
    () => import("../components/stationMap"),
    {
      ssr: false,
      loading: () => (
        <div className="flex h-[600px] items-center justify-center">
          Loading map...
        </div>
      ),
    }
  );

  return (
    <main className="min-h-screen pb-24">
      <Navbar />

      <section className="px-4 pt-14">
        <div className="h-[500px] rounded-[200px] shadow-lg">
          <StationMap />
        </div>

        <h2 className="mb-4 text-xl font-bold text-black">
          All Charging Stations
        </h2>

        <div className="space-y-4">
          {ChargingStationsData.map((station) => (
            <StationCard key={station.id} station={station} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}