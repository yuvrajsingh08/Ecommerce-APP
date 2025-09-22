import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import ROLE from "../common/role";
import { FaUserAlt, FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const AdminPanel = () => {
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    if (user?.role !== ROLE.ADMIN) {
      navigate("/");
    }
  }, [user]);

  const links = [
    { to: "all-users", label: "All Users" },
    { to: "all-products", label: "All Products" },
    { to: "all-orders", label: "All Orders" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-gray-50 scrollbar-none">
      {/* Mobile header */}
      <div className="md:hidden fixed top-16 left-0 right-0 bg-white shadow flex items-center justify-between px-4 py-2 z-40">
        <h2 className="text-lg font-semibold text-[#FF527B]">Admin Panel</h2>
        <button
          className="p-2 rounded-md bg-[#FF527B]/10 text-[#FF527B] hover:bg-[#FF527B] hover:text-white transition"
          onClick={() => setOpenSidebar(true)}
        >
          <FaBars />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-14 left-0 w-64 shadow-lg z-50 transform transition-transform duration-300 ease-in-out
          ${openSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Mobile header inside sidebar */}
        <div className="h-20 flex items-center justify-between px-4 border-b md:hidden">
          <h2 className="text-lg font-semibold text-[#FF527B]">Menu</h2>
          <button
            onClick={() => setOpenSidebar(false)}
            className="text-2xl text-gray-600 hover:text-[#FF527B]"
          >
            <IoClose />
          </button>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center mt-8 gap-2">
          <div className="text-6xl text-[#FF527B] bg-[#FF527B]/10 p-3 rounded-full">
            <FaUserAlt />
          </div>
          <p className="capitalize text-lg font-semibold">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.role}</p>
        </div>

        {/* Navigation */}
        <nav className="mt-6 grid gap-1 px-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-md transition ${
                location.pathname.includes(link.to)
                  ? "bg-[#FF527B] text-white"
                  : "hover:bg-[#FF527B]/10 hover:text-[#FF527B]"
              }`}
              onClick={() => setOpenSidebar(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 mt-16 md:mt-0 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
