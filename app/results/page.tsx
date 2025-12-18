'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  Trophy, 
  Award, 
  Clock, 
  BookOpen, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCcw,
  Info,
  CheckCircle,
  Loader
} from 'lucide-react'

const beltLevels = [
  {
    stage: 'Pre-Foundation',
    belt: 'White',
    color: 'bg-slate-100',
    textColor: 'text-slate-800',
    borderColor: 'border-slate-300',
    duration: '1 Month',
    totalHours: '12 hrs',
    totalClasses: '8 Classes',
    focus: 'Digital Awareness & Curiosity',
    scoreRange: [0, 0]
  },
  {
    stage: 'Foundation',
    belt: 'Yellow',
    color: 'bg-yellow-400',
    textColor: 'text-yellow-950',
    borderColor: 'border-yellow-200',
    duration: '3-4 Months',
    totalHours: '35 hrs',
    totalClasses: '24 Classes',
    focus: 'Core Coding & Logical Thinking',
    scoreRange: [1, 17]
  },
  {
    stage: 'Foundation',
    belt: 'Orange',
    color: 'bg-orange-500',
    textColor: 'text-white',
    borderColor: 'border-orange-300',
    duration: '3-4 Months',
    totalHours: '35 hrs',
    totalClasses: '24 Classes',
    focus: 'Creativity & Digital Design',
    scoreRange: [18, 25]
  }
]

type StoredQuestion = {
  question: string
  options: string[]
  ans_idx?: number
  correctAnswer?: number
  justification?: string
}

export default function ResultsPage() {
  const router = useRouter()
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [recommendedBelt, setRecommendedBelt] = useState(beltLevels[0])
  const [studentInfo, setStudentInfo] = useState({ name: '', age: '', phone: '', email: '' })
  const [questions, setQuestions] = useState<StoredQuestion[]>([])
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([])
  const [isReviewMode, setIsReviewMode] = useState(false)
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  useEffect(() => {
    const storedScore = sessionStorage.getItem('testScore')
    const storedTotal = sessionStorage.getItem('totalQuestions')
    const storedStudentInfo = sessionStorage.getItem('studentInfo')
    const storedQuestions = sessionStorage.getItem('questions')
    const storedSelectedAnswers = sessionStorage.getItem('selectedAnswers')

    if (storedScore) {
      const scoreValue = parseInt(storedScore)
      setScore(scoreValue)
      const belt = beltLevels.find(
        level => scoreValue >= level.scoreRange[0] && scoreValue <= level.scoreRange[1]
      ) || beltLevels[beltLevels.length - 1]
      setRecommendedBelt(belt)
    }
    if (storedTotal) setTotalQuestions(parseInt(storedTotal))
    if (storedStudentInfo) setStudentInfo(JSON.parse(storedStudentInfo))
    if (storedQuestions) setQuestions(JSON.parse(storedQuestions))
    if (storedSelectedAnswers) setSelectedAnswers(JSON.parse(storedSelectedAnswers))
  }, [])

  useEffect(() => {
    const saveResults = async () => {
      const alreadySaved = sessionStorage.getItem('resultsSaved')
      if (alreadySaved === 'true' || !studentInfo.email || questions.length === 0) return

      setSaveStatus('saving')
      try {
        const surveyData = sessionStorage.getItem('surveyData')
        const response = await fetch('/api/save-test-results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentInfo,
            surveyData: surveyData ? JSON.parse(surveyData) : {},
            questions,
            selectedAnswers,
            score,
            totalQuestions,
            belt: recommendedBelt,
          }),
        })
        if (!response.ok) throw new Error('Failed to save')
        sessionStorage.setItem('resultsSaved', 'true')
        setSaveStatus('success')
      } catch (error) {
        setSaveStatus('error')
      }
    }

    if (studentInfo.email && questions.length > 0 && score >= 0) {
      saveResults()
    }
  }, [studentInfo, questions, selectedAnswers, score, totalQuestions, recommendedBelt])

  const currentQuestion = questions[currentReviewIndex]
  const correctIndex = currentQuestion?.ans_idx ?? currentQuestion?.correctAnswer ?? null
  const userAnswerIndex = selectedAnswers[currentReviewIndex]

  return (
    <div className="min-h-screen w-full bg-[#1a0b2e] relative flex flex-col items-center p-4 sm:p-6 md:p-8 overflow-x-hidden">
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-600/20 rounded-full filter blur-[80px] md:blur-[100px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/20 rounded-full filter blur-[80px] md:blur-[100px]"></div>
      </div>

      {/* Save Status Indicator - Hidden on very small screens or compact for mobile */}
      <AnimatePresence>
        {(saveStatus === 'saving' || saveStatus === 'success') && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 ${saveStatus === 'success' ? 'bg-green-500/90' : 'bg-blue-500/90'} backdrop-blur-md text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2`}
          >
            {saveStatus === 'saving' ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            <span className="text-xs md:text-sm font-medium">{saveStatus === 'saving' ? 'Saving...' : 'Saved!'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl relative z-10"
      >
        {/* --- Header --- */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 md:mb-8 gap-4 bg-white/5 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 md:gap-4 text-center sm:text-left">
                <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
                    <Image src="/image.png" alt="Logo" fill className="object-contain" />
                </div>
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-white">Your Results</h1>
                    <p className="text-purple-300 text-sm md:text-base">Fantastic work, {studentInfo.name.split(' ')[0] || 'Explorer'}!</p>
                </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 sm:bg-transparent p-2 rounded-xl w-full sm:w-auto justify-center">
                <div className="text-right">
                    <p className="text-white/60 text-[10px] md:text-xs font-bold uppercase tracking-widest">Final Score</p>
                    <p className="text-white text-xl md:text-2xl font-black">{score} / {totalQuestions}</p>
                </div>
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-lg">
                    <Trophy className="text-white w-6 h-6 md:w-8 md:h-8" />
                </div>
            </div>
        </div>

        {/* --- Achievement Card --- */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden mb-6 md:mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left: Belt Visual */}
                <div className={`lg:col-span-5 p-8 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10`}>
                    <div className={`absolute inset-0 opacity-20 ${recommendedBelt.color}`}></div>
                    
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 15 }}
                        className="relative z-10"
                    >
                        <div className={`w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full ${recommendedBelt.color} border-4 md:border-8 ${recommendedBelt.borderColor} shadow-2xl flex items-center justify-center`}>
                            <div className="flex flex-col items-center justify-center p-4">
                                <Award className={`w-10 h-10 md:w-16 md:h-16 mb-1 md:mb-2 ${recommendedBelt.textColor}`} />
                                <span className={`text-lg md:text-2xl font-black uppercase tracking-tighter ${recommendedBelt.textColor}`}>
                                    {recommendedBelt.belt}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    <div className="mt-6 md:mt-8 relative z-10">
                        <h3 className="text-white text-2xl md:text-4xl font-black">{recommendedBelt.belt} Belt</h3>
                        <p className="text-purple-200 font-medium mt-1 md:mt-2 text-sm md:text-base">{recommendedBelt.stage} Stage</p>
                    </div>
                </div>

                {/* Right: Belt Stats */}
                <div className="lg:col-span-7 p-6 md:p-12 bg-black/20">
                    <div className="mb-6 md:mb-8 text-center lg:text-left">
                        <h4 className="text-orange-400 font-bold flex items-center justify-center lg:justify-start gap-2 mb-2 text-sm md:text-base">
                            <Info className="w-4 h-4 md:w-5 md:h-5" /> Your Learning Focus
                        </h4>
                        <p className="text-white text-lg md:text-2xl font-bold leading-tight">
                            {recommendedBelt.focus}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        <StatBox icon={Clock} label="Duration" value={recommendedBelt.duration} color="text-blue-400" />
                        <StatBox icon={BookOpen} label="Curriculum" value={recommendedBelt.totalHours} color="text-green-400" />
                        <div className="col-span-2 md:col-span-1">
                          <StatBox icon={Users} label="Structure" value={recommendedBelt.totalClasses} color="text-pink-400" />
                        </div>
                    </div>

                    <div className="mt-8 md:mt-10 p-4 md:p-6 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-slate-300 text-xs md:text-sm italic leading-relaxed">
                            "Based on your score of {score}, our AI suggests starting at the {recommendedBelt.belt} level to ensure you have a strong foundation before moving to complex projects."
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* --- Action Buttons --- */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-stretch sm:items-center mb-10">
            <button
                onClick={() => setIsReviewMode(true)}
                className="px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
            >
                Review Your Answers
            </button>
            <button
                onClick={() => {
                  sessionStorage.clear();
                  router.push('/');
                }}
                className="px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 text-white font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
            >
                Retake Test <RefreshCcw className="w-4 h-4 md:w-5 md:h-5" />
            </button>
        </div>

        {/* --- Review Mode --- */}
        <AnimatePresence>
          {isReviewMode && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="mt-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-10 shadow-2xl mb-20"
            >
                <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-white/10 pb-4 md:pb-6">
                    <div>
                      <h2 className="text-white text-lg md:text-2xl font-bold">Answer Review</h2>
                      <p className="text-purple-300 text-[10px] md:text-xs uppercase tracking-widest font-bold">Question {currentReviewIndex + 1} of {questions.length}</p>
                    </div>
                    <button 
                      onClick={() => setIsReviewMode(false)} 
                      className="p-2 text-white/40 hover:text-white transition-colors"
                    >
                      <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase">Close</span>
                    </button>
                </div>

                {currentQuestion && (
                    <div className="space-y-4 md:space-y-6">
                        <h3 className="text-white text-base md:text-xl font-bold leading-relaxed">
                          {currentQuestion.question}
                        </h3>
                        <div className="grid grid-cols-1 gap-2 md:gap-3">
                            {currentQuestion.options.map((option, idx) => {
                                const isCorrect = correctIndex === idx;
                                const isUserSelection = userAnswerIndex === idx;

                                return (
                                    <div key={idx} className={`p-3 md:p-4 rounded-xl border-2 flex justify-between items-start md:items-center gap-3 transition-all ${correctIndex === idx ? 'bg-green-500/20 border-green-500' : userAnswerIndex === idx ? 'bg-red-500/20 border-red-500' : 'bg-white/5 border-white/5 text-slate-400'}`}>
                                        <div className="flex gap-3 items-center">
                                          <span className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs md:text-sm ${isCorrect ? 'bg-green-500 text-white' : isUserSelection ? 'bg-red-500 text-white' : 'bg-white/10 text-white'}`}>
                                            {String.fromCharCode(65 + idx)}
                                          </span>
                                          <span className="text-sm md:text-base text-white font-medium">{option}</span>
                                        </div>
                                        <div className="flex-shrink-0 pt-1 md:pt-0">
                                          {isCorrect && <span className="bg-green-500 text-[8px] md:text-[10px] px-2 py-1 rounded font-black uppercase text-white">Correct</span>}
                                          {userAnswerIndex === idx && correctIndex !== idx && <span className="bg-red-500 text-[8px] md:text-[10px] px-2 py-1 rounded font-black uppercase text-white">Your Pick</span>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        
                        {currentQuestion.justification && (
                          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs md:text-sm text-blue-100">
                             <p className="font-bold text-blue-400 mb-1 flex items-center gap-2">
                               <Info className="w-3 h-3 md:w-4 md:h-4" /> Why this is correct:
                             </p>
                             {currentQuestion.justification}
                          </div>
                        )}

                        <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/10">
                            <button 
                              disabled={currentReviewIndex === 0} 
                              onClick={() => setCurrentReviewIndex(i => i - 1)} 
                              className="p-2 text-white hover:bg-white/10 rounded-full disabled:opacity-20 transition-all"
                            >
                              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                            </button>
                            <span className="text-white/40 text-xs font-bold tracking-[0.2em]">{currentReviewIndex + 1} / {questions.length}</span>
                            <button 
                              disabled={currentReviewIndex === questions.length - 1} 
                              onClick={() => setCurrentReviewIndex(i => i + 1)} 
                              className="p-2 text-white hover:bg-white/10 rounded-full disabled:opacity-20 transition-all"
                            >
                              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

function StatBox({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col items-center text-center">
            <Icon className={`w-5 h-5 md:w-6 md:h-6 mb-1 md:mb-2 ${color}`} />
            <span className="text-white/40 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">{label}</span>
            <span className="text-white text-xs md:text-base font-bold truncate w-full">{value}</span>
        </div>
    )
}