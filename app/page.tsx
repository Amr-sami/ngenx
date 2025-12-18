'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { 
  User, 
  MapPin, 
  School, 
  Home, 
  Cpu, 
  MessageCircle, 
  Phone, 
  Mail, 
  Sparkles,
  Globe
} from 'lucide-react'

type SurveyFormData = {
  name: string
  age: string
  country: string
  city: string
  schoolName: string
  preferredHouse: string
  techExperience: 'Yes' | 'No' | ''
  techDetails: string
  heardAboutUs: string
  phone: string
  email: string
}

export default function SurveyPage() {
  const router = useRouter()

  const [formData, setFormData] = useState<SurveyFormData>({
    name: '',
    age: '',
    country: '',
    city: '',
    schoolName: '',
    preferredHouse: '',
    techExperience: '',
    techDetails: '',
    heardAboutUs: '',
    phone: '',
    email: '',
  })

  const handleChange =
    (field: keyof SurveyFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }))
    }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const surveyResults = `*Survey Questions*

*1. Full Name*
-${formData.name}

*2. Age*
-${formData.age}

*3. Country*
-${formData.country}

*4. city*
-${formData.city}

*5. School Name*
-${formData.schoolName}

*6. Which house would you prefer to join?*
-${formData.preferredHouse}

*7. Have you previously studied anything related to technology?*
-${formData.techExperience || 'No'}

*7.1 If yes, please describe your background in technology.*
-${formData.techDetails || 'N/A'}

*8. How did you hear about us?*
-${formData.heardAboutUs || 'N/A'}
`

    sessionStorage.setItem('surveyResults', surveyResults)
    sessionStorage.setItem(
      'studentInfo',
      JSON.stringify({
        name: formData.name,
        age: formData.age,
        phone: formData.phone,
        email: formData.email,
      }),
    )
    
    // ✅ NEW: Store complete survey data for MongoDB
    sessionStorage.setItem(
      'surveyData',
      JSON.stringify({
        country: formData.country,
        city: formData.city,
        schoolName: formData.schoolName,
        preferredHouse: formData.preferredHouse,
        techExperience: formData.techExperience,
        techDetails: formData.techDetails,
        heardAboutUs: formData.heardAboutUs,
      })
    )

    router.push('/test')
  }

  const isFormValid =
    formData.name &&
    formData.age &&
    formData.country &&
    formData.city &&
    formData.schoolName &&
    // formData.preferredHouse &&
    formData.techExperience &&
    formData.heardAboutUs &&
    formData.phone &&
    formData.email &&
    (formData.techExperience === 'No' || formData.techDetails)

  return (
    <div className="min-h-screen w-full bg-[#1a0b2e] relative flex items-center justify-center p-4 lg:p-8 overflow-x-hidden">
      
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-pink-500/20 rounded-full mix-blend-screen filter blur-[80px] animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl overflow-hidden">
          
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            
            {/* --- Header Section --- */}
            <div className="bg-black/20 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
                {/* Logo - Transparent & Scaled */}
                <div className="relative w-24 h-24 md:w-20 md:h-20 flex-shrink-0">
                  <Image 
                    src="/image.png" 
                    alt="Logo" 
                    fill
                    className="object-contain drop-shadow-lg"
                    priority
                  />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide">
                    Placement Survey
                  </h1>
                  <p className="text-purple-200 text-sm md:text-base max-w-md">
                    Help us personalize your AI learning journey! 🚀
                  </p>
                </div>
              </div>
              
              {/* Progress Indicator (Optional visual flair) */}
              <div className="hidden md:flex items-center gap-2 text-white/50 text-xs font-mono border border-white/20 rounded-full px-4 py-2 bg-white/5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                System Online
              </div>
            </div>

            {/* --- Main Content Grid --- */}
            <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              
              {/* LEFT COLUMN: Personal Info */}
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-pink-300 flex items-center gap-2 mb-4">
                  <User className="w-5 h-5" /> About You
                </h3>

                {/* Name & Age Row */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <InputField 
                      icon={User} 
                      placeholder="Full Name" 
                      value={formData.name} 
                      onChange={handleChange('name')} 
                    />
                  </div>
                  <div className="w-24 md:w-32">
                    <InputField 
                      icon={Sparkles} 
                      placeholder="Age" 
                      type="number" 
                      min="5" 
                      max="18"
                      value={formData.age} 
                      onChange={handleChange('age')} 
                    />
                  </div>
                </div>

                {/* Location Row */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <InputField 
                      icon={Globe} 
                      placeholder="Country" 
                      value={formData.country} 
                      onChange={handleChange('country')} 
                    />
                  </div>
                  <div className="flex-1">
                    <InputField 
                      icon={MapPin} 
                      placeholder="City" 
                      value={formData.city} 
                      onChange={handleChange('city')} 
                    />
                  </div>
                </div>

                {/* Contact Section */}
                <div className="pt-4 space-y-5">
                   <h3 className="text-lg font-bold text-green-300 flex items-center gap-2">
                    <Phone className="w-5 h-5" /> Parent Contact
                  </h3>
                  <InputField 
                    icon={Phone} 
                    placeholder="Phone Number" 
                    type="tel"
                    value={formData.phone} 
                    onChange={handleChange('phone')} 
                  />
                  <InputField 
                    icon={Mail} 
                    placeholder="Email Address" 
                    type="email"
                    value={formData.email} 
                    onChange={handleChange('email')} 
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: Education & Tech */}
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-blue-300 flex items-center gap-2 mb-4">
                  <School className="w-5 h-5" /> Education & Interests
                </h3>

                <InputField 
                  icon={School} 
                  placeholder="School Name" 
                  value={formData.schoolName} 
                  onChange={handleChange('schoolName')} 
                />

                {/* Select Inputs with custom styling */}
                {/* <div className="relative">
                  <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300 w-5 h-5 pointer-events-none" />
                  <select
                    value={formData.preferredHouse}
                    onChange={handleChange('preferredHouse')}
                    className="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-black/40 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-900">Select Preferred House...</option>
                    <option className="bg-slate-900">🤖 AI House</option>
                    <option className="bg-slate-900">🛡️ Cyber Security House</option>
                    <option className="bg-slate-900">💻 Programming House</option>
                    <option className="bg-slate-900">🦾 Robotics House</option>
                    <option className="bg-slate-900">📊 Data House</option>
                    <option className="bg-slate-900">🎨 Creative Arts House</option>
                  </select>
                </div> */}

                {/* Tech Toggle */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-white/80 text-sm font-medium mb-3 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-orange-400" /> Technology Experience?
                  </p>
                  <div className="flex gap-3 mb-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, techExperience: 'Yes' }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                        formData.techExperience === 'Yes'
                          ? 'bg-green-500 text-white shadow-lg'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, techExperience: 'No', techDetails: '' }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                        formData.techExperience === 'No'
                          ? 'bg-red-500 text-white shadow-lg'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      No
                    </button>
                  </div>
                  {formData.techExperience === 'Yes' && (
                    <motion.textarea
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      value={formData.techDetails}
                      onChange={handleChange('techDetails')}
                      placeholder="What have you learned? (Scratch, Python, etc.)"
                      className="w-full bg-black/20 border border-white/20 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-green-500 resize-none"
                      rows={2}
                    />
                  )}
                </div>

                {/* Source */}
                <div className="relative">
                  <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300 w-5 h-5 pointer-events-none" />
                  <select
                    value={formData.heardAboutUs}
                    onChange={handleChange('heardAboutUs')}
                    className="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-black/40 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-900">How did you hear about us?</option>
                    <option className="bg-slate-900">📱 Social media</option>
                    <option className="bg-slate-900">👫 Friend / Classmate</option>
                    <option className="bg-slate-900">🏫 School</option>
                    <option className="bg-slate-900">✨ Other</option>
                  </select>
                </div>

              </div>
            </div>

            {/* --- Footer / Submit --- */}
            <div className="p-6 md:p-8 pt-0 mt-auto">
              <button
                type="submit"
                disabled={!isFormValid}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/50 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
              >
                <span>Generate My Test</span>
                <Sparkles className="w-5 h-5 animate-spin-slow" />
              </button>
            </div>

          </form>
        </div>
      </motion.div>
    </div>
  )
}

// Helper Component for consistent inputs
function InputField({ 
  icon: Icon, 
  placeholder, 
  value, 
  onChange, 
  type = "text",
  min,
  max
}: { 
  icon: any, 
  placeholder: string, 
  value: string, 
  onChange: any, 
  type?: string,
  min?: string,
  max?: string
}) {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-purple-300 group-focus-within:text-purple-400 transition-colors" />
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        className="block w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-black/40 transition-all"
        placeholder={placeholder}
        required
      />
    </div>
  )
}