import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET() {
    try {
        const result = await query('SELECT * FROM companies');
        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to retrieve companies' }, { status: 500 });
    }
}
