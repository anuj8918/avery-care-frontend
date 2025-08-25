import { useDispatch, useSelector } from "react-redux";
import { scheduleHealthCallRequest, fetchScheduledCallsRequest } from "../../../redux/callSlice";
import { toast } from "react-toastify";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  FaceSmileIcon,
  FaceFrownIcon,
  BoltIcon,
  ExclamationCircleIcon,
  MinusCircleIcon,
  PhoneIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { scheduledCalls, loading: callsLoading, error: callsError } = useSelector(
    (state) => state.call
  );

  // Correctly access the 'data' array from the scheduledCalls object
  const allCallsArray = scheduledCalls?.data || [];
  // Correct pagination state (though not directly used for next call logic here, good to have)
  const currentPage = scheduledCalls?.page || 1;
  const itemsPerPage = scheduledCalls?.limit || 5; // Use the limit from the Redux state

  useEffect(() => {
    if (user?._id) {
      // Dispatch fetchScheduledCallsRequest with pagination and status 'pending'
      // To ensure we get relevant calls for "next scheduled call"
      // You might need to adjust `limit` if you expect many pending calls
      // or fetch all pending calls without limit for this specific dashboard logic.
      // For now, setting a high limit to get all relevant pending calls for sorting.
      dispatch(fetchScheduledCallsRequest({
        page: 1, // Start from page 1
        limit: 100, // Fetch a reasonable number of pending calls to find the next one
        status: 'pending', // IMPORTANT: Filter for pending calls only
      }));
    }
  }, [dispatch, user]);

  const findNextScheduledCall = () => {
    // Now, `allCallsArray` already contains the `data` from the Redux state.
    // The useEffect above ensures we fetch 'pending' calls.
    const pendingCalls = allCallsArray.filter(call => call.status === 'pending');

    if (pendingCalls.length === 0) {
      return null;
    }

    // Sort by scheduledAt date to find the earliest upcoming call
    pendingCalls.sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
    const nextCall = pendingCalls[0];

    const scheduledDate = new Date(nextCall.scheduledAt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const scheduledTime = new Date(nextCall.scheduledAt).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return {
      recipientName: nextCall.recipientName,
      date: scheduledDate,
      time: scheduledTime,
    };
  };

  const nextScheduledCall = findNextScheduledCall();

  const chartData = [
    { name: "Sun", moodValue: 5 },
    { name: "Mon", moodValue: 2 },
    { name: "Tue", moodValue: 3 },
    { name: "Wed", moodValue: 4 },
    { name: "Thu", moodValue: 5 },
    { name: "Fri", moodValue: 2 },
    { name: "Sat", moodValue: 1 },
  ];

  const moodEmojis = ["😀︎", "😐︎", "😢︎", "😟︎", "😫︎"];

  const moods = [
    { mood: "Happy", icon: <FaceSmileIcon className="w-5 h-5 text-yellow-500" /> },
    { mood: "Neutral", icon: <MinusCircleIcon className="w-5 h-5 text-gray-500" /> },
    { mood: "Sad", icon: <FaceFrownIcon className="w-5 h-5 text-blue-500" /> },
    { mood: "Anxious", icon: <ExclamationCircleIcon className="w-5 h-5 text-orange-500" /> },
    { mood: "Overwhelmed", icon: <BoltIcon className="w-5 h-5 text-red-500" /> },
  ];

  const handleSelfCall = () => {
    if (!user?._id) {
      toast.error("User ID not found! Please login again. ❌");
      return;
    }
    // For an immediate call, you might want to schedule it for "now" or a few seconds in the future
    const now = new Date();
    // Add a small buffer (e.g., 5 seconds) to ensure it's slightly in the future
    now.setSeconds(now.getSeconds() + 5); 

    dispatch(
      scheduleHealthCallRequest({
        scheduledTo: user._id,
        scheduledAt: now.toISOString(), // Use current time + buffer
      })
    );
  };

  return (
    <div className="bg-white min-h-screen sm:px-8 lg:px-12 space-y-6 pb-12 overflow-x-hidden">
      {/* Welcome Section */}
      <div className="space-y-2 sm:space-y-3 mb-4 ">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-700">
          Welcome back, <span className="text-[#3fbf81]">{user?.name || "User"}!</span>
        </h1>
        <p className="text-gray-700 text-base sm:text-lg flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-wrap sm:mt-3 mb-2 ">
          <CalendarDaysIcon className="w-5 h-5 text-[#3fbf81]" />
          <span>
            Next Scheduled Call:{" "}
            {callsLoading ? (
              <span className="text-gray-500 font-semibold">Loading...</span>
            ) : nextScheduledCall ? (
              <span className="text-[#3fbf81] ">
                {nextScheduledCall.recipientName === user?.name ? "Your call" : `${nextScheduledCall.recipientName}'s call`} on {nextScheduledCall.date} at {nextScheduledCall.time}
              </span>
            ) : (
              <span className="text-[#3fbf81] ">
                No calls scheduled.
              </span>
            )}
          </span>
        </p>
        {callsError && <p className="text-red-500 text-sm mb-2">Error loading calls: {callsError}</p>}
      </div>

      {/* Buttons Section */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 sm:mt-8 ">
        <button
          onClick={() => navigate('/schedule')}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-[#3fbf81] text-white font-medium rounded-full shadow hover:bg-[#36a973] transition w-full sm:w-auto text-sm whitespace-nowrap"
        >
          <PhoneIcon className="w-4 h-4" />
          Schedule a New Call
        </button>
        <button
          onClick={handleSelfCall}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-[#e6f8f0] text-[#3fbf81] font-medium rounded-full shadow hover:bg-[#d4f3e7] transition w-full sm:w-auto text-sm whitespace-nowrap"
        >
          <BoltIcon className="w-4 h-4" />
          Request an Immediate Call
        </button>
      </div>

      {/* Mood Tracker Section */}
      <div className="space-y-4 mb-4 sm:mt-4">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-600">How are you feeling today?</h2>
        <div className="flex flex-wrap gap-3 justify-start sm:mt-4">
          {moods.map(({ mood, icon }) => (
            <button
              key={mood}
              className="px-3 py-2 rounded-full hover:bg-[#f2faf6] transition flex items-center gap-2 text-sm flex-shrink-0 shadow-xs hover:shadow-sm"
            >
              {icon}
              <span>{mood}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mood Trend Graph */}
      <div className="space-y-4 mb-4 sm:mt-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-600">Mood Trend (Last 7 Days)</h2>
        <div className="w-full sm:w-[70%] h-[280px] xs:h-[320px] sm:h-[350px] lg:h-[450px] relative bg-white rounded-lg p-2 sm:p-5 shadow-sm">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5, right: 10, left: 10, bottom: 5,
              }}
            >
              <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '12px', fill: '#4B5563' }} />
              <YAxis
                domain={[1, 5]}
                tickFormatter={(value) => moodEmojis[value - 1]}
                interval="preserveStartEnd"
                axisLine={false}
                tickLine={false}
                width={40}
                style={{ fontSize: '16px', fill: '#4B5563' }}
              />
              <Tooltip cursor={{ strokeDasharray: '3 3', stroke: '#d1d5db' }} />
              <Line
                type="monotone"
                dataKey="moodValue"
                stroke="#3fbf81"
                strokeWidth={2}
                dot={{ r: 5, fill: '#3fbf81', strokeWidth: 0 }}
                activeDot={{ r: 8, fill: '#3fbf81', stroke: '#3fbf81', strokeWidth: 2 }}
                name="Mood"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}