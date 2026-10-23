import { NextResponse } from "next/server";

// The AI assistant (OpenAI + Pinecone) was retired on 23 Oct 2026. The chat
// now answers in the browser from the approved bank in const/chatbot, at no
// running cost. This route stays only so old callers get a clear answer.
export function POST() {
  return NextResponse.json(
    { error: "This assistant has been replaced. Please use the chat on the website." },
    { status: 410 },
  );
}
