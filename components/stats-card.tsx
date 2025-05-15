import type { ReactNode } from "react"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  trend?: "up" | "down" | "neutral"
  trendValue?: string
}

export default function StatsCard({ title, value, description, icon, trend, trendValue }: StatsCardProps) {
  return (
    <div className="gradient-border card-hover relative overflow-hidden rounded-xl bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-card-foreground">{value}</p>
            {trend && trendValue && (
              <p
                className={`ml-2 text-xs font-medium ${
                  trend === "up"
                    ? "text-green-600 dark:text-green-400"
                    : trend === "down"
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
              </p>
            )}
          </div>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>
        {icon && <div className="rounded-full bg-secondary p-3 text-secondary-foreground">{icon}</div>}
      </div>
    </div>
  )
}
