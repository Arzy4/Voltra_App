import { station } from "../types/station";
import Button from "./button";

type StationCardProps = {
  station: station;
};

export default function StationCard({ station }: StationCardProps) {
  return (
    <div className="rounded-2xl p-4 bg-white text-black shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{station.location}</h3>
          <p className="text-sm text-slate-400">{station.area}</p>
        </div>

        <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
          {station.status}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        {station.chargingTypes.map((charger) => (
            <div
            key={charger.type}
            className="flex items-center justify-between"
            >
            <div>
                <p>{charger.type} Charging</p>
                <p className="text-xs text-slate-400">
                {charger.power} kW
                </p>
            </div>

            <span>
                {charger.available}/{charger.total}
            </span>
            </div>
        ))}
        </div>

      <Button text="Book Now" />
    </div>
  );
}