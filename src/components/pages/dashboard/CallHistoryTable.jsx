import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, ArrowRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { deleteScheduledCallRequest } from "../../../redux/callSlice";
import { toast } from "react-toastify";

export default function CallHistoryTable({ calls, totalPages, currentPage, onPageChange, loading, scheduledToId }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const callsLoading = useSelector(state => state.call.loading);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-GB");
    } catch (e) {
      console.error("Invalid date string for formatDate:", dateStr, e);
      return "Invalid Date";
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch (e) {
      console.error("Invalid date string for formatTime:", dateStr, e);
      return "Invalid Time";
    }
  };

  const displayAiSummary = (aiSummaryValue) => {
    if (!aiSummaryValue) {
      return "No summary available";
    }
    const characterLimit = 100;
    const lines = aiSummaryValue.split('\n');
    if (lines.length > 2) {
      return lines.slice(0, 2).join(' ') + '...';
    }
    if (aiSummaryValue.length > characterLimit) {
      return aiSummaryValue.substring(0, characterLimit) + '...';
    }
    return aiSummaryValue;
  };

  const handleDelete = (callId) => {
    if (window.confirm("Are you sure you want to delete this call?")) {
      dispatch(deleteScheduledCallRequest({ callId, scheduledToId }));
    }
  };

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 max-w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="py-2 px-3 font-medium text-sm sm:text-base">Name</th>
              <th className="py-2 px-3 font-medium text-sm sm:text-base text-center">Date</th>
              <th className="hidden sm:table-cell py-2 px-3 font-medium text-sm sm:text-base text-center">Time</th>
              <th className="hidden sm:table-cell py-2 px-3 font-medium text-sm sm:text-base text-center">Call Status</th>
              <th className="hidden sm:table-cell py-2 px-3 font-medium text-sm sm:text-base text-center">Details</th>
              <th className="hidden sm:table-cell py-2 px-3 font-medium text-sm sm:text-base text-center">Delete</th>
              <th className="sm:hidden py-2 px-3 font-medium text-sm text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {calls && calls.length > 0 ? (
              calls.map((call) => (
                <tr
                  key={call._id}
                  className="border-b border-gray-200 last:border-none hover:bg-gray-50 transition"
                >
                  <td className={`py-2 px-3 text-sm sm:text-base ${call.recipientName && call.recipientName.length > 12 ? 'whitespace-normal' : 'whitespace-nowrap'}`}>
                    {call.recipientName || "N/A"}
                  </td>
                  <td className="py-2 px-3 text-sm sm:text-base text-center">
                    {formatDate(call.scheduledAt)}
                  </td>
                  <td className="hidden sm:table-cell py-2 px-3 text-sm sm:text-base text-center">
                    {formatTime(call.scheduledAt)}
                  </td>
                  <td className="hidden sm:table-cell py-2 px-3 text-sm sm:text-base text-center">
                    {displayAiSummary(call.status)}
                  </td>

                  {/* Large Screen: Details + Delete separate */}
                  <td className="hidden sm:table-cell py-2 px-3 text-xs sm:text-sm whitespace-nowrap text-center">
                    <button
                      onClick={() => navigate("/call-details", { state: { callData: call } })}
                      className="text-[#3fbf81] font-medium cursor-pointer hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                  <td className="hidden sm:table-cell py-2 px-3 text-xs sm:text-sm whitespace-nowrap text-center">
                    <button
                      onClick={() => handleDelete(call._id)}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                      disabled={callsLoading}
                      title="Delete Call"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>

                  {/* Mobile Screen: Actions combined */}
                  <td className="sm:hidden py-2 px-3 text-xs sm:text-sm whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => navigate("/call-details", { state: { callData: call } })}
                        className="text-[#3fbf81] font-medium cursor-pointer hover:underline"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(call._id)}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                        disabled={callsLoading}
                        title="Delete Call"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500 italic text-sm sm:text-base"
                >
                  No calls found for the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            title="Previous Page"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            title="Next Page"
          >
            <ArrowRightIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}
    </div>
  );
}
