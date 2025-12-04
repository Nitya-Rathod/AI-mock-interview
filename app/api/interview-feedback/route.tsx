import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const result = await axios.post("", {
    messages: JSON.stringify(messages),
  });
  console.log(result);
  return NextResponse.json(result?.data?.message?.content);
}
