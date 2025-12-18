'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Download, Users, Star, 
  Calendar, Mail, Phone, X, Eye, Loader2, AlertCircle 
} from 'lucide-react'

export default function AdminDashboard() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedResult, setSelectedResult] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/admin/results')
        
        // This handles the "Unexpected token <" error by checking if the response is actually JSON
        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType || !contentType.includes("application/json")) {
          const text = await res.text(); // Get the HTML error page text
          console.error("API Error Response:", text);
          throw new Error(`Server returned ${res.status}: ${res.statusText}. Check if API route exists at /api/admin/results/route.ts`);
        }

        const json = await res.json()
        setData(Array.isArray(json) ? json : [])
      } catch (err: any) {
        console.error("Dashboard Load Error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Helper to parse MongoDB dates safely
  const parseMongoDate = (dateField: any) => {
    if (!dateField) return new Date();
    // Handles both string dates and {$date: "..."} objects
    const dateStr = dateField.$date ? dateField.$date : dateField;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date() : d;
  }

  const filteredData = data.filter(item => 
    item.studentInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.studentInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const downloadCSV = () => {
    if (filteredData.length === 0) return;
    const headers = ['Date', 'Name', 'Email', 'Phone', 'Score', 'Belt']
    const rows = filteredData.map(r => [
      parseMongoDate(r.submittedAt).toLocaleDateString(),
      `"${r.studentInfo.name}"`,
      r.studentInfo.email,
      r.studentInfo.phone,
      r.testResults.score,
      r.testResults.belt.name
    ])
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `ngen-results-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium">Connecting to Database...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-red-100 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Connection Error</h2>
          <p className="text-slate-500 text-sm mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">NGen Admin</h1>
            <p className="text-slate-500 font-medium">Placement Test Management</p>
          </div>
          <button 
            onClick={downloadCSV} 
            disabled={filteredData.length === 0}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard icon={Users} label="Total Tests" value={data.length} color="text-blue-600" />
          <StatCard 
            icon={Star} 
            label="Avg Score" 
            value={data.length ? (data.reduce((acc, curr) => acc + (curr.testResults?.score || 0), 0) / data.length).toFixed(1) : 0} 
            color="text-orange-500" 
          />
          <StatCard 
            icon={Calendar} 
            label="Last 24h" 
            value={data.filter(d => parseMongoDate(d.submittedAt) > new Date(Date.now() - 86400000)).length} 
            color="text-green-600" 
          />
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by student name or email..." 
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-wider">Student</th>
                  <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-wider">Contact</th>
                  <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-wider">Belt Assignment</th>
                  <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-wider text-center">Score</th>
                  <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-wider">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5">
                      <div className="font-bold text-slate-900">{item.studentInfo?.name || 'Unknown'}</div>
                      <div className="text-xs text-slate-400">Age: {item.studentInfo?.age || 'N/A'}</div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-sm text-slate-600"><Mail className="w-3.5 h-3.5"/> {item.studentInfo?.email}</div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 mt-1"><Phone className="w-3.5 h-3.5"/> {item.studentInfo?.phone}</div>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${item.testResults?.belt?.color || 'bg-slate-200'}`}>
                        {item.testResults?.belt?.name || 'None'}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <div className="font-black text-slate-800">{item.testResults?.score || 0}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Points</div>
                    </td>
                    <td className="p-5">
                      <button 
                        onClick={() => setSelectedResult(item)} 
                        className="p-2.5 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredData.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-slate-400 font-medium">No results found in the database.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Slide-over */}
      <AnimatePresence>
        {selectedResult && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setSelectedResult(null)} 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40" 
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} 
              className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8 border-b pb-6">
                  <div>
                    <h2 className="text-2xl font-black">{selectedResult.studentInfo?.name}</h2>
                    <p className="text-slate-500 text-sm">
                      Date: {parseMongoDate(selectedResult.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <button onClick={() => setSelectedResult(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-6 h-6"/>
                  </button>
                </div>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">Survey Details</h3>
                    <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <DetailItem label="Location" value={`${selectedResult.surveyData?.city}, ${selectedResult.surveyData?.country}`} />
                      <DetailItem label="School Name" value={selectedResult.surveyData?.schoolName} />
                      <DetailItem label="Experience" value={selectedResult.surveyData?.techExperience} />
                      <DetailItem label="House Preference" value={selectedResult.surveyData?.preferredHouse} />
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-black text-orange-600 uppercase tracking-widest mb-4">Question Breakdown</h3>
                    <div className="space-y-4">
                      {selectedResult.questionsAndAnswers?.map((qa: any, i: number) => (
                        <div key={i} className={`p-5 rounded-2xl border-l-4 shadow-sm ${qa.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                          <p className="text-sm font-bold text-slate-800 mb-2">{i+1}. {qa.question}</p>
                          <div className="flex gap-4 text-xs font-bold">
                            <span className={qa.isCorrect ? 'text-green-700' : 'text-red-600'}>
                              Selected: {qa.options[qa.userAnswerIndex]}
                            </span>
                            {!qa.isCorrect && (
                              <span className="text-green-700">
                                Correct: {qa.options[qa.correctAnswerIndex]}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-5">
      <div className={`p-4 rounded-2xl bg-slate-50 ${color}`}><Icon className="w-6 h-6" /></div>
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{label}</div>
        <div className="text-3xl font-black text-slate-900">{value}</div>
      </div>
    </div>
  )
}

function DetailItem({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-sm font-bold text-slate-700">{value || 'N/A'}</div>
    </div>
  )
}