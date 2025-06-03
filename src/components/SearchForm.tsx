
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Search, Building2, Globe, ChevronDown } from 'lucide-react'

interface SearchFormProps {
  company: string
  setCompany: (value: string) => void
  country: string
  setCountry: (value: string) => void
  loading: boolean
  onSubmit: (e: React.FormEvent) => void
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

export function SearchForm({ company, setCompany, country, setCountry, loading, onSubmit }: SearchFormProps) {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Search className="h-5 w-5 text-white" />
          </div>
          Competitor Analysis
        </CardTitle>
        <CardDescription className="text-base">
          Discover advertising strategies and gain competitive intelligence insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="company" className="flex items-center gap-2 text-sm font-medium">
                <Building2 className="h-4 w-4" />
                Company Name
              </Label>
              <Input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Enter company name..."
                className="h-12 border-border/50 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Globe className="h-4 w-4" />
                Target Market
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full h-12 justify-between border-border/50 hover:border-blue-500 transition-colors"
                  >
                    {country ? countryNames[country] : 'Select target market...'}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full min-w-[300px]">
                  <DropdownMenuLabel>Select a country</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {Object.entries(countryNames).map(([code, name]) => (
                    <DropdownMenuItem key={code} onSelect={() => setCountry(code)}>
                      {name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5" 
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Analyzing Competitor...' : 'Start Analysis'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
