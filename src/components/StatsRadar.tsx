"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pokemon } from "@/sdk/pokeapi";

const chartConfig = {
  stat: {
    label: "Stat",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function StatsRadar({ data }: { data: Pokemon["stats"] }) {
  return (
    <Card>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[250px]"
        >
          <RadarChart
            data={Object.entries(data).map(([name, stat]) => ({ name, stat }))}
          >
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="name" />
            <PolarGrid />
            <Radar
              dataKey="stat"
              fill="var(--color-desktop)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
