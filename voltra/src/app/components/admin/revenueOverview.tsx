"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface RevenueOverviewData {
  id: number;
  month: string;
  revenue: number;
}

interface RevenueOverviewProps {
  data: RevenueOverviewData[];
}

function formatRevenue(value: number) {
  if (value >= 1_000_000) {
    return `Rp ${value / 1_000_000}M`;
  }

  return `Rp ${value.toLocaleString("id-ID")}`;
}

export default function RevenueOverview({
  data,
}: RevenueOverviewProps) {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl bg-white p-5 shadow-sm">
      {/* HEADER */}
      <div className="flex shrink-0 items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Revenue Overview
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Monthly revenue generated from paid bookings.
          </p>
        </div>

        <select className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 outline-none">
          <option>This Year</option>
        </select>
      </div>

      {/* CHART */}
      <div className="mt-4 min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 5,
              bottom: 0,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
              tickFormatter={formatRevenue}
              width={65}
            />

            <Tooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.03)" }}
              formatter={(value) => [
                formatRevenue(Number(value)),
                "Revenue",
              ]}
            />

            <Bar
              dataKey="revenue"
              fill="#008f68"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}