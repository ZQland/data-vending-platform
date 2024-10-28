// app/api/selling/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = (decoded as any).id;

    const result = await query(`
      SELECT title, description, created_at
      FROM datasets
      WHERE seller_id = $1
    `, [userId]);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching selling datasets' }, { status: 500 });
  }
}
// Add a new dataset
export async function POST(req: NextRequest) {
    const token = req.headers.get('authorization')?.split(' ')[1];
  
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  
    try {
      // Verify the token to get the user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      const userId = (decoded as any).id;  // Extract user ID from JWT
  
      // Extract the dataset details from the request body
      const { title, description, seller_company_name, seller_company_id } = await req.json();
  
      // Validate the inputs (Optional but recommended)
      if (!title || !description || !seller_company_name || !seller_company_id) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
      }
  
      // Insert the new dataset into the datasets table
      const result = await query(
        `INSERT INTO datasets (title, description, seller_company_name, seller_company_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [title, description, seller_company_name, seller_company_id]
      );
  
      return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
      console.error('Error inserting dataset:', error);
      return NextResponse.json({ message: 'Failed to submit dataset' }, { status: 500 });
    }
  }