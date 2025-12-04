import { Button } from "@/components/ui/button";
import Image from "next/image";
import CreateInterviewDialog from "../../_components/CreateInterviewDialog";
import React from "react";

function EmptyState() {
  return (
    <div className="mt-14 flex flex-col items-center gap-5">
      <Image
        src={"/interview.png"}
        alt="Empty State"
        width={130}
        height={130}
      />
      <h2 className="text-lg mt-2 text-gray-500">
        You do not have any interview created
      </h2>
      <CreateInterviewDialog />
    </div>
  );
}
export default EmptyState;
