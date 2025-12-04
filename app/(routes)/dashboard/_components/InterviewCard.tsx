import React from "react";
import { InterviewData } from "../../interview/[interviewId]/start/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Link } from "lucide-react";
import FeedbackDialog from "./FeedbackDialog";

type props = {
  interviewInfo: InterviewData;
};

function InterviewCard({ interviewInfo }: props) {
  return (
    <div className="p-4 border rounded-xl">
      <h2 className="font-semibold text-xl flex justify-between items-center">
        {interviewInfo?.resumeUrl ? "Resume Interview" : interviewInfo.jobTitle}{" "}
        <Badge>{interviewInfo?.status}</Badge>
      </h2>
      <p className="line-clamp-2 text-gray-500">
        {interviewInfo?.resumeUrl
          ? "We generate the Interview from the uploaded resume."
          : interviewInfo.jobDescription}
      </p>
      <div className="mt-5 flex justify-between items-center">
        {interviewInfo?.resumeUrl && (
          <FeedbackDialog feedbackInfo={interviewInfo.feedback} />
        )}
        <Link href={"/interview/" + interviewInfo?._id}>
          <Button variant={"outline"}>
            Start Interview <ArrowRight />
          </Button>
        </Link>
      </div>
    </div>
  );
}
export default InterviewCard;
