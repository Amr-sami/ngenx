'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

// Belt levels data based on the curriculum
const beltLevels = [
  {
    stage: 'Pre-Foundation',
    belt: 'White',
    color: 'bg-gray-200',
    textColor: 'text-gray-800',
    duration: '1 Month',
    totalHours: '12 hrs',
    totalClasses: '8 Classes',
    models: 'Universal',
    focus: 'Digital Awareness & Curiosity',
    scoreRange: [0, 2]
  },
  {
    stage: 'Foundation',
    belt: 'Yellow',
    color: 'bg-yellow-400',
    textColor: 'text-yellow-900',
    duration: '3-4 Months',
    totalHours: '35 hrs',
    totalClasses: '24 Classes',
    models: 'Universal',
    focus: 'Core Coding & Logical Thinking',
    scoreRange: [3, 4]
  },
  {
    stage: 'Foundation',
    belt: 'Orange',
    color: 'bg-orange-500',
    textColor: 'text-white',
    duration: '3-4 Months',
    totalHours: '35 hrs',
    totalClasses: '24 Classes',
    models: '3 Models',
    focus: 'Creativity & Digital Design',
    scoreRange: [5, 6]
  },
  {
    stage: 'Foundation',
    belt: 'Green',
    color: 'bg-green-500',
    textColor: 'text-white',
    duration: '3-4 Months',
    totalHours: '35 hrs',
    totalClasses: '24 Classes',
    models: '3 Models',
    focus: 'Smart Projects (AI & Robotics)',
    scoreRange: [7, 8]
  },
  {
    stage: 'Specialization',
    belt: 'Blue',
    color: 'bg-blue-500',
    textColor: 'text-white',
    duration: '3-4 Months',
    totalHours: '35 hrs',
    totalClasses: '24 Classes',
    models: '3 Models',
    focus: 'Deep Track Exploration',
    scoreRange: [9, 9]
  },
  {
    stage: 'Specialization',
    belt: 'Red',
    color: 'bg-red-500',
    textColor: 'text-white',
    duration: '3-4 Months',
    totalHours: '35 hrs',
    totalClasses: '24 Classes',
    models: '3 Models',
    focus: 'Advanced Projects',
    scoreRange: [10, 10]
  },
  {
    stage: 'Specialization',
    belt: 'Brown',
    color: 'bg-amber-800',
    textColor: 'text-white',
    duration: '3-4 Months',
    totalHours: '35 hrs',
    totalClasses: '24 Classes',
    models: '3 Models',
    focus: 'Innovation & Entrepreneurship',
    scoreRange: [11, 11]
  },
  {
    stage: 'Specialization',
    belt: 'Black',
    color: 'bg-gray-900',
    textColor: 'text-white',
    duration: '3-4 Months',
    totalHours: '35 hrs',
    totalClasses: '24 Classes',
    models: '3 Models',
    focus: 'Research & Leadership',
    scoreRange: [12, 12]
  }
]

export default function ResultsPage() {
  const router = useRouter()
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(12)
  const [recommendedBelt, setRecommendedBelt] = useState(beltLevels[0])
  const [studentInfo, setStudentInfo] = useState({ name: '', age: '', phone: '', email: '' })

  useEffect(() => {
    // Get test results from sessionStorage
    const storedScore = sessionStorage.getItem('testScore')
    const storedTotal = sessionStorage.getItem('totalQuestions')
    const storedStudentInfo = sessionStorage.getItem('studentInfo')

    if (storedScore) {
      const scoreValue = parseInt(storedScore)
      setScore(scoreValue)
      
      // Determine recommended belt based on score
      const belt = beltLevels.find(
        level => scoreValue >= level.scoreRange[0] && scoreValue <= level.scoreRange[1]
      ) || beltLevels[0]
      
      setRecommendedBelt(belt)
    }

    if (storedTotal) {
      setTotalQuestions(parseInt(storedTotal))
    }

    if (storedStudentInfo) {
      setStudentInfo(JSON.parse(storedStudentInfo))
    }
  }, [])

  const percentage = Math.round((score / totalQuestions) * 100)

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
            <span className="text-white"> Placement Results</span>
          </h1>
          <p className="text-purple-200 text-lg">
            Congratulations, {studentInfo.name}!
          </p>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 mb-8"
        >
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="inline-block mb-4"
            >
              <div className="text-7xl font-bold text-white">
                {score}/{totalQuestions}
              </div>
              <div className="text-2xl text-purple-200 mt-2">{percentage}% Correct</div>
            </motion.div>
          </div>

          {/* Belt Result */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              Your Recommended Level
            </h2>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              {/* Belt Badge */}
              <motion.div
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
                className="flex-shrink-0"
              >
                <div className={`w-32 h-32 rounded-full ${recommendedBelt.color} flex items-center justify-center shadow-2xl border-4 border-white/30`}>
                  <span className={`text-3xl font-bold ${recommendedBelt.textColor}`}>
                    {recommendedBelt.belt}
                  </span>
                </div>
              </motion.div>

              {/* Belt Details */}
              <div className="text-center md:text-left">
                <h3 className="text-3xl font-bold text-white mb-2">
                  {recommendedBelt.belt} Belt
                </h3>
                <p className="text-xl text-purple-200 mb-1">{recommendedBelt.stage}</p>
                <p className="text-lg text-purple-300 font-semibold mb-4 text-balance">
                  {recommendedBelt.focus}
                </p>
              </div>
            </div>

            {/* Program Details */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-orange-400 font-bold text-lg mb-1">Duration</div>
                <div className="text-white">{recommendedBelt.duration}</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-pink-400 font-bold text-lg mb-1">Total Hours</div>
                <div className="text-white">{recommendedBelt.totalHours}</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-green-400 font-bold text-lg mb-1">Classes</div>
                <div className="text-white">{recommendedBelt.totalClasses}</div>
              </div>
              {/* <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-blue-400 font-bold text-lg mb-1">Models</div>
                <div className="text-white">{recommendedBelt.models}</div>
              </div> */}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-12 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Start Another Test
          </button>
        </motion.div>
      </div>
    </div>
  )
}
