interface ChargingTypePerformanceData {
  id: number;
  type: "NORMAL" | "FAST" | "ULTRA";
  bookings: number;
  revenue: number;
}

interface ChargingTypePerformanceProps {
  data: ChargingTypePerformanceData[];
}

export default function ChargingTypePerformance({
  data,
}: ChargingTypePerformanceProps) {
  const totalBookings = data.reduce(
    (total, charger) => total + charger.bookings,
    0,
  );

  const totalRevenue = data.reduce(
    (total, charger) => total + charger.revenue,
    0,
  );

  const formatRevenue = (revenue: number) => {
    const millions = revenue / 1_000_000;

    return `Rp ${parseFloat(millions.toFixed(2))}M`;
  };

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm">
      {/* TITLE */}
      <div>
        <h2 className="text-base font-bold text-gray-900">
          Charging Type Performance
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          Performance based on completed bookings.
        </p>
      </div>

      {/* TABLE */}
      <div className="mt-5 flex-1">
        <div className="grid grid-cols-[1fr_80px_120px] gap-3 border-b border-gray-200 pb-3 text-xs font-semibold text-gray-500">
          <span>Charger Type</span>
          <span className="text-right">Bookings</span>
          <span className="text-right">Revenue</span>
        </div>

        <div>
          {data.map((charger) => (
            <div
              key={charger.id}
              className="grid grid-cols-[1fr_80px_120px] items-center gap-3 border-b border-gray-100 py-4"
            >
              <span className="text-sm font-semibold text-gray-800">
                {charger.type}
              </span>

              <span className="text-right text-sm font-semibold text-gray-800">
                {charger.bookings}
              </span>

              <span className="text-right text-sm font-semibold text-primary-green">
                {formatRevenue(charger.revenue)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* TOTAL */}
      <div className="grid grid-cols-[1fr_80px_120px] gap-3 pt-4">
        <span className="text-sm font-bold text-gray-900">
          Total
        </span>

        <span className="text-right text-sm font-bold text-gray-900">
          {totalBookings}
        </span>

        <span className="text-right text-sm font-bold text-primary-green">
          {formatRevenue(totalRevenue)}
        </span>
      </div>
    </div>
  );
}