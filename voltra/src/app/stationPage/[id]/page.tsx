import { ChargingStationsData } from "../../data/chargingStationsData";
import ChargingOptionCard from "../../components/chargingOptionCard";

type StationDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StationDetailPage({
    params,
}: StationDetailPageProps) {
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

    const { id } = await params;
    const station = ChargingStationsData.find(
        (station) => station.id === Number(id)
    );

    if (!station) {
        return(
            <main className="min-h-screen bg-[#e3fff1] p-10">
                <h1 className="text-4xl font-bold">
                    Station not found
                </h1>
            </main>
        );
    }

    const totalSlots = station.chargingTypes.reduce(
        (sum, charger) => sum + charger.total,
        0
    );

    const availableSlots = station.chargingTypes.reduce(
        (sum, charger) => sum + charger.available,
        0
    );

    const usedSlots = totalSlots - availableSlots;

    return (
        <main className="min-h-screen bg-[#e3fff1] px-8 py-12 lg:px-20">
            <section className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">

                {/* LEFT - Station Information */}
                <div>
                    <h1 className="text-5xl font-bold">
                    {station.location}
                    </h1>

                    <p className="mt-2 text-xl">
                    {station.area}
                    </p>

                    <p className="mt-2 text-text-secondary">
                    {station.address}
                    </p>

                    <div className="mt-6">
                    <span className={`rounded-full px-6 py-2 text-sm font-semibold ${getStatusColor(
                        station.status)}`}>
                        {station.status}
                    </span>
                    </div>
                </div>

                {/* RIGHT - Charging Availability */}
                <div>
                    <h2 className="mb-6 text-3xl font-bold">
                    Charging Availability
                    </h2>

                    <div className="grid grid-cols-3 rounded-3xl bg-primary-green p-8 text-white">

                    <div className="text-center">
                        <p className="text-sm opacity-80">
                        Total Slots
                        </p>

                        <p className="mt-2 text-4xl font-bold">
                        {totalSlots}
                        </p>
                    </div>

                    <div className="text-center">
                        <p className="text-sm opacity-80">
                        Available
                        </p>

                        <p className="mt-2 text-4xl font-bold">
                        {availableSlots}
                        </p>
                    </div>

                    <div className="text-center">
                        <p className="text-sm opacity-80">
                        In Use
                        </p>

                        <p className="mt-2 text-4xl font-bold">
                        {usedSlots}
                        </p>
                    </div>

                    </div>
                </div>

                </section>

            <section className="mt-14">
                <h2 className="mb-6 text-3xl font-bold">
                    Charging Options
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {station.chargingTypes.map((charger) => (
                        <ChargingOptionCard
                        key={charger.type}
                        stationId={station.id}
                        type={charger.type}
                        power={charger.power}
                        total={charger.total}
                        available={charger.available}
                        pricePerKwh={charger.pricePerKwh}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}