import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../../lib/db'; // Adjust path to your DB query function

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params; // Get the company ID from the dynamic route

  try {
    // Fetch the company information based on the ID
    const result = await query(
      'SELECT * FROM companies WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json({ message: 'Failed to fetch company data' }, { status: 500 });
  }
}
