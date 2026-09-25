interface PaymentStatusData {
  id: number;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  value: number;
}

interface PaymentStatusProps {
  data: PaymentStatusData[];
}

const statusConfig = {
  PAID: {
    label: "Paid",
    dot: "bg-primary-green",
    chartColor: "#16a34a",
  },
  PENDING: {
    label: "Pending",
    dot: "bg-yellow-400",
    chartColor: "#facc15",
  },
  FAILED: {
    label: "Failed",
    dot: "bg-red-400",
    chartColor: "#f87171",
  },
  REFUNDED: {
    label: "Refunded",
    dot: "bg-gray-400",
    chartColor: "#9ca3af",
  },
};

export default function PaymentStatus({
  data,
}: PaymentStatusProps) {
  const totalPayments = data.reduce(
    (total, payment) => total + payment.value,
    0,
  );

  let currentAngle = 0;

  const gradientParts = data.map((payment) => {
    const percentage =
      totalPayments > 0
        ? payment.value / totalPayments
        : 0;

    const startAngle = currentAngle;
    const endAngle =
      currentAngle + percentage * 360;

    currentAngle = endAngle;

    return `${statusConfig[payment.status].chartColor} ${startAngle}deg ${endAngle}deg`;
  });

  const donutBackground =
    totalPayments > 0
      ? `conic-gradient(${gradientParts.join(", ")})`
      : "#e5e7eb";

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm">
      {/* TITLE */}
      <div>
        <h2 className="text-base font-bold text-gray-900">
          Payment Status
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          Current payment distribution.
        </p>
      </div>

      {/* DONUT */}
      <div className="flex flex-1 items-center justify-center">
        <div
          className="relative flex h-32 w-32 items-center justify-center rounded-full"
          style={{
            background: donutBackground,
          }}
        >
          {/* INNER CIRCLE */}
          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white">
            <span className="text-xl font-bold text-gray-900">
              {totalPayments}
            </span>

            <span className="text-[10px] text-gray-500">
              Payments
            </span>
          </div>
        </div>
      </div>

      {/* STATUS LIST */}
      <div className="space-y-2">
        {data.map((payment) => {
          const config = statusConfig[payment.status];

          return (
            <div
              key={payment.id}
              className="flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${config.dot}`}
                />

                <span className="text-gray-600">
                  {config.label}
                </span>
              </div>

              <span className="font-semibold text-gray-900">
                {payment.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}