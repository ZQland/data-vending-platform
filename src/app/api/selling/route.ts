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
    try {
      // Log the Authorization header for debugging
      const authHeader = req.headers.get('authorization');
      console.log('Authorization header:', authHeader);
  
      // Extract the token from the Authorization header
      const token = authHeader?.split(' ')[1];
  
      if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
  
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      console.log('Decoded token:', decoded);
  
      const userId = (decoded as any).id; // Extract user ID from JWT
      const { seller_name, title, description } = await req.json(); // Extract dataset info from request body
  
      // Insert dataset into the database
      const result = await query(
        'INSERT INTO datasets (seller_name, title, description, seller_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [seller_name, title, description, userId]
      );
  
      return NextResponse.json(result.rows[0], { status: 201 }); // Return the newly created dataset
    } catch (error) {
      console.error('Error processing the request:', error);
      return NextResponse.json({ message: 'Error adding dataset for sale' }, { status: 500 });
    }
  }