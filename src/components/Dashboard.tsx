
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Header } from "@/components/Header"
import { QuickStats } from "@/components/QuickStats"
import { SearchSection } from "@/components/SearchSection"
import { ResultsDisplay } from "@/components/ResultsDisplay"
import { Separator } from "@/components/ui/separator"
import { useCompetitorSearch } from "@/hooks/useCompetitorSearch"

export function Dashboard() {
  const {
    company,
    setCompany,
    country,
    setCountry,
    results,
    error,
    loading,
    handleSubmit
  } = useCompetitorSearch()

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-white">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col min-h-screen">
          <Header />

          <div className="flex-1 flex flex-col gap-6 p-6">
            <QuickStats 
              loading={loading}
              results={results}
              company={company}
              country={country}
            />

            <Separator className="my-2" />

            <SearchSection
              company={company}
              setCompany={setCompany}
              country={country}
              setCountry={setCountry}
              loading={loading}
              error={error}
              onSubmit={handleSubmit}
            />

            {results && (
              <ResultsDisplay
                results={results}
                company={company}
                country={country}
              />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
