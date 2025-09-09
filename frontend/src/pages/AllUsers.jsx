import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { FaUserEdit } from "react-icons/fa";
import ChangeUserRole from "../components/ChangeUserRole";

const AllUsers = () => {
  const [allUser, setAllUsers] = useState([]);
  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState({});
  const month = ["Jan", "Feb", "Mar", "Apr", "May","Jun", "Jul", "Aug", "Sep","Oct", "Nov", "Dec"];

  const fetchAllUsers = async () => {
    const fetchData = await fetch(SummaryApi.allUser.url, {
      method: SummaryApi.allUser.method,
      credentials: "include",
    });

    const dataResponse = await fetchData.json();
    if (dataResponse.success) {
      setAllUsers(dataResponse.data);
    } else if (dataResponse.error) {
      toast.error(dataResponse.message);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-[#FF527B] text-white text-sm">
            <th className="px-4 py-2">Sr.</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Created Date</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {allUser.map((el, index) => (
            <tr
              key={el._id}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2 font-medium">{el?.name}</td>
              <td className="px-4 py-2">{el?.email}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    el?.role === "ADMIN"
                      ? "bg-red-100 text-pink-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {el?.role}
                </span>
              </td>
              <td className="px-4 py-2">
                {`${el?.createdAt.substring(8, 10)}-${
                  month[parseInt(el?.createdAt.substring(5, 7)) - 1]
                }-${el?.createdAt.substring(0, 4)}`}
              </td>
              <td className="px-4 py-2">
                <button
                  className="bg-green-100 p-2 rounded-full hover:bg-green-500 hover:text-white transition"
                  onClick={() => {
                    setUpdateUserDetails(el);
                    setOpenUpdateRole(true);
                  }}
                  title="Edit Role"
                >
                  <FaUserEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openUpdateRole && (
        <ChangeUserRole
          onClose={() => setOpenUpdateRole(false)}
          name={updateUserDetails.name}
          email={updateUserDetails.email}
          role={updateUserDetails.role}
          userId={updateUserDetails._id}
          callFunc={fetchAllUsers}
        />
      )}
    </div>
  );
};

export default AllUsers;
