import arcjet, { tokenBucket } from "arcjet";
import { NextResponse } from "next/server";
import { aj } from "@/utils/arcjet";

export async function GET(req: Request) {
  const userId = "user123"; // Replace with actual user identification logic
  const decision = await aj.protect(req, { userId, requested: 5 });
  console.log("ArcJet Decision:", decision);

  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "Too many requests", reason: decision.reason },
      { status: 429 }
    );
  }

  return NextResponse.json({ message: "Hello World" });
}
