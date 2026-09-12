import ChargingOptionCard from "../../components/chargingOptionCard";

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
  status: string;
  slots: ChargingSlot[];
};

type DisplayStatus =
  | "Available"
  | "Limited"
  | "Almost Full"
  | "Full"
  | "Maintenance"
  | "Inactive";

type StationDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StationDetailPage({
    params,
}: StationDetailPageProps) {
    const statusStyles: Record<DisplayStatus, string> = {
        Available: "bg-available text-white",
        Limited: "bg-limited text-yellow-900",
        "Almost Full": "bg-almostFull text-orange-900",
        Full: "bg-full text-white",
        Maintenance: "bg-maintenance1 text-white",
        Inactive: "bg-gray-500 text-white",
    };

    const { id } = await params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined.");
    }

    let station: Station | null = null;

    try {
        const response = await fetch(`${apiUrl}/stations/${id}`, {
            cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch station: ${response.status}`
        );
    }

    const result = await response.json();

    station = result.data ?? result;
    } catch (error) {
    console.error("Failed to fetch station:", error);
    }

    if (!station) {
        return(
            <main className="min-h-screen bg-[#e3fff1] p-10">
                <h1 className="text-4xl font-bold">
                    Station not found
                </h1>
            </main>
        );
    }

    const chargerTypes = ["NORMAL", "FAST", "ULTRA"] as const;

    const chargingTypes = chargerTypes
    .map((chargerType) => {
        const matchingSlots = station.slots.filter(
        (slot) => slot.chargerType === chargerType
        );

        if (matchingSlots.length === 0) {
        return null;
        }

        const availableSlotsForType = matchingSlots.filter(
        (slot) => slot.status === "AVAILABLE"
        );

        const firstSlot = matchingSlots[0];

        return {
        type:
            chargerType.charAt(0) +
            chargerType.slice(1).toLowerCase(),

        power: Number(firstSlot.powerKw),

        pricePerKwh: Number(firstSlot.pricePerKwh),

        total: matchingSlots.length,

        available: availableSlotsForType.length,
        };
    })
    .filter(
        (
        charger
        ): charger is {
        type: string;
        power: number;
        pricePerKwh: number;
        total: number;
        available: number;
        } => charger !== null
    );

    const totalSlots = station.slots.length;

    const availableSlots = station.slots.filter(
    (slot) => slot.status === "AVAILABLE"
    ).length;

    const usedSlots = totalSlots - availableSlots;

    const getDisplayStatus = (): DisplayStatus => {
        if (station.status === "MAINTENANCE") {
            return "Maintenance";
        }

        if (station.status === "INACTIVE") {
            return "Inactive";
        }

        if (totalSlots === 0 || availableSlots === 0) {
            return "Full";
        }

        const availabilityPercentage =
            (availableSlots / totalSlots) * 100;

        if (availabilityPercentage <= 25) {
            return "Almost Full";
        }

        if (availabilityPercentage <= 50) {
            return "Limited";
        }

        return "Available";
    };

    const displayStatus: DisplayStatus = getDisplayStatus();

    return (
        <main className="min-h-screen bg-[#e3fff1] px-8 py-12 lg:px-20">
            <section className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">

                {/* LEFT - Station Information */}
                <div>
                    <h1 className="text-5xl font-bold">
                        {station.name}
                    </h1>

                    <p className="mt-2 text-xl">
                        {station.location}
                    </p>

                    <p className="mt-2 text-text-secondary">
                        {station.address}
                    </p>

                    <div className="mt-6">
                    <span
                        className={`w-full max-w-[110px] rounded-full px-6 py-4 text-center text-md font-semibold ${
                        statusStyles[displayStatus]
                        }`}
                    >
                        {displayStatus}
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
                    {chargingTypes.map((charger) => (
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