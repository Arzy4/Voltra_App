import { ChargingStationsData } from "../../data/chargingStationsData";

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
                    {station.chargingTypes.map((charger) => {
                    const usedSlots = charger.total - charger.available;

                    return (
                        <div
                        key={charger.type}
                        className="flex flex-col rounded-3xl bg-[#c2f3db] p-7 shadow-lg"
                        >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                            <p className="font-semibold text-primary-green">
                                {charger.type.toUpperCase()} CHARGING
                            </p>

                            <h3 className="mt-2 text-3xl font-bold">
                                {charger.power} kW
                            </h3>
                            </div>

                            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary-green">
                            {charger.available} Available
                            </span>
                        </div>

                        <hr className="my-6 border-primary-green/20" />

                        <div>
                            <p className="text-sm text-text-secondary">
                            Price
                            </p>

                            <p className="mt-1 text-2xl font-bold">
                            Rp {charger.pricePerKwh.toLocaleString("id-ID")}
                            <span className="text-sm font-normal">
                                {" "}/ kWh
                            </span>
                            </p>
                        </div>

                        <div className="mt-6">
                            <p className="text-sm text-text-secondary">
                            Slot Usage
                            </p>

                            <div className="mt-1 flex items-center justify-between gap-4">
                            <p className="font-semibold">
                                {charger.available} / {charger.total} available
                            </p>

                            <p className="text-sm">
                                {usedSlots} in use
                            </p>
                            </div>
                        </div>

                        <button className="mt-8 w-full rounded-xl bg-primary-green px-6 py-3 font-semibold text-white duration-300 hover:opacity-90">
                            View Charging Options
                        </button>
                        </div>
                    );
                    })}
                </div>
            </section>
        </main>
    );
}