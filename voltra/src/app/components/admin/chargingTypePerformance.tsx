const chargingTypes = [
  {
    type: "FAST",
    bookings: 120,
    revenue: "Rp 18.5M",
  },
  {
    type: "NORMAL",
    bookings: 85,
    revenue: "Rp 10.2M",
  },
  {
    type: "ULTRA",
    bookings: 52,
    revenue: "Rp 8.75M",
  },
];

export default function ChargingTypePerformance() {
  const totalBookings = chargingTypes.reduce(
    (total, charger) => total + charger.bookings,
    0
  );

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
          {chargingTypes.map((charger) => (
            <div
              key={charger.type}
              className="grid grid-cols-[1fr_80px_120px] items-center gap-3 border-b border-gray-100 py-4"
            >
              <span className="text-sm font-semibold text-gray-800">
                {charger.type}
              </span>

              <span className="text-right text-sm font-semibold text-gray-800">
                {charger.bookings}
              </span>

              <span className="text-right text-sm font-semibold text-primary-green">
                {charger.revenue}
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
          Rp 37.45M
        </span>
      </div>
    </div>
  );
}