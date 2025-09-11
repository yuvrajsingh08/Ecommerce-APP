import React, { useState } from "react";
import ROLE from "../common/role";
import { IoMdClose } from "react-icons/io";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const ChangeUserRole = ({ name, email, role, userId, onClose, callFunc }) => {
  const [userRole, setUserRole] = useState(role);

  const handleOnChangeSelect = (e) => {
    setUserRole(e.target.value);

    console.log(e.target.value);
  };

  const updateUserRole = async () => {
    const fetchResponse = await fetch(SummaryApi.updateUser.url, {
      method: SummaryApi.updateUser.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        role: userRole,
      }),
    });

    const responseData = await fetchResponse.json();

    if (responseData.success) {
      toast.success(responseData.message);
      onClose();
      callFunc();
    }

    // console.log("role updated", responseData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* Modal container with animation */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#FF527B] px-4 py-3">
          <h1 className="text-lg font-semibold text-white">Change User Role</h1>
          <button
            className="text-white text-2xl hover:text-pink-100 transition"
            onClick={onClose}>
            <IoMdClose />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p>
            <span className="font-medium">Name:</span> {name}
          </p>
          <p>
            <span className="font-medium">Email:</span> {email}
          </p>

          {/* Role selector */}
          <div className="flex flex-col gap-2">
            <label htmlFor="role" className="font-medium">
              Role:
            </label>
            <select
              id="role"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF527B]"
              value={userRole}
              onChange={handleOnChangeSelect}>
              {Object.values(ROLE).map((el) => (
                <option value={el} key={el}>
                  {el}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 pb-4">
          <button
            className="px-5 py-2 rounded-md bg-[#FF527B] text-white font-medium hover:bg-pink-600 transition"
            onClick={updateUserRole}>
            Change Role
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeUserRole;
