
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Eye, Clock, MapPin } from "lucide-react"

interface ResultsDisplayProps {
  results: any
  company: string
  country: string
}

const countryNames = {
  US: 'United States',
  BR: 'Brazil', 
  GB: 'United Kingdom',
  PT: 'Portugal',
  ES: 'Spain',
  FR: 'France',
  DE: 'Germany',
  IT: 'Italy',
  NL: 'Netherlands'
}

export function ResultsDisplay({ results, company, country }: ResultsDisplayProps) {
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-blue-600">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                Analysis Complete
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Competitive intelligence data for {company}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="outline" className="bg-white/50">
                <MapPin className="h-3 w-3 mr-1" />
                {country && countryNames[country]}
              </Badge>
              <Badge variant="outline" className="bg-white/50">
                <Clock className="h-3 w-3 mr-1" />
                Just now
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Eye className="h-4 w-4" />
            <span>Raw intelligence data below</span>
          </div>
          <div className="rounded-lg bg-white/70 border border-white/50 p-4 overflow-auto max-h-96 backdrop-blur-sm">
            <pre className="text-sm leading-relaxed">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
