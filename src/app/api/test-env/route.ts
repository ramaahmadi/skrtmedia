import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const result = await pool.query('SELECT NOW() as current_time');
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Database connection failed',
      },
      { status: 500 }
    );
  }
}
