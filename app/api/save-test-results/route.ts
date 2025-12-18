// app/api/save-test-results/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      studentInfo,
      surveyData,
      questions,
      selectedAnswers,
      score,
      totalQuestions,
      belt,
    } = body

    // Validate required fields
    if (!studentInfo?.name || !studentInfo?.email) {
      return NextResponse.json(
        { error: 'Missing required student information' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const collection = db.collection('test_results')

    // Prepare the document to store
    const testResult = {
      // Student Information
      studentInfo: {
        name: studentInfo.name,
        age: studentInfo.age,
        phone: studentInfo.phone,
        email: studentInfo.email,
      },

      // Survey Data
      surveyData: {
        country: surveyData.country,
        city: surveyData.city,
        schoolName: surveyData.schoolName,
        preferredHouse: surveyData.preferredHouse,
        techExperience: surveyData.techExperience,
        techDetails: surveyData.techDetails,
        heardAboutUs: surveyData.heardAboutUs,
      },

      // Test Results
      testResults: {
        score: score,
        totalQuestions: totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
        belt: {
          name: belt.belt,
          stage: belt.stage,
          color: belt.color,
          focus: belt.focus,
          duration: belt.duration,
          totalHours: belt.totalHours,
          totalClasses: belt.totalClasses,
        },
      },

      // Questions and Answers
      questionsAndAnswers: questions.map((q: any, index: number) => ({
        questionNumber: index + 1,
        question: q.question,
        options: q.options,
        correctAnswerIndex: q.ans_idx ?? q.correctAnswer,
        userAnswerIndex: selectedAnswers[index],
        isCorrect: selectedAnswers[index] === (q.ans_idx ?? q.correctAnswer),
        justification: q.justification,
      })),

      // Metadata
      submittedAt: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    }

    // Insert into MongoDB
    const result = await collection.insertOne(testResult)

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
      message: 'Test results saved successfully',
    })

  } catch (error) {
    console.error('Error saving test results:', error)
    return NextResponse.json(
      { error: 'Failed to save test results', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}