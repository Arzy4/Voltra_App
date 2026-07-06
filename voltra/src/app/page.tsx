import Navbar from "./components/navbar";
import Footer from "./components/footer";
import StationCard from "./components/stationCard";
import { ChargingStationsData } from "./data/chargingStationsData";

export default function Home() {
  return (
    <main className="min-h-screen pb-24">
      <Navbar />

      <section className="px-4 pt-14">
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