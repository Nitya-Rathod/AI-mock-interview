import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function JobDescription({ onHandleInputChange }: any) {
  return (
    <div className="border rounded-2xl p-10">
      <div className="mb-4">
        <label>Job Title</label>
        <Input
          placeholder="Ex. Software Engineer"
          onChange={(event) =>
            onHandleInputChange("jobTitle", event.target.value)
          }
        />
      </div>

      <div className="mb-4">
        <label>Job Description</label>
        <Textarea
          placeholder="Describe the job role and responsibilities"
          className="h=[200px]"
          onChange={(event) =>
            onHandleInputChange("jobDescription", event.target.value)
          }
        />
      </div>
    </div>
  );
}

export default JobDescription;
