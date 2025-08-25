import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  PlayCircleIcon,
  ChatBubbleLeftEllipsisIcon,
  CalendarDaysIcon,
  ClockIcon,
  InformationCircleIcon,
  UserGroupIcon,
  CpuChipIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const CallDetailsAdmin = () => {
  const { state } = useLocation();
  const call = state?.callData; // Data HistoryCall page se aa raha hai
  const navigate = useNavigate();

  // Helper functions date, time, aur duration format karne ke liye
  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-GB")
      : "N/A";

  const formatTime = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "N/A";

  const formatDuration = (seconds) => {
    if (typeof seconds !== "number" || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Agar kisi reason se call ka data nahi milta
  if (!call) {
    return (
      <div className="min-h-screen bg-white p-5 flex flex-col items-center justify-center">
        <p className="text-gray-500 text-center mb-6">
          Call data not found. Please go back to Call History.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-[#3fbf81] text-white rounded-full hover:bg-[#36a973] transition"
        >
          <ArrowLeftIcon className="w-5 h-5" /> Back
        </button>
      </div>
    );
  }

  const DetailItem = ({ label, value }) => (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800 break-words">
        {value || "N/A"}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        Call with {call.recipientName}
      </h1>
      <p className="text-gray-500 text-sm mb-8 flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="flex items-center gap-1.5">
          <CalendarDaysIcon className="w-4 h-4" />{" "}
          {formatDate(call.scheduledAt)}
        </span>
        <span className="flex items-center gap-1.5">
          <ClockIcon className="w-4 h-4" /> {formatTime(call.scheduledAt)}
        </span>
        <span className="flex items-center gap-1.5">
          Duration: {formatDuration(call.durationInSeconds)}
        </span>
      </p>

      {/* Call Participants & Info Section */}
      <section className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <UserGroupIcon className="w-5 h-5 text-[#3fbf81]" /> Call
          Participants & Info
        </h2>
        <div className="p-5 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <DetailItem label="Scheduled By" value={call.scheduledBy?.name} />
          <DetailItem label="Recipient Name" value={call.recipientName} />
          <DetailItem label="Recipient Number" value={call.recipientNumber} />
          <DetailItem label="Call Status" value={call.status} />
          <DetailItem label="Retries Left" value={String(call.triesLeft)} />
        </div>
      </section>

      {/* AI Summary Section */}
      <section className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-[#3fbf81]" />{" "}
          AI-Powered Summary
        </h2>
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
          {call.aiSummary || "No AI summary available for this call."}
        </p>
      </section>

      {/* Call Recordings Section */}
      <section className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <PlayCircleIcon className="w-5 h-5 text-[#3fbf81]" /> Call
          Recording
        </h2>
        {call.audioRecordingUrl ? (
          <div className="bg-gray-100 p-4 rounded-lg">
            {/* <audio controls className="w-full">
              <source src={call.audioRecordingUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio> */}
            No recording available for this call.
          </div>
        ) : (
          <div className="bg-black text-white p-4 rounded-lg text-center">
            No recording available for this call.
          </div>
        )}
      </section>

      {/* Transcript Section */}
      <section className="mb-10">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <InformationCircleIcon className="w-5 h-5 text-[#3fbf81]" />{" "}
          Transcript
        </h2>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-gray-700 text-sm leading-relaxed max-h-[300px] overflow-y-auto">
          {call.transcript && call.transcript.length > 0 ? (
            call.transcript.map((line, i) => (
              <div
                key={i}
                className="flex items-start gap-2 mb-3 last:mb-0"
              >
                {line.role === "assistant" ? (
                  <CpuChipIcon className="w-6 h-6 text-[#3fbf81] flex-shrink-0 mt-0.5" />
                ) : (
                  <UserCircleIcon className="w-6 h-6 text-[#3fbf81] flex-shrink-0 mt-0.5" />
                )}
                <p className="text-gray-700">
                  <span className="font-medium text-gray-900">
                    {line.role === "assistant" ? "AI" : "User"}:
                  </span>{" "}
                  {line.message}
                </p>
              </div>
            ))
          ) : (
            <p>No transcript available for this call.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default CallDetailsAdmin;