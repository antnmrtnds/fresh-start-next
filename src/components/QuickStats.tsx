
import { MetricsCard } from "@/components/MetricsCard"
import { Activity, Building2, BarChart3, Globe } from "lucide-react"

interface QuickStatsProps {
  loading: boolean
  results: any
  company: string
  country: string
}

export function QuickStats({ loading, results, company, country }: QuickStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricsCard
        title="Search Status"
        value={loading ? 'Active' : results ? 'Complete' : 'Ready'}
        description={loading ? 'Processing request...' : results ? 'Analysis finished' : 'Ready to search'}
        icon={Activity}
        trend={results ? { value: '+100%', type: 'up' } : undefined}
      />
      
      <MetricsCard
        title="Target Company"
        value={company || 'None'}
        description={country ? `Market: ${country}` : 'No market selected'}
        icon={Building2}
      />
      
      <MetricsCard
        title="Intelligence Status"
        value={results ? 'Available' : 'Pending'}
        description="Competitive insights"
        icon={BarChart3}
        trend={results ? { value: 'Ready', type: 'up' } : undefined}
      />
      
      <MetricsCard
        title="Market Coverage"
        value="9 Countries"
        description="Global analysis available"
        icon={Globe}
        trend={{ value: '+2 new', type: 'up' }}
      />
    </div>
  )
}
