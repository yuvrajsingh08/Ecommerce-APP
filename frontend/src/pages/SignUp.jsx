import React, { useState } from 'react'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const SignUp = () => {
  const [showPassword,setShowPassword] = useState(false)
  const [showConfirmPassword,setShowConfirmPassword] = useState(false)
  const [data,setData] = useState({
      email : "",
      password : "",
      name : "",
      confirmPassword : "",
  })
  const navigate = useNavigate()

  const handleOnChange = (e) =>{
      const { name , value } = e.target
      setData((preve)=>{
          return{
              ...preve,
              [name] : value
          }
      })
  }


  const handleSubmit = async(e) =>{
      e.preventDefault()

      if(data.password === data.confirmPassword){

          const dataResponse = await fetch(SummaryApi.signUP.url,{
              method : SummaryApi.signUP.method,
              headers : {
                  "content-type" : "application/json"
              },
              body : JSON.stringify(data)
            })
      
            const dataApi = await dataResponse.json()

            if(dataApi.success){
              toast.success(dataApi.message)
              navigate("/login")
            }

            if(dataApi.error){
              toast.error(dataApi.message)
            }
    
      }else{
        toast.error("Please check password and confirm password")
      }

  }

  return (
    <section id="signup">
      <div className="flex h-[calc(100vh-4rem)] w-full">
        <div className="hidden lg:flex items-center justify-center bg-[#f64a72] w-1/2 px-12 ">
          <div className="max-w-md space-y-6 text-center text-primary-foreground">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-100">
              Welcome to ECommerce Shopping
            </h1>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Sign up to your account
              </h1>
              <p className="mt-2">
                Already have an account ?
                <Link
                  className="font-medium ml-2 text-primary hover:underline hover:text-[#f64a72]"
                  to="/login"
                >
                  Login
                </Link>
              </p>
            </div>
            <form className="pt-6 flex flex-col gap-2" onSubmit={handleSubmit}>
              <div className="grid">
                <label>Name : </label>
                <div className="bg-white p-2 rounded-md">
                  <input
                    type="text"
                    placeholder="enter your full name"
                    name="name"
                    value={data.name}
                    onChange={handleOnChange}
                    className="w-full h-full outline-none bg-transparent"
                  />
                </div>
              </div>

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
              </div>

              <div>
                <label>Confirm Password : </label>
                <div className="bg-white p-2 flex rounded-md">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="enter password again"
                    value={data.confirmPassword}
                    name="confirmPassword"
                    onChange={handleOnChange}
                    className="w-full h-full outline-none bg-transparent"
                  />
                  <div
                    className="cursor-pointer text-xl"
                    onClick={() => setShowConfirmPassword((preve) => !preve)}
                  >
                    <span>
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
              </div>

              <button className="bg-[#f64a72] hover:bg-[#f74770] text-white px-6 py-2 w-full max-w-[500px] rounded-md hover:scale-105 transition-all mx-auto block mt-6 font-bold tracking-widest">
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignUp