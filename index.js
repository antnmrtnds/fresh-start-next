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
import { Loader2, Search, Building2, Globe, TrendingUp } from 'lucide-react';

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6" />
            <h1 className="text-2xl font-bold">UpSpy</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Badge variant="secondary">Dashboard</Badge>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Competitor Analysis</h2>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">Advertising Intelligence</Badge>
          </div>
        </div>
        
        <Separator />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search Card */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Search Company</span>
              </CardTitle>
              <CardDescription>
                Enter company details to analyze their advertising strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="flex items-center space-x-1">
                      <Building2 className="h-4 w-4" />
                      <span>Company Name</span>
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
                    <Label className="flex items-center space-x-1">
                      <Globe className="h-4 w-4" />
                      <span>Target Country</span>
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

          {/* Status Cards */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Search Status</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
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
                <CardTitle className="text-sm font-medium">Target</CardTitle>
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
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Analysis Results</span>
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
          </div>
        )}
      </div>
    </div>
  );
}
