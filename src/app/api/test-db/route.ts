// app/api/test-db/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';  // Import your query function

export async function GET(req: NextRequest) {
  try {
    // Query to get all data from car_insurance_documents table
    const result = await query('SELECT * FROM car_insurance_documents LIMIT 10');
    
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ message: 'Error connecting to database' }, { status: 500 });
  }
}
