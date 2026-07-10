"use client";

import Footer from "../components/footer";
import Input from "../components/input";
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
      <section>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 max-w-[250px] md:max-w-[500px] lg:max-w-[700px] w-full">
          <Input type="text" placeholder="Search charging station..." />
        </div>

        <div className="h-[70svh] md:rounded-[10px] shadow-lg overflow-hidden">
          <StationMap />
        </div>
        
        <div className="space-y-4 p-6 gap-4 grid sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {ChargingStationsData.map((station) => (
            <StationCard key={station.id} station={station} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}