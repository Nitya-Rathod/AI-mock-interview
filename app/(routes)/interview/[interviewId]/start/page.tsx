"use client";
import { useConvex, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { GenericAgoraSDK } from "akool-streaming-avatar-sdk";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { div } from "motion/react-client";
import { User } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { FeedbackInfo } from "@/app/(routes)/dashboard/_components/FeedbackDialog";

export type InterviewData = {
  jobTitle: string | null;
  jobDescription: string | null;
  interviewQuestions: interviewQuestions[];
  userId: string | null;
  _id: string;
  resumeUrl: string | null;
  status: string | null;
  feedback: FeedbackInfo | null;
};

type interviewQuestions = {
  answer: string;
  question: string;
};

type Messages = {
  from: "user" | "bot";
  text: string;
};

const CONTAINER_ID = "akool-avatar-container";
const AVATAR_ID = "data_lira_sp_02";
const DUMMY_CONVERSATION = [
  { from: "bot", text: "Tell me about yourself." },
  {
    from: "user",
    text: "I am a software developer with 5 years of experience.",
  },
  { from: "bot", text: "What are your strengths?" },
  { from: "user", text: "I am good at problem-solving and teamwork." },
];

function StartInterview() {
  const { interviewId } = useParams();
  const convex = useConvex();
  const [interviewData, setInterviewData] = useState<InterviewData>();
  const videoContainerRef = useRef<any>(null);
  const [agoraSdk, setAgoraSdk] = useState<GenericAgoraSDK | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [kbId, setKbId] = useState<string | null>();
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Messages[]>([]);
  const updateFeedbackk = useMutation(api.Interview.UpdateFedback);
  const router = useRouter();

  useEffect(() => {
    GetInterviewQuestions();
  }, [interviewId]);

  const GetInterviewQuestions = async () => {
    const result = await convex.query(api.Interview.GetInterviewQuestions, {
      // @ts-ignore
      interviewRecordId: interviewId,
    });
    console.log(result);
    setInterviewData(result);
  };

  useEffect(() => {
    interviewData && GetKnowledgeBase();
  }, [interviewData]);

  const GetKnowledgeBase = async () => {
    const result = await axios.post("/api/akool-knowledge-base", {
      questions: interviewData?.interviewQuestions,
    });
    console.log(result);
    setKbId(result?.data?.data?._id);
  };

  useEffect(() => {
    const sdk = new GenericAgoraSDK({ mode: "rtc", codec: "vp8" });
    setAgoraSdk(sdk);
    sdk.on({
      onStreamMessage: (uid, message) => {
        console.log("Received message from", uid, ":", message);
        // @ts-ignore
        message.pld?.text?.lenght > 0 &&
          setMessages((prev: any) => [...prev, message.pld]);
      },
      onException: (error) => {
        console.error("An exception occurred:", error);
      },
      onMessageReceived: (message) => {
        console.log("New message:", message);
      },
      onMessageUpdated: (message) => {
        console.log("Message updated:", message);
      },
      onNetworkStatsUpdated: (stats) => {
        console.log("Network stats:", stats);
      },
      onTokenWillExpire: () => {
        console.log("Token will expire in 30s");
      },
      onTokenDidExpire: () => {
        console.log("Token expired");
      },
      onUserPublished: async (user, mediaType) => {
        if (mediaType === "video") {
          await sdk.getClient().subscribe(user, mediaType);
          user?.videoTrack?.play(videoContainerRef.current);
        } else if (mediaType === "audio") {
          await sdk.getClient().subscribe(user, mediaType);
          user?.audioTrack?.play();
        }
      },
    });

    setAgoraSdk(sdk);
    return () => {
      sdk.leaveChat();
      sdk.leaveChannel();
      sdk.closeStreaming();
    };
  }, []);

  const StartConversation = async () => {
    if (!agoraSdk) return;
    setLoading(true);

    // Create Akool Session
    const result = await axios.post("/api/akool-session", {
      avatar_id: AVATAR_ID,
      kb_id: kbId,
    });
    console.log(result.data);

    const credentials = result?.data?.data?.credentials;
    if (!credentials) throw new Error("Missing credentials");

    await agoraSdk?.joinChannel({
      agora_app_id: credentials.agora_app_id,
      agora_channel: credentials.agora_channel,
      agora_token: credentials.agora_token,
      agora_uid: credentials.agora_uid,
    });

    // Initialize chat with avatar parameters
    await agoraSdk.joinChat({
      vid: "en-US-Wavenet-A",
      lang: "en",
      mode: 2, //2 for dialog mode
    });

    const Prompt = `You are a friednly job interviewer. Ask the user one interview question at a time. Wait for their spoken response before asking the next question. Start with: "Tell me about yourself." Then ask following questions one by one. Speak in a prfessional and encouraging tone. questions: ${interviewData?.interviewQuestions.map((q: any) => q.question).join("\n")} After the user responds, ask the next question in the list. Do not repeat previous questions.`;
    await agoraSdk.sendMessage(Prompt);

    await agoraSdk.toggleMic();
    setMicOn(true);
    setJoined(true);
    setLoading(false);
  };

  const leaveConveration = async () => {
    if (!agoraSdk) return;
    await agoraSdk.leaveChat();
    await agoraSdk.leaveChannel();
    await agoraSdk.closeStreaming();
    setJoined(false);
    setMicOn(false);
    await GenerateFeedback();
  };

  const toggleMic = async () => {
    if (!agoraSdk) return;
    await agoraSdk?.toggleMic();
    setMicOn(agoraSdk?.isMicEnabled());
  };

  useEffect(() => {
    console.log(JSON.stringify(messages));
  }, [messages]);

  const GenerateFeedback = async () => {
    toast.warning("Generating feedback,Please wait...");
    const result = await axios.post("/api/interview-feedback", {
      messages: DUMMY_CONVERSATION,
    });
    console.log(result.data);
    toast.success("Feedback generated successfully!");
    // Save the feedback
    const resp = await updateFeedbackk({
      feedback: result.data,
      recordId: interviewId,
    });
    console.log(resp);
    toast.success("Interview completed!");
    // navigate
    router.replace("/dashboard");
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-50">
      <div className="flex flex-col p-6 lg:w-2/3">
        <h2 className="text-4xl font-bold mb-6">Interview Session</h2>
        <div
          className="rounded-2xl overflow-hidden border bg-white flex items-center justify-center"
          ref={videoContainerRef}
          id={CONTAINER_ID}
          style={{
            width: 640,
            height: 480,
            background: "#000000",
            marginTop: 20,
          }}
        >
          {!joined && (
            <div>
              <div>
                <User size={40} className="text-gray-500" />
              </div>
            </div>
          )}
        </div>

        <div>
          <Button onClick={toggleMic}>
            {micOn ? "Mute Mic" : "Unmute Mic"}
          </Button>

          {!joined ? (
            <Button onClick={StartConversation}>Start Conversation</Button>
          ) : (
            <Button onClick={leaveConveration}>Leave Conversation</Button>
          )}
        </div>
      </div>

      <div className="flex flex-col p-6 lg:w-1/3 h-screen overflow-fauto">
        <h2 className="text-lg font-semibold my-4">Conversation</h2>
        <div className="flex-1 border border-gray-200 rounded-xl p-4 space-y-3 ">
          {messages?.length == 0 ? (
            <div>
              <p>No Messages yet</p>
            </div>
          ) : (
            <div>
              {messages?.map((msg, index) => (
                <div key={index}>
                  <h2
                    className={`p-3 rounded-lg max-w-[80%] mt-1 ${msg.from == "user" ? "bg-blue-100 text-blue-700 self-start" : "bg-green-100 text-green-700 self-end"}`}
                  >
                    {msg.text}
                  </h2>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StartInterview;
