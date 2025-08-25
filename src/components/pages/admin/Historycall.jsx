

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    deleteScheduledCallRequest,
    fetchScheduledCallsRequest,
    updateScheduledCallsSearchQuery
} from '../../../redux/userSlice';
import { TrashIcon, ArrowLeftIcon, ArrowRightIcon, EyeIcon } from '@heroicons/react/24/outline';

const HistoryCall = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        scheduledCalls,
        totalScheduledCalls,
        page,
        limit,
        loading,
        error,
        scheduledCallsSearchQuery,
    } = useSelector((state) => state.users);

    const [localSearchQuery, setLocalSearchQuery] = useState(scheduledCallsSearchQuery);

    useEffect(() => {
        const initialFilters = {
            page: 1,
            limit: 10,
            recipientName: '',
            recipientNumber: '',
            status: '',
        };
        dispatch(updateScheduledCallsSearchQuery(initialFilters));
        dispatch(fetchScheduledCallsRequest(initialFilters));
    }, [dispatch]);

    useEffect(() => {
        setLocalSearchQuery(scheduledCallsSearchQuery);
    }, [scheduledCallsSearchQuery]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocalSearchQuery((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const newQuery = { ...localSearchQuery, page: 1 };
        dispatch(updateScheduledCallsSearchQuery(newQuery));
        dispatch(fetchScheduledCallsRequest(newQuery));
    };

    const handleClearFilters = () => {
        const clearedValues = {
            page: 1,
            limit: 10,
            recipientName: '',
            recipientNumber: '',
            status: '',
        };
        setLocalSearchQuery(clearedValues);
        dispatch(updateScheduledCallsSearchQuery(clearedValues));
        dispatch(fetchScheduledCallsRequest(clearedValues));
    };

    const totalPages = Math.ceil(totalScheduledCalls / limit);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            const newQuery = { ...scheduledCallsSearchQuery, page: newPage };
            dispatch(fetchScheduledCallsRequest(newQuery));
        }
    };
    
  const handleViewDetails = (call) => {
  navigate(`/admin-dashboard/history-call/${call._id}`, { state: { callData: call } });
};

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this call record?")) {
            dispatch(deleteScheduledCallRequest(id));
        }
    };

    const callsToRender = scheduledCalls ?? [];

    return (
        <div className="flex flex-col sm:px-10 lg:px-12 pb-12 min-h-screen bg-white space-y-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">All Calls</h1>
                <p className="text-gray-500">Search and manage all scheduled calls.</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input type="text" name="recipientName" placeholder="Search by Recipient Name" value={localSearchQuery.recipientName || ''} onChange={handleInputChange} className="w-full h-10 px-4 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#3FBF81]" />
                    <input type="text" name="recipientNumber" placeholder="Search by Recipient Number" value={localSearchQuery.recipientNumber || ''} onChange={handleInputChange} className="w-full h-10 px-4 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#3FBF81]" />
                    <select name="status" value={localSearchQuery.status || ''} onChange={handleInputChange} className="w-full h-10 px-4 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#3FBF81] appearance-none bg-white">
                        <option value="">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                    <button type="button" onClick={handleClearFilters} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Clear</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#3FBF81] rounded-lg hover:bg-[#36a973]">Search</button>
                </div>
            </form>

            <div className="w-full">
                {loading && callsToRender.length === 0 ? ( <p className="text-gray-500 text-center py-8">Loading call history...</p> ) : 
                 error ? ( <p className="text-red-500 text-center py-8">Error: {error}</p> ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100 text-left text-gray-700">
                                <tr>
                                    <th className="py-2 px-3 font-medium text-sm sm:text-base">Recipient</th>
                                    <th className="hidden sm:table-cell py-2 px-3 font-medium text-sm sm:text-base">Phone Number</th>
                                    <th className="py-2 px-3 font-medium text-sm sm:text-base">Date</th>
                                    <th className="hidden sm:table-cell py-2 px-3 font-medium text-sm sm:text-base">Scheduled By</th>
                                    <th className="hidden sm:table-cell py-2 px-3 font-medium text-sm sm:text-base">Status</th>
                                    {/* ✅ CHANGE: Badi screen ke liye alag "Details" column */}
                                    <th className="hidden md:table-cell py-2 px-3 font-medium text-sm sm:text-base text-center">Details</th>
                                    <th className="py-2 px-3 font-medium text-sm sm:text-base text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {callsToRender.length > 0 ? (
                                    callsToRender.map((call) => (
                                        <tr key={call._id} className="border-b border-gray-200 last:border-none hover:bg-gray-50 transition">
                                            <td className="py-2 px-3 font-medium text-sm sm:text-base text-gray-800">{call.recipientName}</td>
                                            <td className="hidden sm:table-cell py-2 px-3 text-sm">{call.recipientNumber}</td>
                                            <td className="py-2 px-3 text-sm">{new Date(call.scheduledAt).toLocaleDateString()}</td>
                                            <td className="hidden sm:table-cell py-2 px-3 text-sm">{call.scheduledBy?.name || 'N/A'}</td>
                                            <td className="hidden sm:table-cell py-2 px-3 text-sm">
                                                <span className={`px-3 py-1 text-xs rounded-full capitalize ${
                                                    call.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    call.status === 'failed' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {call.status}
                                                </span>
                                            </td>
                                            {/* ✅ CHANGE: Badi screen par "Details" button alag cell mein */}
                                            <td className="hidden md:table-cell py-2 px-3 text-center">
                                                <button onClick={() => handleViewDetails(call)} className="text-[#3fbf81] hover:underline inline-block">
                                                    View Details
                                                </button>
                                            </td>
                                            <td className="py-2 px-3 text-center">
                                                {/* ✅ CHANGE: Chhoti screen par dono button yahan dikhenge */}
                                                <div className="flex items-center justify-center md:hidden">
                                                    <button onClick={() => handleViewDetails(call)} className="text-[#3fbf81] hover:underline mr-4">
                                                        View
                                                    </button>
                                                    <button onClick={() => handleDelete(call._id)} className="text-red-500 hover:text-red-700">
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                {/* ✅ CHANGE: Badi screen par sirf delete button yahan dikhega */}
                                                <div className="hidden md:inline-block">
                                                    <button onClick={() => handleDelete(call._id)} className="text-red-500 hover:text-red-700">
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-6 text-gray-500 italic">No call history found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {!loading && totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 space-x-4">
                    <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
                        <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
                    </button>
                    <span className="text-gray-700 font-medium">Page {page} of {totalPages}</span>
                    <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
                        <ArrowRightIcon className="w-5 h-5 text-gray-700" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default HistoryCall;