'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Brain,
  Target,
} from 'lucide-react'

type ApiQuestion = {
  question_type: string
  track: string
  difficulty_level: number
  concepts: string[]
  question: string
  choices: string[]
  ans_idx: number
  justification: string
}

export default function TestPage() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [questions, setQuestions] = useState<ApiQuestion[]>([])
  const [error, setError] = useState<string | null>(null)

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([])

  // --- Logic: Fetching Questions (Unchanged UI) ---
  useEffect(() => {
    let progressTimer: ReturnType<typeof setInterval> | null = null

    const startProgress = () => {
      const duration = 20000
      const interval = 100
      const steps = duration / interval
      let currentStep = 0

      progressTimer = setInterval(() => {
        currentStep++
        setLoadingProgress(prev => {
          const value = Math.max(prev, (currentStep / steps) * 100)
          return Math.min(value, 95)
        })
      }, interval)
    }

    const fetchQuestions = async () => {
      const surveyResults = sessionStorage.getItem('surveyResults')

      if (!surveyResults) {
        router.push('/')
        return
      }

      startProgress()

      try {
        const res = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ survey_results: surveyResults }),
        })

        const text = await res.text()
        let data: any

        try {
          data = JSON.parse(text)
        } catch (parseError) {
          console.error('Failed to parse response:', text)
          throw new Error('Received invalid response from server. Please try again.')
        }

        if (!res.ok) {
          console.error('Backend error:', data)

          if (res.status === 503) {
            throw new Error(
              'The AI service is currently overloaded. Please wait a moment and try again.',
            )
          }

          if (res.status === 500) {
            throw new Error(
              data?.detail ||
                'A server error occurred while generating your test. Please try again in a few moments.',
            )
          }

          throw new Error(
            data?.detail ||
              data?.error ||
              data?.message ||
              'Failed to generate questions. Please try again.',
          )
        }

        if (data.partial && data.failed_tracks?.length > 0) {
          console.warn(`Some tracks failed: ${data.failed_tracks.join(', ')}`)
          console.warn(`Message: ${data.message}`)
        }

        const apiQuestions: ApiQuestion[] = data.questions ?? []

        if (!apiQuestions.length) {
          throw new Error(
            'No questions were generated. The service may be experiencing issues. Please try again.',
          )
        }

        console.log(`Successfully loaded ${apiQuestions.length} questions`)

        setQuestions(apiQuestions)
        setSelectedAnswers(new Array(apiQuestions.length).fill(null))
        setLoadingProgress(100)
      } catch (err: any) {
        console.error('Error in fetchQuestions:', err)

        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          setError('Network error. Please check your internet connection and try again.')
        } else {
          setError(
            err?.message ||
              'Sorry, something went wrong while generating your placement test. Please try again.',
          )
        }
      } finally {
        if (progressTimer) clearInterval(progressTimer)
        setIsLoading(false)
      }
    }

    fetchQuestions()

    return () => {
      if (progressTimer) clearInterval(progressTimer)
    }
  }, [router])

  // --- Handlers ---
  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    const score = selectedAnswers.reduce<number>((total, answer, index) => {
      if (answer === null) return total
      return answer === questions[index].ans_idx ? total + 1 : total
    }, 0)

    const storedQuestions = questions.map(q => ({
      question: q.question,
      options: q.choices,
      ans_idx: q.ans_idx,
      justification: q.justification,
    }))

    sessionStorage.setItem('testScore', score.toString())
    sessionStorage.setItem('totalQuestions', questions.length.toString())
    sessionStorage.setItem('questions', JSON.stringify(storedQuestions))
    sessionStorage.setItem('selectedAnswers', JSON.stringify(selectedAnswers))

    router.push('/results')
  }

  // --- UI Components ---

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a0b2e] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md text-center"
        >
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="mb-8 inline-block"
          >
            <div className="relative w-32 h-32 mx-auto">
              <Image
                src="/image.png"
                alt="AI Robot"
                fill
                className="object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
              />
            </div>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
            Building Your Challenge
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ...
            </motion.span>
          </h2>

          <div className="bg-white/10 p-1 rounded-full h-6 backdrop-blur-md border border-white/20 shadow-inner overflow-hidden relative">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600"
              style={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.1 }}
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-full" />
          </div>

          <p className="text-purple-200 mt-4 font-mono text-sm">
            {loadingProgress < 30
              ? 'Analyzing profile...'
              : loadingProgress < 60
                ? 'Selecting questions...'
                : 'Finalizing AI model...'}{' '}
            ({Math.round(loadingProgress)}%)
          </p>
        </motion.div>
      </div>
    )
  }

  // 2. Error State
  if (error || !questions.length) {
    return (
      <div className="min-h-screen bg-[#1a0b2e] flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-purple-200 mb-6">{error || 'Unable to generate test.'}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 px-6 rounded-xl font-bold bg-white text-purple-900 hover:bg-purple-100 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // 3. Main Quiz Interface
  const current = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen w-full bg-[#1a0b2e] relative flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/40 rounded-full mix-blend-screen filter blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/30 rounded-full mix-blend-screen filter blur-[100px]"></div>
      </div>

      <div className="w-full max-w-5xl mx-auto relative z-10 flex flex-col h-full">
        {/* --- Top Bar: Logo & Progress --- */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 mb-4 md:mb-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <Image src="/image.png" alt="Logo" fill className="object-contain" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg md:text-xl tracking-wide">Placement Test</h1>
              <div className="flex items-center gap-2 text-xs md:text-sm text-purple-300">
                <Brain className="w-3 h-3 md:w-4 md:h-4" />
                <span>{current.concepts?.[0] ?? ''}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full md:w-64">
            <div className="flex justify-between text-xs text-purple-200 mb-1 font-bold">
              <span>Progress</span>
              <span>
                {currentQuestion + 1} / {questions.length}
              </span>
            </div>
            <div className="h-2 md:h-3 bg-black/40 rounded-full overflow-hidden border border-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-400 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: 'spring', stiffness: 50 }}
              />
            </div>
          </div>
        </div>

        {/* --- Main Card --- */}
        <div className="flex-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden relative min-h-0">
          {/* Decoration line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 opacity-70"></div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full overflow-y-auto custom-scrollbar"
            >
              <div className="p-4 md:p-6 lg:p-10 flex flex-col gap-4 md:gap-6">
                {/* Question Difficulty Badge */}
                <div className="flex-shrink-0">
                  <span
                    className={`
                      inline-flex items-center gap-1 px-2.5 py-1 md:px-3 md:py-1 rounded-full text-xs font-bold uppercase tracking-wider
                      ${current.difficulty_level === 1 ? 'bg-green-500/20 text-green-300 border border-green-500/30' : current.difficulty_level === 2 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}
                    `}
                  >
                    <Target className="w-3 h-3" />
                    Level {current.difficulty_level}
                  </span>
                </div>

                {/* Question Text */}
                <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-white leading-tight flex-shrink-0">
                  {current.question}
                </h2>

                {/* Choices Grid */}
                <div className="grid grid-cols-1 gap-2.5 md:gap-4 flex-shrink-0">
                  {current.choices.map((option, index) => {
                    const isSelected = selectedAnswers[currentQuestion] === index

                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`
                          group relative w-full text-left p-3 md:p-4 lg:p-5 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 md:gap-4
                          ${isSelected ? 'bg-gradient-to-r from-orange-500/90 to-pink-600/90 border-transparent shadow-lg shadow-orange-500/20' : 'bg-black/20 border-white/10 hover:bg-white/5 hover:border-white/30'}
                        `}
                      >
                        {/* Choice Letter Bubble */}
                        <div
                          className={`
                            w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-base md:text-lg flex-shrink-0 transition-colors
                            ${isSelected ? 'bg-white text-pink-600' : 'bg-white/10 text-white group-hover:bg-white/20'}
                          `}
                        >
                          {String.fromCharCode(65 + index)}
                        </div>

                        {/* Choice Text */}
                        <span
                          className={`text-sm md:text-base lg:text-lg font-medium transition-colors flex-1 ${isSelected ? 'text-white' : 'text-slate-200'}`}
                        >
                          {option}
                        </span>

                        {/* Check Icon (Visible when selected) */}
                        {isSelected && (
                          <motion.div 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }} 
                            className="flex-shrink-0"
                          >
                            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* --- Footer Controls --- */}
          <div className="p-4 md:p-6 lg:p-8 border-t border-white/10 bg-black/20 flex justify-between items-center gap-3 md:gap-4 flex-shrink-0">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`
                flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold text-white transition-all text-sm md:text-base
                ${currentQuestion === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 active:scale-95'}
              `}
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswers[currentQuestion] === null}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-5 md:px-8 py-2.5 md:py-3 rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-2 text-sm md:text-base"
              >
                <span>Finish Test</span>
                <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestion] === null}
                className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 text-white px-5 md:px-8 py-2.5 md:py-3 rounded-xl font-bold shadow-lg shadow-purple-900/20 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-2 text-sm md:text-base"
              >
                <span className="hidden sm:inline">Next Question</span>
                <span className="sm:hidden">Next</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Global CSS for scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  )
}