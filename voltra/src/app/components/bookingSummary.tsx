"use client";

type BookingSummaryProps = {
  slotCode: string;
  type: string;
  power: number;
  pricePerKwh: number;
  selectedDate: string;
  startTime: string;
  durationMinutes: number;
  onBack: () => void;
  onClose: () => void;
  onConfirm: () => void;
};

export default function BookingSummary({
  slotCode,
  type,
  power,
  pricePerKwh,
  selectedDate,
  startTime,
  durationMinutes,
  onBack,
  onClose,
  onConfirm,
}: BookingSummaryProps) {
  const durationHours = durationMinutes / 60;

  const estimatedKwh = power * durationHours;

  const estimatedTotal = estimatedKwh * pricePerKwh;

  const formatDuration = () => {
    if (durationMinutes === 30) return "30 minutes";
    if (durationMinutes === 60) return "1 hour";
    if (durationMinutes === 90) return "1.5 hours";
    if (durationMinutes === 120) return "2 hours";

    return `${durationMinutes} minutes`;
  };

  const calculateEndTime = () => {
    const [hours, minutes] = startTime.split(":").map(Number);

    const start = new Date();
    start.setHours(hours, minutes, 0, 0);

    start.setMinutes(start.getMinutes() + durationMinutes);

    return start.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-5 font-semibold text-primary-green hover:underline"
          >
            ← Back to Charging Schedule
          </button>

          <h2 className="mt-1 text-3xl font-bold">
            Booking Summary
          </h2>

          <p className="mt-2 text-text-secondary">
            Review your charging reservation before confirming.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold duration-300 hover:opacity-70"
        >
          ×
        </button>
      </div>

      <hr className="my-6 border-primary-green/20" />

      {/* CHARGING DETAILS */}
      <div>
        <h3 className="text-xl font-bold">
          Charging Details
        </h3>

        <div className="mt-3 grid grid-cols-2 gap-5 rounded-2xl bg-white p-5">
          <div>
            <p className="text-sm text-text-secondary">
              Charging Slot
            </p>

            <p className="mt-1 font-bold">
              {slotCode}
            </p>
          </div>

          <div>
            <p className="text-sm text-text-secondary">
              Charger Type
            </p>

            <p className="mt-1 font-bold">
              {type}
            </p>
          </div>

          <div>
            <p className="text-sm text-text-secondary">
              Charging Power
            </p>

            <p className="mt-1 font-bold">
              {power} kW
            </p>
          </div>

          <div>
            <p className="text-sm text-text-secondary">
              Price
            </p>

            <p className="mt-1 font-bold">
              Rp {pricePerKwh.toLocaleString("id-ID")} / kWh
            </p>
          </div>
        </div>
      </div>

      {/* SCHEDULE */}
      <div className="mt-6">
        <h3 className="text-xl font-bold">
          Schedule
        </h3>

        <div className="mt-3 grid grid-cols-2 gap-5 rounded-2xl bg-white p-5">
          <div>
            <p className="text-sm text-text-secondary">
              Date
            </p>

            <p className="mt-1 font-bold">
              {selectedDate}
            </p>
          </div>

          <div>
            <p className="text-sm text-text-secondary">
              Start Time
            </p>

            <p className="mt-1 font-bold">
              {startTime}
            </p>
          </div>

          <div>
            <p className="text-sm text-text-secondary">
              Duration
            </p>

            <p className="mt-1 font-bold">
              {formatDuration()}
            </p>
          </div>

          <div>
            <p className="text-sm text-text-secondary">
              End Time
            </p>

            <p className="mt-1 font-bold">
              {calculateEndTime()}
            </p>
          </div>
        </div>
      </div>

      {/* PRICE SUMMARY */}
      <div className="mt-6">
        <h3 className="text-xl font-bold">
          Price Summary
        </h3>

        <div className="mt-3 rounded-2xl bg-[#c2f3db] p-5">
          <div className="flex items-center justify-between">
            <p className="text-text-secondary">
              Price / kWh
            </p>

            <p className="font-semibold">
              Rp {pricePerKwh.toLocaleString("id-ID")}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-text-secondary">
              Estimated Energy
            </p>

            <p className="font-semibold">
              {estimatedKwh.toFixed(1)} kWh
            </p>
          </div>

          <hr className="my-4 border-primary-green/20" />

          <div className="flex items-center justify-between">
            <p className="text-lg font-bold">
              Estimated Total
            </p>

            <p className="text-2xl font-bold text-primary-green">
              Rp {estimatedTotal.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-text-secondary">
        * Final cost may depend on the actual energy consumed.
      </p>

      {/* CONFIRM */}
      <button
        type="button"
        onClick={onConfirm}
        className="mt-6 w-full rounded-xl bg-primary-green px-6 py-4 font-semibold text-white duration-300 hover:opacity-90"
      >
        Confirm Booking
      </button>
    </>
  );
}