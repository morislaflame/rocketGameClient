import { useContext, useEffect } from "react"
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

// Настраиваем ключи для чарта, используя явный цвет вместо CSS-переменной
const chartConfig = {
  spent: {
    label: "Затраты",
    color: "hsl(220, 70%, 50%)", // Явный цвет вместо --chart-1
  },
} satisfies ChartConfig

// Компонент с чартом
export const ReferralSpendingChart = observer(() => {
  const { referral } = useContext(Context) as IStoreContext

  // При первом рендере грузим первую страницу данных
  useEffect(() => {
    referral.fetchReferralsSpentByDay()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Функция для заполнения пропущенных дней нулевыми значениями
  const fillMissingDates = (data: { date: string; totalSpent: number }[]) => {
    if (data.length <= 1) return data;
    
    // Сортируем даты от самой ранней к самой поздней
    const sortedData = [...data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const result = [];
    const firstDate = new Date(sortedData[0].date);
    const lastDate = new Date(sortedData[sortedData.length - 1].date);
    
    // Создаем Map для быстрого поиска существующих дат
    const dateMap = new Map();
    sortedData.forEach(item => {
      dateMap.set(item.date, item.totalSpent);
    });
    
    // Заполняем все даты между первой и последней
    const currentDate = new Date(firstDate);
    while (currentDate <= lastDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      result.push({
        date: dateStr,
        spent: dateMap.has(dateStr) ? Number(dateMap.get(dateStr)) : 0
      });
      
      // Увеличиваем дату на 1 день
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Возвращаем результат в обратном порядке (от последней к первой)
    return result.reverse();
  };

  // Получаем исходные данные из store
  const rawData = referral.referrals?.map(item => ({
    date: item.date,
    totalSpent: Number(item.totalSpent)
  })) || [];
  
  // Заполняем пропущенные даты нулевыми значениями
  const chartData = fillMissingDates(rawData);
  
  console.log("Original data:", rawData);
  console.log("Filled data:", chartData);

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
        <CardDescription>Click "Next" to see more days</CardDescription>
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
                return value.slice(5) // обрежем "2025-"
              }}
            />

            {/* Ось Y с настройками для малых значений */}
            <YAxis 
              tickCount={5}
              allowDecimals={true}
              domain={[0, 'auto']} 
            />

            {/* Тултип из shadcn */}
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            {/* Градиент для Area с явными цветами */}
            <defs>
              <linearGradient id="fillSpent" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(220, 70%, 50%)" 
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(220, 70%, 50%)" 
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            {/* Компонент Area с явным цветом */}
            <Area
              dataKey="spent"
              type="monotone"
              fill="url(#fillSpent)"
              fillOpacity={0.6} // Увеличиваем прозрачность
              stroke="hsl(220, 70%, 50%)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex flex-col w-full gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            {/* Пример "TrendingUp" и ваша динамика */}
            {`Shown ${chartData.length} days`}{" "}
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground">
            Total spent: <b>{(referral.totalSpent ?? 0).toFixed(2)}</b> TON
            <br />
            Your earnings (30%):{" "}
            <b>{(referral.totalEarned ?? 0).toFixed(2)}</b> TON
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
              Page {referral.page}
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
