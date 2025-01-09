import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { FaUserEdit } from "react-icons/fa";
import ChangeUserRole from "../components/ChangeUserRole";
// import ChangeUserRole from "../components/ChangeUserRole";

const AllUsers = () => {
  const [allUser, setAllUsers] = useState([]);
  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState({
    email: "",
    name: "",
    role: "",
    _id: "",
  });
  const month = ["Jan", "Feb", "Mar", "Apr", "May","Jun", "Jul", "Aug", "Sep","Oct", "Nov", "Dec"];
  const fetchAllUsers = async () => {
    const fetchData = await fetch(SummaryApi.allUser.url, {
      method: SummaryApi.allUser.method,
      credentials: "include",
    });
  

    const dataResponse = await fetchData.json();
     console.log(dataResponse);
    if (dataResponse.success) {
      setAllUsers(dataResponse.data);
    } 

    if (dataResponse.error) {
      toast.error(dataResponse.message);
    }
  };
  useEffect(() => {
    fetchAllUsers();
  }, []);
  return (
    <div className="bg-white pb-4">
      <table className="w-full userTable">
        <thead>
          <tr className="bg-red-700 text-white">
            <th>Sr.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created Date</th>
            <th className="w-20">Action</th>
          </tr>
        </thead>
        <tbody className="">
          {allUser.map((el, index) => {
            return (
              <tr>
                <td>{index + 1}</td>
                <td>{el?.name}</td>
                <td>{el?.email}</td>
                <td className={`${el?.role === "ADMIN" ? "text-red-600" : ""}`}>{el?.role}</td>
                {/* <td>{moment(el?.createdAt).format("ll")}</td> */}
                <td>{`${el?.createdAt.substring(8, 10)}-${
                  month[parseInt(el?.createdAt.substring(5, 7)) - 1]
                }-${el?.createdAt.substring(0, 4)}`}</td>
                <td>
                  <button
                    className="bg-green-100 p-2 my-1 rounded-full cursor-pointer hover:bg-green-500 hover:text-white"
                    onClick={() => {
                        setUpdateUserDetails(el);
                        setOpenUpdateRole(true);
                    }}
                  >
                    <FaUserEdit />
                  </button>
                </td>
              </tr>
            );
          })}
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
