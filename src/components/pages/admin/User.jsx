import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersRequest, deleteUserRequest } from "../../../redux/userSlice";
import { 
  MagnifyingGlassIcon,
  TrashIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon 
} from "@heroicons/react/24/outline";

const User = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchType, setSearchType] = useState("name");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    list: users = [],
    loading,
    error,
    totalPages,
  } = useSelector((state) => state.users);

  // Debouncing for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetching users data
  useEffect(() => {
    dispatch(
      fetchUsersRequest({
        page,
        limit: 10,
        filters: {
          search: debouncedSearch,
          searchType: searchType,
        },
      })
    );
  }, [dispatch, page, debouncedSearch, searchType]);

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUserRequest(userId));
    }
  };

  const handleViewClick = (id) => {
    navigate(`/admin-dashboard/user/${id}`);
  };

  return (
    <div className="flex flex-col sm:px-10 lg:px-12 pb-12 min-h-screen bg-white space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Users Management
        </h1>
        <p className="text-gray-500">View, search, and manage application users.</p>
      </div>

      <div className="max-w-3xl w-full space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="px-4 py-2 rounded-md bg-white border border-gray-300 outline-none focus:ring-2 focus:ring-[#3fbf81] transition"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="phoneNumber">Phone Number</option>
          </select>

          <div className="relative flex-grow">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search by ${searchType}...`}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-white border border-gray-300 outline-none focus:ring-2 focus:ring-[#3fbf81] transition"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="w-full">
        {loading && users.length === 0 ? (
          <p className="text-gray-500 text-center">Loading users...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Error: {error}</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-left text-gray-700">
                <tr>
                  <th className="py-2 px-3 font-medium text-sm sm:text-base">User</th>
                  <th className="hidden sm:table-cell py-2 px-3 font-medium text-sm sm:text-base">Email</th>
                  <th className="hidden sm:table-cell py-2 px-3 font-medium text-sm sm:text-base">Contact No</th>
                  <th className="hidden sm:table-cell py-2 px-3 font-medium text-sm sm:text-base text-center">Status</th>
                  {/* highlight-start */}
                  {/* Badi screen ke liye alag alag headers */}
                  <th className="hidden sm:table-cell py-2 px-3 font-medium text-sm sm:text-base text-center">Details</th>
                  <th className="hidden sm:table-cell py-2 px-3 font-medium text-sm sm:text-base text-center">Delete</th>
                  {/* Chhoti screen ke liye ek header */}
                  <th className="sm:hidden py-2 px-3 font-medium text-sm text-center">Actions</th>
                  {/* highlight-end */}
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="border-b border-gray-200 last:border-none hover:bg-gray-50 transition">
                      <td className="py-2 px-3">
                        <div className="font-medium text-sm sm:text-base text-gray-800">{user.name}</div>
                        {/* <div className="text-xs sm:text-sm text-gray-500">{user.email}</div> */}
                      </td>
                      <td className="hidden sm:table-cell py-2 px-3 text-sm sm:text-base">{user.email}</td>
                      <td className="hidden sm:table-cell py-2 px-3 text-sm sm:text-base">{user.phoneNumber}</td>
                      <td className="hidden sm:table-cell py-2 px-3 text-sm sm:text-base text-center">
                        <span className={`px-3 py-1 text-xs rounded-full ${user.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {user.isVerified ? "Active" : "Pending"}
                        </span>
                      </td>

                      {/* highlight-start */}
                      {/* Desktop: Details button alag cell me */}
                      <td className="hidden sm:table-cell py-2 px-3 text-center">
                        <button
                          onClick={() => handleViewClick(user._id)}
                          className="text-[#3fbf81] font-medium cursor-pointer hover:underline text-sm"
                        >
                          View Details
                        </button>
                      </td>
                      
                      {/* Desktop: Delete button alag cell me */}
                      <td className="hidden sm:table-cell py-2 px-3 text-center">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete User"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                      
                      {/* Mobile: Dono buttons ek hi cell me */}
                      <td className="sm:hidden py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={() => handleViewClick(user._id)}
                            className="text-[#3fbf81] font-medium cursor-pointer hover:underline text-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete User"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                      {/* highlight-end */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500 italic">
                      No users found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors"
            title="Previous Page"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
          </button>
          <span className="text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors"
            title="Next Page"
          >
            <ArrowRightIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}
    </div>
  );
};

export default User;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// // highlight-start
// // useSelector ko import kiya
// import { useDispatch, useSelector } from "react-redux";
// // highlight-end
// import { fetchUsersRequest, deleteUserRequest } from "../../../redux/userSlice";
// import { 
//   MagnifyingGlassIcon,
//   TrashIcon, 
//   ArrowLeftIcon, 
//   ArrowRightIcon 
// } from "@heroicons/react/24/outline";

// const User = () => {
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [searchType, setSearchType] = useState("name");

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Redux store se user list fetch ki
//   const {
//     list: users = [],
//     loading,
//     error,
//     totalPages,
//   } = useSelector((state) => state.users);

//   // highlight-start
//   // Logged-in user ki details fetch ki
//   const { user: loggedInUser } = useSelector((state) => state.auth);
//   // highlight-end

//   // Debouncing for search
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(search);
//     }, 500);
//     return () => clearTimeout(handler);
//   }, [search]);

//   // Fetching users data
//   useEffect(() => {
//     dispatch(
//       fetchUsersRequest({
//         page,
//         limit: 10,
//         filters: {
//           search: debouncedSearch,
//           searchType: searchType,
//         },
//       })
//     );
//   }, [dispatch, page, debouncedSearch, searchType]);

//   const handleDelete = (userId) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       dispatch(deleteUserRequest(userId));
//     }
//   };

//   const handleViewClick = (id) => {
//     navigate(`/admin-dashboard/user/${id}`);
//   };

//   // highlight-start
//   // User list se logged-in admin ko filter karke hata diya
//   const usersToDisplay = users.filter(user => user._id !== loggedInUser?._id);
//   // highlight-end

//   return (
//     <div className="flex flex-col sm:px-10 lg:px-12 pb-12 min-h-screen bg-white space-y-10">
//       <div>
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
//           Users Management
//         </h1>
//         <p className="text-gray-500">View, search, and manage application users.</p>
//       </div>

//       <div className="max-w-3xl w-full space-y-4">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <select
//             value={searchType}
//             onChange={(e) => setSearchType(e.target.value)}
//             className="px-4 py-2 rounded-md bg-white border border-gray-300 outline-none focus:ring-2 focus:ring-[#3fbf81] transition"
//           >
//             <option value="name">Name</option>
//             <option value="email">Email</option>
//             <option value="phoneNumber">Phone Number</option>
//           </select>

//           <div className="relative flex-grow">
//             <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder={`Search by ${searchType}...`}
//               className="w-full pl-10 pr-4 py-2 rounded-md bg-white border border-gray-300 outline-none focus:ring-2 focus:ring-[#3fbf81] transition"
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setPage(1);
//               }}
//             />
//           </div>
//         </div>
//       </div>
      
//       <div className="w-full">
//         {loading && users.length === 0 ? (
//           <p className="text-gray-500 text-center">Loading users...</p>
//         ) : error ? (
//           <p className="text-red-500 text-center">Error: {error}</p>
//         ) : (
//           <div className="overflow-x-auto rounded-lg border border-gray-200">
//             <table className="w-full border-collapse">
//               <thead className="bg-gray-100 text-left text-gray-700">
//                 <tr>
//                   <th className="py-2 px-3 font-medium text-sm sm:text-base">User</th>
//                   <th className="hidden sm:table-cell py-2 px-3 font-medium text-sm sm:text-base">Email</th>
//                   <th className="hidden sm:table-cell py-2 px-3 font-medium text-sm sm:text-base">Contact No</th>
//                   <th className="hidden sm:table-cell py-2 px-3 font-medium text-sm sm:text-base text-center">Status</th>
//                   <th className="hidden sm:table-cell py-2 px-3 font-medium text-sm sm:text-base text-center">Details</th>
//                   <th className="hidden sm:table-cell py-2 px-3 font-medium text-sm sm:text-base text-center">Delete</th>
//                   <th className="sm:hidden py-2 px-3 font-medium text-sm text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {/* highlight-start */}
//                 {/* Ab filtered list (usersToDisplay) ka use kiya ja raha hai */}
//                 {usersToDisplay.length > 0 ? (
//                   usersToDisplay.map((user) => (
//                 // highlight-end
//                     <tr key={user._id} className="border-b border-gray-200 last:border-none hover:bg-gray-50 transition">
//                       <td className="py-2 px-3">
//                         <div className="font-medium text-sm sm:text-base text-gray-800">{user.name}</div>
//                       </td>
//                       <td className="hidden sm:table-cell py-2 px-3 text-sm sm:text-base">{user.email}</td>
//                       <td className="hidden sm:table-cell py-2 px-3 text-sm sm:text-base">{user.phoneNumber}</td>
//                       <td className="hidden sm:table-cell py-2 px-3 text-sm sm:text-base text-center">
//                         <span className={`px-3 py-1 text-xs rounded-full ${user.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
//                           {user.isVerified ? "Active" : "Pending"}
//                         </span>
//                       </td>
//                       <td className="hidden sm:table-cell py-2 px-3 text-center">
//                         <button
//                           onClick={() => handleViewClick(user._id)}
//                           className="text-[#3fbf81] font-medium cursor-pointer hover:underline text-sm"
//                         >
//                           View Details
//                         </button>
//                       </td>
//                       <td className="hidden sm:table-cell py-2 px-3 text-center">
//                         <button
//                           onClick={() => handleDelete(user._id)}
//                           className="text-red-500 hover:text-red-700"
//                           title="Delete User"
//                         >
//                           <TrashIcon className="w-5 h-5" />
//                         </button>
//                       </td>
//                       <td className="sm:hidden py-2 px-3 text-center">
//                         <div className="flex items-center justify-center gap-4">
//                           <button
//                             onClick={() => handleViewClick(user._id)}
//                             className="text-[#3fbf81] font-medium cursor-pointer hover:underline text-sm"
//                           >
//                             View
//                           </button>
//                           <button
//                             onClick={() => handleDelete(user._id)}
//                             className="text-red-500 hover:text-red-700"
//                             title="Delete User"
//                           >
//                             <TrashIcon className="w-5 h-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="7" className="text-center py-6 text-gray-500 italic">
//                       No other users found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {!loading && totalPages > 1 && (
//         <div className="flex justify-center items-center mt-6 space-x-4">
//           <button
//             onClick={() => setPage(page - 1)}
//             disabled={page === 1}
//             className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors"
//             title="Previous Page"
//           >
//             <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
//           </button>
//           <span className="text-gray-700 font-medium">
//             Page {page} of {totalPages}
//           </span>
//           <button
//             onClick={() => setPage(page + 1)}
//             disabled={page === totalPages}
//             className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors"
//             title="Next Page"
//           >
//             <ArrowRightIcon className="w-5 h-5 text-gray-700" />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default User;