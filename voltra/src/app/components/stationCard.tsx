import Link from "next/link";
import Card from "./card";

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

type DisplayStatus =
  | "Available"
  | "Limited"
  | "Almost Full"
  | "Full"
  | "Maintenance"
  | "Inactive";

type StationCardProps = {
  station: Station;
  displayStatus: DisplayStatus;
  onViewMap: () => void;
};

export default function StationCard({ station, displayStatus, onViewMap }: StationCardProps) {
  const statusStyles = {
    Available: "bg-available text-white",
    Limited: "bg-limited text-yellow-900",
    "Almost Full": "bg-almostFull text-orange-900",
    Full: "bg-full text-white",
    Maintenance: "bg-maintenance1",
    Inactive: "bg-gray-500",
  };

  const chargerTypes = ["NORMAL", "FAST", "ULTRA"] as const;

  const chargerSummary = chargerTypes
    .map((type) => {
      const matchingSlots = station.slots.filter(
        (slot) => slot.chargerType === type
      );

      if (matchingSlots.length === 0) return null;

      return {
        type: type.charAt(0) + type.slice(1).toLowerCase(),
        power: matchingSlots[0].powerKw,
        total: matchingSlots.length,
        available: matchingSlots.filter(
          (slot) => slot.status === "AVAILABLE"
        ).length,
      };
    })
    .filter(
      (
        charger
      ): charger is {
        type: string;
        power: number;
        total: number;
        available: number;
      } => charger !== null
    );

  return (
    <Card>
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 text-white">
          <div className="items-center gap-2">
            <h3>{station.name}</h3>
          </div>

          <span
            className={`w-full max-w-[110px] rounded-full px-4 py-1 text-center text-xs font-semibold ${
              statusStyles[displayStatus]
            }`}
          >
            {displayStatus}
          </span>
        </div>
        <div>
          <p className="whitespace-nowrap text-sm mt-2 text-white">
            {station.location}, {station.area}
          </p>
        </div>

        <hr className="my-3 border-green-300"></hr>

        <div className="space-y-2 text-sm text-white">
           {chargerSummary.map((charger) => (
            <div
              key={charger.type}
              className="flex items-center justify-between"
            >
              <div>
                <p className="font-bold">
                  {charger.type} Charging
                </p>

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