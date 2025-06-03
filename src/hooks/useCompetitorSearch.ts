
import { useState } from 'react'

export function useCompetitorSearch() {
  const [company, setCompany] = useState('')
  const [country, setCountry] = useState('')
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setResults(null)
    setLoading(true)

    if (!company) {
      setError('Please enter a company name.')
      setLoading(false)
      return
    }

    // Build query params
    const params = new URLSearchParams({ company })
    if (country) params.append('country', country)

    try {
      // First, get data from scraper API
      const res = await fetch(`/api/ads?${params.toString()}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Unknown error')
        return
      }

      // Save the data to Supabase
      console.log('Sending data to save:', { company, country, data })
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
      })

      const saveResult = await saveResponse.json()
      console.log('Save response:', saveResult)

      if (!saveResponse.ok) {
        console.error('Failed to save results:', saveResult)
      }

      // Send data to n8n workflow
      const n8nResponse = await fetch('https://upinvestments.app.n8n.cloud/webhook/16d56b55-c155-41e7-9f34-dbd7d24ca1f4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      const analyzedData = await n8nResponse.json()
      if (!n8nResponse.ok) {
        setError('Error processing data')
        return
      }

      setResults(analyzedData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    company,
    setCompany,
    country,
    setCountry,
    results,
    error,
    loading,
    handleSubmit
  }
}
