// app/api/companies/[id]/datasets/selling.ts
import { query } from '../../../../../../lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const companyId = req.nextUrl.pathname.split('/')[3];

    const result = await query(
      `SELECT * FROM datasets WHERE seller_company_id = $1`,
      [companyId]
    );

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch datasets for sale' }, { status: 500 });
  }
}
