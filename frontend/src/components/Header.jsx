import React, { useContext, useEffect, useState } from "react";
import logo from "../assest/logo.png";
import { FaCircleUser, FaMicrophoneSlash } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BsCart } from "react-icons/bs";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { AppContext } from "../context";
import { setUserDetails } from "../store/userSlice";
import ROLE from "../common/role";
import { CiMicrophoneOn } from "react-icons/ci";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartProductCount } = useContext(AppContext);
  const user = useSelector((state) => state?.user?.user);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.getAll("q");
  const [search, setSearch] = useState(searchQuery);

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

  const handleVoiceSearch = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      setSearch("");
      SpeechRecognition.startListening({ continuous: false });
    }
  };

  useEffect(() => {
    if (listening) {
      setSearch(transcript);
      navigate(`/search?q=${transcript}`);
    }
  }, [transcript]);

  return (
    <header className="h-16 shadow-md bg-[#FFFFFF] z-50 fixed top-0 w-full">
      <div className="h-full container mx-auto flex justify-between items-center px-4 md:px-8">

        {/* Logo */}
        <div className="h-14 w-32 flex items-center">
          <Link to={"/"}>
            <img src={logo} alt="Logo" className="h-full object-contain" />
          </Link>
        </div>

        {/* Search Box */}
        <div className="hidden lg:flex w-full items-center justify-between max-w-md border rounded-lg focus-within:shadow bg-[#F5F5F6] h-10">
          <div className="text-lg min-w-[50px] h-10 flex items-center justify-center">
            <FaSearch className="cursor-pointer text-[#FF527B]" />
          </div>
          <input
            type="text"
            placeholder="Search for products, brands and more"
            className="w-full outline-none h-10 bg-[#F5F5F6] text-sm text-[#47494e] placeholder:text-[#66696e]"
            onChange={handleSearch}
            value={listening ? transcript : search}
          />
          <div
            onClick={handleVoiceSearch}
            className="text-lg min-w-[40px] h-10 flex items-center justify-center cursor-pointer"
          >
            {!listening ? (
              <FaMicrophoneSlash className="text-[#FF527B] text-2xl" />
            ) : (
              <CiMicrophoneOn className="text-[#FF527B] text-2xl" />
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6">

          {/* Admin Panel Link (if admin) */}
          {user?.role === ROLE.ADMIN && (
            <Link
              to="/admin-panel/all-users"
              className="hidden md:block font-medium text-[#FF527B] hover:underline"
            >
              Admin Panel
            </Link>
          )}

          {/* User Icon → Go to Account Page */}
          {user?._id && (
            <Link to="/account-page" className="text-3xl cursor-pointer">
              <FaCircleUser className="text-[#FF527B]" />
            </Link>
          )}

          {/* Cart */}
          <Link to={"/cart"} className="text-3xl relative">
            <BsCart className="text-[#FF527B]" />
            <div className="bg-stone-50 w-4 h-4 rounded-full border border-[#FF527B] flex items-center justify-center absolute -top-1 -right-2">
              <p className="text-xs text-[#FF527B]">
                {cartProductCount ? cartProductCount : 0}
              </p>
            </div>
          </Link>

          {/* Auth Button */}
          {!user?._id ? (
            <Link
              to={"/login"}
              className="px-4 py-1 rounded-full bg-[#FF527B] text-white hover:bg-[#f64a72]"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-1 rounded-full bg-[#FF527B] text-white hover:bg-[#f64a72]"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
