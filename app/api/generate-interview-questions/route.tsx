import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import axios from "axios";
import { aj } from "@/utils/arcjet";
import { currentUser } from "@clerk/nextjs/server";
import { stat } from "fs";

var imagekit = new ImageKit({
  publicKey: "your_public_api_key",
  privateKey: "your_private_api_key",
  urlEndpoint: "https://ik.imagekit.io/your_imagekit_id/",
});

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const jobTitle = formData.get("jobTitle") as File;
    const jobDescription = formData.get("jobDescription") as File;

    const decision = await aj.protect(req, {
      userId: user?.primaryEmailAddress?.emailAddress ?? "",
      requested: 5,
    });
    console.log("ArcJet Decision:", decision);

    // @ts-ignore
    if (decision?.reason?.remaining == 0) {
      return NextResponse.json({
        status: 429,
        result: "No free credit remainin, Try again in 24 hours",
      });
    }

    if (file) {
      console.log("file:", formData);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: Date.now().toString() + ".pdf",
        isPrivateFile: true,
      });
    } else {
      // call n8n webhook
      const result = await axios.post("", {
        resumeUrl: null,
        jobTitle: jobTitle,
        jobDescription: jobDescription,
      });
      console.log(result.data);

      return NextResponse.json({
        questions: result.data?.message?.content?.questions,
        resumeUrl: null,
      });
    }
  } catch (e: any) {
    console.error("Upload failed:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
