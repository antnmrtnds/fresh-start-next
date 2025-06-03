
// pages/index.js
import { useState } from 'react';

// Dashboard components
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Loader2, Search, Building2, Globe, TrendingUp, BarChart3, Users, Activity } from 'lucide-react';

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
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Header */}
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          <h1 className="text-xl font-semibold">UpSpy</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Badge variant="secondary">Dashboard</Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Competitor Analysis</h1>
          <p className="text-muted-foreground">
            Analyze advertising strategies and gain competitive intelligence insights.
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          {/* Sidebar Navigation */}
          <nav className="grid gap-4 text-sm text-muted-foreground">
            <Badge variant="outline" className="justify-center">
              Advertising Intelligence
            </Badge>
          </nav>

          {/* Main Dashboard Grid */}
          <div className="grid gap-6">
            {/* Search Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Company
                </CardTitle>
                <CardDescription>
                  Enter company details to analyze their advertising strategy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company" className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        Company Name
                      </Label>
                      <Input
                        id="company"
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Ex: CivilRia, Vizta.pt..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        Target Country
                      </Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            {country ? countryNames[country] : 'Select country...'}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                          <DropdownMenuLabel>Select a country</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={() => setCountry('US')}>United States</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setCountry('BR')}>Brazil</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setCountry('GB')}>United Kingdom</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setCountry('PT')}>Portugal</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setCountry('ES')}>Spain</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setCountry('FR')}>France</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setCountry('DE')}>Germany</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setCountry('IT')}>Italy</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setCountry('NL')}>Netherlands</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {loading ? 'Analyzing...' : 'Start Analysis'}
                  </Button>
                </form>

                {/* Error Message */}
                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Status Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Search Status</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? 'Active' : results ? 'Complete' : 'Ready'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {loading ? 'Processing request...' : results ? 'Analysis finished' : 'Ready to search'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Target Company</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {company || 'None'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {country ? countryNames[country] : 'No country selected'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Intelligence</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {results ? 'Available' : 'Pending'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Competitive insights
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            {results && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Analysis Results
                  </CardTitle>
                  <CardDescription>
                    Advertising intelligence data for {company} {country && `in ${countryNames[country]}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md bg-muted p-4 overflow-auto max-h-96">
                    <pre className="text-sm">
                      {JSON.stringify(results, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
