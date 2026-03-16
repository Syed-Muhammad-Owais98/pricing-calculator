import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const decodedString = atob(token);
    const tokenData = JSON.parse(decodedString);

    const paraphraseCheck = tokenData.paraphrase === process.env.PARAPHASE_KEY;
    const expiryCheck = new Date(tokenData.expiresAt) > new Date();

    return NextResponse.json({ valid: paraphraseCheck && expiryCheck });
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
}
