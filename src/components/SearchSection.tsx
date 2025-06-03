
import { SearchForm } from "@/components/SearchForm"
import { AnalysisChart } from "@/components/AnalysisChart"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface SearchSectionProps {
  company: string
  setCompany: (value: string) => void
  country: string
  setCountry: (value: string) => void
  loading: boolean
  error: string
  onSubmit: (e: React.FormEvent) => void
}

export function SearchSection({ 
  company, 
  setCompany, 
  country, 
  setCountry, 
  loading, 
  error, 
  onSubmit 
}: SearchSectionProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <SearchForm
          company={company}
          setCompany={setCompany}
          country={country}
          setCountry={setCountry}
          loading={loading}
          onSubmit={onSubmit}
        />

        {error && (
          <Alert variant="destructive" className="mt-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}
      </div>
      
      <div className="lg:col-span-1">
        <AnalysisChart />
      </div>
    </div>
  )
}
