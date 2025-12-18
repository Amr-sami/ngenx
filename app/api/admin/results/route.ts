import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();
    
    // Target your specific collection
    const results = await db
      .collection("test_results")
      .find({})
      .sort({ submittedAt: -1 })
      .toArray();

    // IMPORTANT: MongoDB data (like _id and Dates) must be stringified 
    // to be sent over a JSON API in Next.js
    const serializedData = JSON.parse(JSON.stringify(results));

    console.log(`Successfully fetched ${serializedData.length} documents`);
    
    return NextResponse.json(serializedData);
  } catch (e) {
    console.error("Admin API Error:", e);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}