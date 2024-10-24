// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../../../../../lib/db';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (user && user.password === password) {
        // Generate JWT if password is correct
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        return NextResponse.json({ token }); // Return the JWT token on success
    } else {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    } 
  } catch (error) {
    return NextResponse.json({ message: 'Error to login' }, { status: 500 });
  }
  
}
