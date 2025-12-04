import React, { use, useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeUpload from "./ResumeUpload";
import JobDescription from "./JobDescription";
import axios from "axios";
import { api } from "../../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Loader2Icon } from "lucide-react";
import { useMutation } from "convex/react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useRouter } from "next/router";

function CreateInterviewDialog() {
  const [formData, setFormData] = useState<any>();
  const [file, setFile] = useState<File | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const router = useRouter();
  const saveInterviewQuestion = useMutation(
    api.Interview.SaveInterviewQuestions
  );

  const onHandleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onSubmit = async () => {
    setLoading(true);
    const formData_ = new FormData();
    formData_.append("file", file ?? "");
    formData_?.append("jobTitle", formData?.jobTitle);
    formData_?.append("jobDescription", formData?.jobDescription);

    try {
      const res = await axios.post("api/generate-interview-questions", payload);
      console.log(res.data);

      if (res?.data?.status === 429) {
        toast.warning(res?.data?.result);
        console.log(res?.data?.result);
        return;
      }

      // save to database
      const interviewId = await saveInterviewQuestion({
        question: res.data?.questions,
        resumeUrl: res?.data?.resumeUrl ?? "",
        userId: userDetail?.id,
        jobTitle: formData?.jobTitle ?? "",
        jobDescription: formData?.jobDescription ?? "",
      });

      router.push("/interview/" + interviewId);
    } catch (err) {
      console.log("Error uploading file:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button>Create New Interview</Button>
        </DialogTrigger>
        <DialogContent className="min-w-3xl">
          <DialogHeader>
            <DialogTitle>Please submit following details</DialogTitle>
            <DialogDescription>
              <Tabs defaultValue="resume-upload" className="w-full mt-5">
                <TabsList>
                  <TabsTrigger value="resume-upload">
                    <ResumeUpload setFiles={(file: File) => setFile(file)} />
                  </TabsTrigger>
                  <TabsTrigger value="job-description">
                    <JobDescription onHandleInputChange={onHandleInputChange} />
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="resume-upload">
                  <ResumeUpload />
                </TabsContent>
                <TabsContent value="job-description">
                  <JobDescription />
                </TabsContent>
              </Tabs>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-6">
            <DialogClose>
              <Button variant={"ghost"}>Cancel</Button>
            </DialogClose>
            <Button onClick={onSubmit} disabled={loading || !file}>
              {loading && <Loader2Icon className="animate-spin " />} Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default CreateInterviewDialog;
