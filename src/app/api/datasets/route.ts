// app/api/datasets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import jwt from 'jsonwebtoken';

export async function GET() {
    try {
        const result = await query('SELECT * FROM datasets ORDER BY created_at DESC');
        return NextResponse.json(result.rows, { status: 200 });
      } catch (error) {
        return NextResponse.json({ message: 'Failed to retrieve datasets' }, { status: 500 });
      }
    }
    
