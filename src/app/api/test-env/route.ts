import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    isVercel: process.env.VERCEL === '1',
    nodeEnv: process.env.NODE_ENV,
    // List some standard non-sensitive keys to verify they are active
    visibleKeys: Object.keys(process.env).filter(key => 
      !key.toLowerCase().includes('secret') && 
      !key.toLowerCase().includes('password') && 
      !key.toLowerCase().includes('token') && 
      !key.toLowerCase().includes('url') && 
      !key.toLowerCase().includes('key')
    ),
  });
}
