import type { ReactNode } from "react"

interface CardProps {
  title: string
  children: ReactNode
  className?: string
  icon?: ReactNode
  isLoading?: boolean
  isEmpty?: boolean
  emptyMessage?: string
  action?: ReactNode
}

export default function Card({
  title,
  children,
  className = "",
  icon,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "No data available",
  action,
}: CardProps) {
  return (
    <div className={`gradient-border card-hover relative overflow-hidden rounded-xl bg-card shadow-sm ${className}`}>
      <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
        <div className="flex items-center gap-3">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <h2 className="text-lg font-medium text-card-foreground">{title}</h2>
        </div>
        {action && <div>{action}</div>}
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center text-muted-foreground">
            <div className="rounded-full bg-secondary p-3">{icon ? icon : <span className="text-2xl">📭</span>}</div>
            <p>{emptyMessage}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
