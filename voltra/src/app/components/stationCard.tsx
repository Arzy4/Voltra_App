import { station } from "../types/station";
import Button from "./button";
import Card from "./card";

type StationCardProps = {
  station: station;
};

export default function StationCard({ station }: StationCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3 text-white">
        <div className="items-center gap-2">
          <h3 className="font-bold">{station.location}</h3>
          <p className="text-sm">{station.area}</p>
        </div>

        <span className="rounded-full bg-green-300 px-4 py-1 text-xs text-primary-green text-center max-w-[95px] w-full">
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

      <div className="mt-4">
        <Button text="Book Now" /> 
      </div>  
    </Card>
  );
}