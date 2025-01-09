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
    <div className="fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-between items-center bg-white bg-opacity-60">
      <div className="mx-auto bg-red-600 shadow-2xl w-full max-w-sm rounded-lg overflow-hidden">
        <div className="bg-red-600 ">
          <button
            className="block ml-auto text-xl mr-2 mt-2 text-white"
            onClick={onClose}
          >
            <IoMdClose />
          </button>

          <h1 className="pb-4 text-xl font-medium text-center text-white">
            Change User Role
          </h1>
        </div>

        <div className="bg-white p-4">
          <p>Name : {name}</p>
          <p>Email : {email}</p>

          <div className="flex items-baseline justify-between my-4">
            <div className="flex items-center justify-between ">
              <p>Role :</p>
              <select
                className="border px-2 py-1"
                value={userRole}
                onChange={handleOnChangeSelect}
              >
                {Object.values(ROLE).map((el) => {
                  return (
                    <option value={el} key={el}>
                      {el}
                    </option>
                  );
                })}
              </select>
            </div >
            <button
              className="w-fit  block mt-4 py-1 px-3 rounded-full bg-red-600 text-white hover:bg-red-700"
              onClick={updateUserRole}
            >
              Change Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeUserRole;
