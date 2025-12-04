import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { h2 } from "motion/react-client";
import { ArrowRight } from "lucide-react";

type Props = {
  feedbackInfo: FeedbackInfo;
};

export type FeedbackInfo = {
  feedback: string;
  rating: number;
  suggestions: string[];
};

function FeedbackDialog({ feedbackInfo }: Props) {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Feedback</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              Interview Feedbackf
            </DialogTitle>
            <DialogDescription>
              <div>
                <h2 className="font-bold text-xl text-black">Feedback : </h2>
                <p className="text-lg">{feedbackInfo?.feedback}</p>
                <div>
                  <h2 className="font-bold text-xl text-black">
                    Suggestion :{" "}
                  </h2>
                  {feedbackInfo?.suggestions?.map((item, index) => (
                    <h2 className="p-2 my-1 bg-gray rounded-lg flex gap-2">
                      {" "}
                      <ArrowRight className="h-4 w-4" />
                      {item}
                    </h2>
                  ))}
                </div>
                <h2 className="font-bold text-xl text-black">
                  Rating :{" "}
                  <span className="text-primary">{feedbackInfo?.rating}</span>
                </h2>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FeedbackDialog;
