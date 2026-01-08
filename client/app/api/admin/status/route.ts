import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admin from '@/models/Admin';

export async function GET() {
  try {
    await connectDB();
    const count = await Admin.countDocuments();
    return NextResponse.json({ success: true, hasAdmin: count > 0, count });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
