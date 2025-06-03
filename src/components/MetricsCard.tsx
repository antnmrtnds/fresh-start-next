
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface MetricsCardProps {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  trend?: {
    value: string
    type: 'up' | 'down' | 'neutral'
  }
  className?: string
}

export function MetricsCard({ title, value, description, icon: Icon, trend, className }: MetricsCardProps) {
  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md hover:-translate-y-1", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="flex items-center gap-2">
          {trend && (
            <Badge 
              variant={trend.type === 'up' ? 'default' : trend.type === 'down' ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {trend.value}
            </Badge>
          )}
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}
