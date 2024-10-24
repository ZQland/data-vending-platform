// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '../../../../../lib/db';

export async function POST(req: NextRequest) {
  const { company, email, password, role } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await query(
      'INSERT INTO users (company_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [company, email, hashedPassword, role]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json({ message: 'Error registering user' }, { status: 500 });
  }
}
