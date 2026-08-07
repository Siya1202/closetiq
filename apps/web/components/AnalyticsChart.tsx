"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface DataPoint {
  name: string;
  wears: number;
  cpw: number;
}

interface AnalyticsChartProps {
  data: DataPoint[];
}

export default function AnalyticsChart({ data }: AnalyticsChartProps) {
  if (!data.length) {
    return (
      <p className="font-sans text-sm text-muted italic">No data available yet.</p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barCategoryGap="30%">
        <CartesianGrid vertical={false} stroke="#0A0A0A" strokeWidth={0.5} />
        <XAxis
          dataKey="name"
          tick={{ fontFamily: "var(--font-space-grotesk)", fontSize: 14, fill: "#6D6964" }}
          axisLine={{ stroke: "#0A0A0A", strokeWidth: 2 }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontFamily: "var(--font-space-grotesk)", fontSize: 14, fill: "#6D6964" }}
          axisLine={{ stroke: "#0A0A0A", strokeWidth: 2 }}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            fontFamily: "var(--font-space-grotesk)",
            fontSize: 14,
            border: "2px solid #0A0A0A",
            borderRadius: 0,
            backgroundColor: "#F5F5F0",
            color: "#0A0A0A",
          }}
          cursor={{ fill: "#E8E5DF" }}
        />
        <Bar dataKey="wears" fill="#0A0A0A" radius={0} name="Times worn" />
      </BarChart>
    </ResponsiveContainer>
  );
}
