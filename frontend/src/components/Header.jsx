import React, { useContext, useState } from "react";
import logo from "../assest/logo.png"
import { FaCircleUser, FaRegCircleUser } from "react-icons/fa6";
import { FaSearch} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BsCart } from "react-icons/bs";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import {AppContext} from "../context"
import { setUserDetails } from "../store/userSlice";
import ROLE from "../common/role";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartProductCount } = useContext(AppContext);
  const [menuDisplay, setMenuDisplay] = useState(false);
  const user = useSelector((state) => state?.user?.user);

  const searchInput = useLocation();
  // console.log(searchInput);
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.getAll("q");
  const [search, setSearch] = useState(searchQuery);
  // console.log(user);
  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include",
    });
    
    const data = await fetchData.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      navigate("/");
    }

    if (data.error) {
      toast.error(data.message);
    }
  };
  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);

    if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/search");
    }
  };
  return (
    <header className="h-16 shadow-md bg-[#FFFFFF]  z-50 fixed top-0 w-full">
      <div className="h-full container mx-auto flex justify-between items-center pr-8">
        <div className="h-40 w-40 overflow-hidden">
          <Link to={"/"}>
            <img src={logo} alt="" srcset="" />
          </Link>
        </div>

        <div className="hidden lg:flex w-full items-center justify-between max-w-md border rounded-lg focus-within:shadow bg-[#F5F5F6] h-10">
          <div className="text-lg min-w-[50px] h-10 bg-[#F5F5F6] flex items-center justify-center rounded-r-full text-white font-bold">
            <FaSearch className="cursor-pointer text-[#FF527B]" />
          </div>
          <input
            type="text"
            placeholder=" Search for products, brands and more "
            className="w-full outline-none h-10 bg-[#F5F5F6] text-sm text-[#47494e] placeholder:text-[#66696e]"
            onChange={handleSearch}
            value={search}
          />
        </div>

        <div className="flex items-center gap-7 ">
          <div className={`relative flex justify-center `}>
            {user?._id && (
              <div
                className="text-3xl cursor-pointer"
                onClick={() => setMenuDisplay((preve) => !preve)}
              >
                <FaCircleUser className="text-[#FF527B]" />
              </div>
            )}

            {menuDisplay && (
              <div className="absolute  z-20 bottom-0 top-9 bg-white outline outline-1 outline-[#FF527B] h-fit p-1 py-0 shadow-lg rounded-lg ">
                <nav>
                  {user?.role === ROLE.ADMIN && (
                    <Link
                      to={"/admin-panel/all-users"}
                      className="whitespace-nowrap hidden md:block  p-2"
                      onClick={() => setMenuDisplay((preve) => !preve)}
                    >
                      Admin Panel
                    </Link>
                  )}
                </nav>
              </div>
            )}
          </div>

          <Link to={"/cart"} className="text-3xl cursor-pointer relative pb-1">
            <span>
              <BsCart className="text-[#FF527B]" />
              <div className="bg-stone-50 w-4 h-4 rounded-full outline outline-1 outline-[#FF527B] p-1 flex items-center justify-center absolute -top-1 -right-2 ">
                <p className="text-xs text-[#FF527B]">
                  {cartProductCount ? cartProductCount : 0}
                </p>
              </div>
            </span>
          </Link>

          <div>
            {user?._id ? (
              <button
                onClick={handleLogout}
                className="px-4 py-1 pb-2 rounded-full bg-[#FF527B] text-white hover:bg-[#f64a72]"
              >
                Logout
              </button>
            ) : (
              <Link
                to={"/login"}
                className="px-4 py-1 pb-2 rounded-full bg-[#FF527B] text-white hover:bg-[#f64a72]"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
