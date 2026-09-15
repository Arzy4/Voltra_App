const paymentStatuses = [
  {
    status: "Paid",
    value: 230,
    dot: "bg-primary-green",
  },
  {
    status: "Pending",
    value: 15,
    dot: "bg-yellow-400",
  },
  {
    status: "Failed",
    value: 8,
    dot: "bg-red-400",
  },
  {
    status: "Refunded",
    value: 4,
    dot: "bg-gray-400",
  },
];

export default function PaymentStatus() {
  const totalPayments = paymentStatuses.reduce(
    (total, payment) => total + payment.value,
    0
  );

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
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[conic-gradient(#16a34a_0deg_322deg,#facc15_322deg_343deg,#f87171_343deg_354deg,#9ca3af_354deg_360deg)]">

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
        {paymentStatuses.map((payment) => (
          <div
            key={payment.status}
            className="flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${payment.dot}`}
              />

              <span className="text-gray-600">
                {payment.status}
              </span>
            </div>

            <span className="font-semibold text-gray-900">
              {payment.value}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}