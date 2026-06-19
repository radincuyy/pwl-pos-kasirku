"use client"

import { useMemo, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import type { SalesTrendPoint } from "@/api/dashboardService"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/atoms/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/atoms/ui/toggle-group"
import { formatCurrency } from "@/lib/format"

type TimeRange = "90d" | "30d" | "7d"

type SalesTrendChartProps = {
  data: SalesTrendPoint[]
  description: string
}

const timeRangeDays: Record<TimeRange, number> = {
  "90d": 90,
  "30d": 30,
  "7d": 7,
}

const timeRangeLabels: Record<TimeRange, string> = {
  "90d": "3 bulan terakhir",
  "30d": "30 hari terakhir",
  "7d": "7 hari terakhir",
}

const chartConfig = {
  revenue: {
    label: "Pendapatan",
    color: "var(--chart-1)",
  },
  transactionCount: {
    label: "Transaksi",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function createDailyTrend(
  data: SalesTrendPoint[],
  dayCount: number
): SalesTrendPoint[] {
  const pointsByDate = new Map(data.map((point) => [point.date, point]))
  const today = new Date()

  return Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(today)
    date.setHours(0, 0, 0, 0)
    date.setDate(today.getDate() - (dayCount - index - 1))

    const dateKey = toDateKey(date)
    return (
      pointsByDate.get(dateKey) ?? {
        date: dateKey,
        transactionCount: 0,
        revenue: 0,
      }
    )
  })
}

function formatChartDate(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  })
}

export function SalesTrendChart({
  data,
  description,
}: SalesTrendChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("90d")
  const chartData = useMemo(
    () => createDailyTrend(data, timeRangeDays[timeRange]),
    [data, timeRange]
  )

  const handleTimeRangeChange = (value: string): void => {
    if (value === "90d" || value === "30d" || value === "7d") {
      setTimeRange(value)
    }
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Tren penjualan</CardTitle>
        <CardDescription>
          {description} untuk {timeRangeLabels[timeRange]}.
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={handleTimeRangeChange}
            variant="outline"
            spacing={0}
            className="hidden @[700px]/card:flex"
          >
            <ToggleGroupItem value="90d" className="px-4">
              3 bulan
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="px-4">
              30 hari
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="px-4">
              7 hari
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger
              size="sm"
              className="w-36 @[700px]/card:hidden"
              aria-label="Pilih rentang waktu"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectItem value="90d">3 bulan</SelectItem>
              <SelectItem value="30d">30 hari</SelectItem>
              <SelectItem value="7d">7 hari</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6">
        <ChartContainer
          config={chartConfig}
          className="h-[280px] w-full"
          initialDimension={{ width: 800, height: 280 }}
        >
          <AreaChart data={chartData} margin={{ left: 4, right: 4 }}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.55}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.04}
                />
              </linearGradient>
              <linearGradient id="fillTransactions" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-transactionCount)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-transactionCount)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={32}
              tickFormatter={formatChartDate}
            />
            <YAxis yAxisId="revenue" hide />
            <YAxis yAxisId="transactions" orientation="right" hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value) => formatChartDate(String(value))}
                  formatter={(value, name) => (
                    <div className="flex min-w-44 items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        {chartConfig[name as keyof typeof chartConfig]?.label}
                      </span>
                      <span className="font-mono font-medium tabular-nums">
                        {name === "revenue"
                          ? formatCurrency(Number(value))
                          : `${Number(value).toLocaleString("id-ID")} transaksi`}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Area
              yAxisId="revenue"
              dataKey="revenue"
              type="monotone"
              fill="url(#fillRevenue)"
              stroke="var(--color-revenue)"
              strokeWidth={2}
            />
            <Area
              yAxisId="transactions"
              dataKey="transactionCount"
              type="monotone"
              fill="url(#fillTransactions)"
              stroke="var(--color-transactionCount)"
              strokeWidth={1.5}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
