
import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '../src/components/ui/sidebar';
import { AppSidebar } from '../src/components/AppSidebar';
import { SearchForm } from '../src/components/SearchForm';
import { MetricsCard } from '../src/components/MetricsCard';
import { AnalysisChart } from '../src/components/AnalysisChart';
import { ResultsDisplay } from '../src/components/ResultsDisplay';
import { Alert, AlertDescription } from '../src/components/ui/alert';
import { Badge } from '../src/components/ui/badge';
import { Separator } from '../src/components/ui/separator';
import { Building2, Users, Activity, BarChart3, Globe, TrendingUp, AlertCircle } from 'lucide-react';

export default function Home() {
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResults(null);
    setLoading(true);

    if (!company) {
      setError('Please enter a company name.');
      setLoading(false);
      return;
    }

    // Build query params
    const params = new URLSearchParams({ company });
    if (country) params.append('country', country);

    try {
      // First, get data from scraper API
      const res = await fetch(`/api/ads?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Unknown error');
        return;
      }

      // Save the data to Supabase
      console.log('Sending data to save:', { company, country, data });
      const saveResponse = await fetch('/api/saveResults', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company,
          country,
          data
        })
      });

      const saveResult = await saveResponse.json();
      console.log('Save response:', saveResult);

      if (!saveResponse.ok) {
        console.error('Failed to save results:', saveResult);
      }

      // Send data to n8n workflow
      const n8nResponse = await fetch('https://upinvestments.app.n8n.cloud/webhook/16d56b55-c155-41e7-9f34-dbd7d24ca1f4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const analyzedData = await n8nResponse.json();
      if (!n8nResponse.ok) {
        setError('Error processing data');
        return;
      }

      setResults(analyzedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-white">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-sm px-4 md:px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Competitive Intelligence Dashboard
              </h1>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                Live
              </Badge>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-6 p-6">
            {/* Quick Stats Overview */}
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

            <Separator className="my-2" />

            {/* Search Section */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <SearchForm
                  company={company}
                  setCompany={setCompany}
                  country={country}
                  setCountry={setCountry}
                  loading={loading}
                  onSubmit={handleSubmit}
                />

                {/* Error Message */}
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

            {/* Results Section */}
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
  );
}
