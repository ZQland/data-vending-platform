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
    console.log(token);
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      const userId = (decoded as any).id; // Get the user ID from the token
  
      const { datasetId } = await req.json(); // Get dataset ID from request body
  
      // Insert the purchase into the purchases table
      const result = await query(
        'INSERT INTO purchases (user_id, dataset_id) VALUES ($1, $2) RETURNING *',
        [userId, datasetId]
      );
  
      return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
      return NextResponse.json({ message: 'Error processing purchase' }, { status: 500 });
    }
  }