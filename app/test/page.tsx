'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const questions = [
  {
    id: 1,
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language"
    ],
    correctAnswer: 0
  },
  {
    id: 2,
    question: "Which programming language is known as the 'language of the web'?",
    options: ["Python", "Java", "JavaScript", "C++"],
    correctAnswer: 2
  },
  {
    id: 3,
    question: "What is a variable in programming?",
    options: [
      "A container for storing data",
      "A type of loop",
      "A programming language",
      "A computer screen"
    ],
    correctAnswer: 0
  },
  {
    id: 4,
    question: "What does CSS stand for?",
    options: [
      "Computer Style Sheets",
      "Cascading Style Sheets",
      "Creative Style Sheets",
      "Colorful Style Sheets"
    ],
    correctAnswer: 1
  },
  {
    id: 5,
    question: "Which symbol is used for comments in Python?",
    options: ["//", "/* */", "#", "<!--"],
    correctAnswer: 2
  },
  {
    id: 6,
    question: "What is a loop in programming?",
    options: [
      "A mistake in code",
      "A way to repeat code multiple times",
      "A type of variable",
      "A programming language"
    ],
    correctAnswer: 1
  },
  {
    id: 7,
    question: "What is the result of 10 + 5 * 2 in most programming languages?",
    options: ["30", "20", "25", "15"],
    correctAnswer: 1
  },
  {
    id: 8,
    question: "What does AI stand for?",
    options: [
      "Automatic Intelligence",
      "Artificial Intelligence",
      "Advanced Internet",
      "Automated Information"
    ],
    correctAnswer: 1
  },
  {
    id: 9,
    question: "Which of these is NOT a programming language?",
    options: ["Python", "Java", "HTML", "Ruby"],
    correctAnswer: 2
  },
  {
    id: 10,
    question: "What is debugging?",
    options: [
      "Writing new code",
      "Finding and fixing errors in code",
      "Deleting code",
      "Running a program"
    ],
    correctAnswer: 1
  },
  {
    id: 11,
    question: "What is an algorithm?",
    options: [
      "A type of computer",
      "A step-by-step solution to a problem",
      "A programming error",
      "A computer game"
    ],
    correctAnswer: 1
  },
  {
    id: 12,
    question: "What does 'if-else' do in programming?",
    options: [
      "Repeats code",
      "Makes decisions in code",
      "Stores data",
      "Ends a program"
    ],
    correctAnswer: 1
  }
]

export default function TestPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  )
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    // Loading animation for 20 seconds
    const duration = 20000 // 20 seconds
    const interval = 100 // Update every 100ms
    const steps = duration / interval
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      setLoadingProgress((currentStep / steps) * 100)

      if (currentStep >= steps) {
        clearInterval(timer)
        setIsLoading(false)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

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

  /** ⭐ FIXED TYPE ERROR HERE ⭐ */
  const handleSubmit = () => {
    const score = selectedAnswers.reduce<number>((total, answer, index) => {
      return answer === questions[index].correctAnswer ? total + 1 : total
    }, 0)

    sessionStorage.setItem('testScore', score.toString())
    sessionStorage.setItem('totalQuestions', questions.length.toString())

    router.push('/results')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          {/* Robot Animation */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mb-8"
          >
            <div className="text-8xl">🤖</div>
          </motion.div>

          {/* Loading Text */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance"
          >
            Generating a placement test for you
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ...
            </motion.span>
          </motion.h2>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm border border-white/30">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 via-orange-400 to-pink-400"
                style={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <p className="text-purple-200 mt-4 text-lg">
              {Math.round(loadingProgress)}% Complete
            </p>
          </motion.div>

          {/* Fun Facts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-purple-200"
          >
            <p className="text-sm">✨ Preparing your personalized questions...</p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 p-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-green-400">N</span>
            <span className="text-pink-400">G</span>
            <span className="text-orange-400">e</span>
            <span className="text-blue-400">n</span>
            <span className="text-white"> Placement Test</span>
          </h1>
          <p className="text-purple-200">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm border border-white/30">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 via-orange-400 to-pink-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-balance">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                    selectedAnswers[currentQuestion] === index
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white border-2 border-orange-400 shadow-lg'
                      : 'bg-white/20 text-white border-2 border-white/30 hover:bg-white/30 hover:border-orange-400'
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-balance">{option}</span>
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-8 py-3 rounded-xl font-bold bg-white/20 text-white border-2 border-white/30 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/20 disabled:hover:scale-100 transition-all"
          >
            ← Previous
          </motion.button>

          {currentQuestion === questions.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={selectedAnswers[currentQuestion] === null}
              className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
            >
              Submit Test ✓
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === null}
              className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
            >
              Next →
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}
