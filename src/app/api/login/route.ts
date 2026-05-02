import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = (await req.json()) as { email: string; password: string };
  const { email, password } = body;

  // Dummy user for testing (Replace with DB lookup)
  const validUser = { email: 'admin@example.com', password: 'password123' };

  if (email === validUser.email && password === validUser.password) {
    return NextResponse.json({ success: true, message: 'Login successful' });
  }

  return NextResponse.json(
    { success: false, message: 'Invalid credentials' },
    { status: 401 },
  );
}
