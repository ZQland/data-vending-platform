// app/api/companies/[id]/datasets/purchased.ts
import { query } from '../../../../../../lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const companyId = req.nextUrl.pathname.split('/')[3];

    const result = await query(
      `SELECT d.* FROM datasets d
       INNER JOIN dataset_sales ds ON d.id = ds.dataset_id
       WHERE ds.buyer_id = $1`,
      [companyId]
    );

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch purchased datasets' }, { status: 500});
  }
}
