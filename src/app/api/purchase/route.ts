// app/api/purchases/route.ts
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
      SELECT datasets.title, datasets.description, purchases.purchase_date
      FROM purchases
      JOIN datasets ON purchases.dataset_id = datasets.id
      WHERE purchases.user_id = $1
    `, [userId]);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching purchased datasets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    const token = req.headers.get('authorization')?.split(' ')[1];
  
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  
    try {
      // Decode the JWT to get user details (if necessary)
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      const userId = (decoded as any).id; // Extract user ID from the token
  
      const { datasetId, buyerId } = await req.json(); // Get datasetId and buyerId from the request body
  
      // Insert the purchase into the dataset_sales table
      const result = await query(
        `INSERT INTO dataset_sales (dataset_id, buyer_id) 
         VALUES ($1, $2) RETURNING *`,
        [datasetId, buyerId]
      );
  
      return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
      console.error('Error processing the sale:', error);
      return NextResponse.json({ message: 'Error processing the sale' }, { status: 500 });
    }
  }