import React, { useContext, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { AppContext } from "../context";


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { fetchUserDetails, fetchUserAddToCart } = useContext(AppContext);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataResponse = await fetch(SummaryApi.signIn.url, {
      method: SummaryApi.signIn.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      toast.success(dataApi.message);
      navigate("/");
      fetchUserDetails();
      fetchUserAddToCart();
    }

    if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };


  return (
    <section id="login">
      <div className="flex h-[calc(100vh-4rem)] w-full">
        <div className="hidden lg:flex items-center justify-center bg-[#f64a72] w-1/2 px-12 ">
          <div className="max-w-md space-y-6 text-center text-primary-foreground">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-100">
              Welcome back to ECommerce Shopping
            </h1>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Sign in to your account
              </h1>
              <p className="mt-2">
                Don't have an account ?
                <Link
                  className="font-medium ml-2 text-primary hover:underline hover:text-[#f64a72]"
                  to="/sign-up"
                >
                  SignUp
                </Link>
              </p>
            </div>
            <form className="pt-6 flex flex-col gap-2" onSubmit={handleSubmit}>
              <div className="grid">
                <label>Email : </label>
                <div className="bg-white p-2 rounded-md">
                  <input
                    type="email"
                    placeholder="enter email"
                    name="email"
                    value={data.email}
                    onChange={handleOnChange}
                    className="w-full h-full outline-none bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label>Password : </label>
                <div className="bg-white p-2 flex rounded-md">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="enter password"
                    value={data.password}
                    name="password"
                    onChange={handleOnChange}
                    className="w-full h-full outline-none bg-transparent"
                  />
                  <div
                    className="cursor-pointer text-xl"
                    onClick={() => setShowPassword((preve) => !preve)}
                  >
                    <span>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                  </div>
                </div>
                <Link
                  to={"/forgot-password"}
                  className="block w-fit ml-auto hover:underline hover:text-[#f64a72]"
                >
                  Forgot password ?
                </Link>
              </div>

              <button className="bg-[#f64a72] hover:bg-[#e64369] text-white px-6 py-2 w-full max-w-[500px] rounded-md hover:scale-105 transition-all mx-auto block mt-6 font-bold tracking-widest">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
