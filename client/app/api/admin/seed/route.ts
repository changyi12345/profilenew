import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const token = req.headers.get('x-seed-token') || '';
  const guard = process.env.ADMIN_SEED_TOKEN || '';
  if (!guard || token !== guard) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'username and password required' }, { status: 400 });
    }
    const hash = await bcrypt.hash(password, 10);
    const existing = await Admin.findOne({ username });
    if (existing) {
      existing.password = hash;
      await existing.save();
      return NextResponse.json({ success: true, updated: true });
    } else {
      await Admin.create({ username, password: hash });
      return NextResponse.json({ success: true, created: true });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
