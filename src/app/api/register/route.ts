// app/api/upload-url/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { bucket = "ticket-proofs", path } = await req.json();
    if (!path) return NextResponse.json({ error: "path required" }, { status: 400 });
    
    // Supabase storage removed - return mock response
    const mockSignedUrl = `https://mock-storage.example.com/upload/${bucket}/${path}`;
    return NextResponse.json({ signedUploadUrl: mockSignedUrl }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unexpected" }, { status: 500 });
  }
}
