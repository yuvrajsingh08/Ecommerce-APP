"use client";

import React, { useState } from "react";
import { FaEdit, FaSave, FaTimes, FaTrash, FaPlus } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import SummaryApi from "../common";
import { setUserDetails } from "../store/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AccountPage() {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    type: "home",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
  });
  const [addingAddress, setAddingAddress] = useState(false);

  // Update user name using backend
  const handleUpdateName = async () => {
    try {
      const res = await fetch(SummaryApi.updateUser.url, {
        method: SummaryApi.updateUser.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          name: editName,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        dispatch(setUserDetails(data.data));
        setEditMode(false);
        toast.success("Name updated successfully!", {
          autoClose: 1000,
          draggable: true,
        });
      } else {
        toast.error("Failed to update name: " + data.message, {
          duration: 1000,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!", { duration: 1000 });
    }
  };

  // Add new address using backend
  const handleAddAddress = async () => {
    try {
      const res = await fetch(`/api/users/${user._id}/address`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setAddresses([...addresses, data.data]);
        setNewAddress({
          type: "home",
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "India",
          phone: "",
        });
        setAddingAddress(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add address");
    }
  };

  // Delete address using backend
  const handleDeleteAddress = async (id) => {
    try {
      await fetch(`/api/users/address/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setAddresses(addresses.filter((addr) => addr._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete address");
    }
  };

  // Update existing address using backend
  const handleUpdateAddress = async (id) => {
    try {
      const res = await fetch(`/api/users/address/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingAddress),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setAddresses(addresses.map((a) => (a._id === id ? data.data : a)));
        setEditingAddress(null);
      } else {
        alert("Failed to update address");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update address");
    }
  };

  return (
    <section id="account">
      <div className="flex min-h-[calc(100vh-4rem)] w-full">
        {/* Left panel */}
        <div className="hidden lg:flex items-center justify-center bg-[#f64a72] w-1/3 px-10">
          <div className="max-w-md text-center space-y-6 text-white">
            <h1 className="text-4xl font-extrabold tracking-tight">
              My Account
            </h1>
            <p className="text-lg">
              Manage your profile and addresses in one place. Stay updated with
              your latest info.
            </p>
          </div>
        </div>

        {/* Right content */}
        <div className="flex flex-1 items-start justify-center bg-background px-4 py-12 sm:px-6 lg:px-12">
          <div className="mx-auto w-full max-w-3xl space-y-10">
            {/* Profile */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                Profile Details
                {!editMode && (
                  <FaEdit
                    className="cursor-pointer text-[#f64a72]"
                    onClick={() => setEditMode(true)}
                  />
                )}
                {/* Admin badge */}
                {user?.role === "admin" && (
                  <span className="ml-2 px-2 py-1 text-xs bg-yellow-400 text-black rounded">
                    ADMIN
                  </span>
                )}
              </h2>

              {!editMode ? (
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Name:</strong> {user?.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user?.email}
                  </p>
                  {/* Only show role to admin themselves */}
                  {user?.role === "ADMIN" && (
                    <p>
                      <strong>Role:</strong> {user?.role}
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid gap-4">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="p-2 border rounded-md w-full"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateName}
                      className="flex items-center gap-2 bg-[#f64a72] hover:bg-[#e64369] text-white px-4 py-2 rounded-md font-bold">
                      <FaSave /> Save
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="flex items-center gap-2 bg-gray-300 px-4 py-2 rounded-md">
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Addresses */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Manage Addresses</h2>

              {/* List addresses */}
              <div className="space-y-4">
                {addresses.length === 0 && (
                  <p className="text-gray-500">No addresses added yet.</p>
                )}
                {addresses.map((addr) =>
                  editingAddress && editingAddress._id === addr._id ? (
                    <div
                      key={addr._id}
                      className="border p-4 rounded-md shadow-sm space-y-2">
                      <input
                        type="text"
                        value={editingAddress.street}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            street: e.target.value,
                          })
                        }
                        className="p-2 border rounded-md w-full"
                      />
                      <input
                        type="text"
                        value={editingAddress.city}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            city: e.target.value,
                          })
                        }
                        className="p-2 border rounded-md w-full"
                      />
                      <input
                        type="text"
                        value={editingAddress.state}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            state: e.target.value,
                          })
                        }
                        className="p-2 border rounded-md w-full"
                      />
                      <input
                        type="text"
                        value={editingAddress.postalCode}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            postalCode: e.target.value,
                          })
                        }
                        className="p-2 border rounded-md w-full"
                      />
                      <input
                        type="text"
                        value={editingAddress.phone}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            phone: e.target.value,
                          })
                        }
                        className="p-2 border rounded-md w-full"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleUpdateAddress(editingAddress._id)
                          }
                          className="flex items-center gap-2 bg-[#f64a72] hover:bg-[#e64369] text-white px-4 py-2 rounded-md font-bold">
                          <FaSave /> Save
                        </button>
                        <button
                          onClick={() => setEditingAddress(null)}
                          className="flex items-center gap-2 bg-gray-300 px-4 py-2 rounded-md">
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={addr._id}
                      className="border p-4 rounded-md shadow-sm flex justify-between items-center">
                      <div>
                        <p className="font-semibold">
                          {addr.type.toUpperCase()}
                        </p>
                        <p>
                          {addr.street}, {addr.city}, {addr.state},{" "}
                          {addr.postalCode}
                        </p>
                        <p>
                          {addr.country} - {addr.phone}
                        </p>
                      </div>
                      <div className="flex gap-3 text-xl">
                        <FaEdit
                          className="cursor-pointer text-blue-500"
                          onClick={() => setEditingAddress(addr)}
                        />
                        <FaTrash
                          className="cursor-pointer text-red-500"
                          onClick={() => handleDeleteAddress(addr._id)}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Add new address toggle */}
              {!addingAddress ? (
                <button
                  onClick={() => setAddingAddress(true)}
                  className="flex items-center gap-2 bg-[#f64a72] hover:bg-[#e64369] text-white px-6 py-2 rounded-md font-bold">
                  <FaPlus /> Add Address
                </button>
              ) : (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold">Add New Address</h3>
                  <div className="grid gap-2">
                    <input
                      type="text"
                      placeholder="Street"
                      value={newAddress.street}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, street: e.target.value })
                      }
                      className="p-2 border rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                      className="p-2 border rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                      className="p-2 border rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Postal Code"
                      value={newAddress.postalCode}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          postalCode: e.target.value,
                        })
                      }
                      className="p-2 border rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Phone"
                      value={newAddress.phone}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, phone: e.target.value })
                      }
                      className="p-2 border rounded-md"
                    />
                    <select
                      value={newAddress.type}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, type: e.target.value })
                      }
                      className="p-2 border rounded-md">
                      <option value="home">Home</option>
                      <option value="office">Office</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddAddress}
                        className="bg-[#f64a72] hover:bg-[#e64369] text-white px-6 py-2 rounded-md font-bold">
                        Save Address
                      </button>
                      <button
                        onClick={() => setAddingAddress(false)}
                        className="bg-gray-300 px-6 py-2 rounded-md">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
             {/* Orders Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">My Orders</h2>
              <button
                onClick={() => navigate("/order")}
                className="bg-[#f64a72] hover:bg-[#e64369] text-white px-6 py-2 rounded-md font-bold"
              >
                View Orders
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
