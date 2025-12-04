import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { question } = await request.json();

  const result = await axios.get("paste endpoint", {
    headers: {
      Authorization: `Bearer ${process.env.AKOOL_API_TOKEN}`,
    },
  });

  const isExist = result.data.data.find(
    (item: any) => item.name.trim() == "Interview Agent Prod"
  );

  if (!isExist) {
    // create new knowledge base
    const resp = await axios.post(
      "paste endpoint",
      {
        name: "Interview Agent Prod" + Date.now(),
        prologue: "Tell me about yourself",
        prompt: `You are a friednly job interviewer. Ask the user one interview question at a time. Wait for their spoken response before asking the next question. Start with: "Tell me about yourself." Then ask following questions one by one. Speak in a prfessional and encouraging tone. questions: ${question.map((q: any) => q.question).join("\n")} After the user responds, ask the next question in the list. Do not repeat previous questions.`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AKOOL_API_TOKEN}`,
        },
      }
    );
    console.log(resp.data);
    return NextResponse.json(resp.data);
  }

  return NextResponse.json(result.data);
}
