import React, { useContext, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { Context, IStoreContext } from "@/store/StoreProvider"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Настраиваем ключи для чарта
const chartConfig = {
  spent: {
    label: "Spent",
    // Ключ, под который подцепится CSS-переменная "var(--color-spent)"
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

// Компонент с чартом
export const ReferralSpendingChart = observer(() => {
  const { referral } = useContext(Context) as IStoreContext

  // При первом рендере грузим первую страницу данных (по умолчанию — без month/year, но вы можете передавать сюда year/ month)
  useEffect(() => {
    referral.fetchReferralsSpentByDay()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Приводим данные store к формату для чарта
  const chartData = referral.referrals.map((item) => ({
    date: item.date,
    spent: item.totalSpent,
  }))

  // Хендлеры для пагинации
  const handlePrev = () => {
    if (referral.page > 1) {
      referral.setPage(referral.page - 1)
      referral.fetchReferralsSpentByDay()
    }
  }

  const handleNext = () => {
    if (referral.page * referral.limit < referral.totalItems) {
      referral.setPage(referral.page + 1)
      referral.fetchReferralsSpentByDay()
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Daily Spending by Referrals</CardTitle>
        <CardDescription>Click “Next” to see more days</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            {/* Сетка по оси Y */}
            <CartesianGrid vertical={false} />

            {/* Ось X — показываем дату в коротком формате */}
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => {
                // value = "2025-03-07" и т.п.
                // При желании используйте toLocaleDateString, Moment.js или dayjs
                return value.slice(5) // обрежем "2025-"
              }}
            />

            {/* Ось Y, если нужно */}
            <YAxis />

            {/* Тултип из shadcn */}
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            {/* Градиент для Area */}
            <defs>
              <linearGradient id="fillSpent" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-spent)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-spent)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            {/* Собственно Area */}
            <Area
              dataKey="spent"
              type="natural"
              fill="url(#fillSpent)"
              fillOpacity={0.4}
              stroke="var(--color-spent)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex flex-col w-full gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            {/* Пример “TrendingUp” и ваша динамика */}
            {`Показано ${chartData.length} дней`}{" "}
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground">
            Всего потрачено: <b>{referral.totalSpent.toFixed(2)}</b> TON
            <br />
            Ваш заработок (30%):{" "}
            <b>{referral.totalEarned.toFixed(2)}</b> TON
          </div>

          {/* Блок пагинации */}
          <div className="mt-2 flex items-center gap-2">
            <button
              className="border px-2 py-1 rounded"
              onClick={handlePrev}
              disabled={referral.page === 1}
            >
              Prev
            </button>
            <span>
              Страница {referral.page}
            </span>
            <button
              className="border px-2 py-1 rounded"
              onClick={handleNext}
              disabled={referral.page * referral.limit >= referral.totalItems}
            >
              Next
            </button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
})
