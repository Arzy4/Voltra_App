import Link from "next/link";
import { station } from "../types/station";
import Card from "./card";

type StationCardProps = {
  station: station;
  onViewMap: () => void;
};

export default function StationCard({ station, onViewMap }: StationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-available text-white";

      case "limited":
        return "bg-limited text-yellow-900";

      case "almost full":
        return "bg-almostFull text-orange-900";

      case "full":
        return "bg-full text-white";

      default:
        return "bg-gray-300 text-gray-700";
      }
  };

  return (
    <Card>
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 text-white">
          <div className="items-center gap-2">
            <h3 className="font-bold">{station.location}</h3>
            <p className="text-sm">{station.area}</p>
          </div>

          <span className={`w-full max-w-[110px] rounded-full px-4 py-1 text-center text-xs font-semibold ${getStatusColor(
            station.status
          )}`}>
            {station.status}
          </span>
        </div>

        <hr className="my-3 border-green-300"></hr>

        <div className="space-y-2 text-sm text-white">
          {station.chargingTypes.map((charger) => (
              <div
              key={charger.type}
              className="flex items-center justify-between"
              >
              <div>
                  <p className="font-bold">{charger.type} Charging</p>
                  <p className="text-xs">
                  {charger.power} kW
                  </p>
              </div>

              <span>
                  {charger.available}/{charger.total}
              </span>
              </div>
          ))}
          </div>

        <div className="mt-auto pt-4 grid grid-cols-[2fr_1fr] gap-2 items-stretch">
          <Link
            href={`/stationPage/${station.id}`}
            className="flex items-center justify-center rounded-xl bg-green-500 px-6 py-3 text-center font-semibold text-white duration-300 hover:opacity-90"
          >
            View Charging Station Detail
          </Link>

          <button
            onClick={onViewMap}
            className="h-full w-full rounded-xl border border-green-300 px-6 py-3 font-semibold text-green-300 hover:bg-green-300 hover:text-primary-green duration-300"
          >
            View on Map
          </button> 
        </div> 
      </div> 
    </Card>
  );
}