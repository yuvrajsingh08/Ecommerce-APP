import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ROLE from '../common/role';
import { FaUserAlt } from 'react-icons/fa';

const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user)
    const navigate = useNavigate()


    useEffect(()=>{
        if(user?.role !== ROLE.ADMIN){
            navigate("/")
        }
    },[user])

  return (
    <div className="min-h-[calc(100vh-4rem)] md:flex hidden">
      <aside className="bg-white min-h-full  w-full  max-w-60 customShadow">
        <div className="h-32  flex justify-center items-center flex-col gap-2 mt-8">
          <div className="text-6xl cursor-pointer relative flex justify-center text-red-600">
            <FaUserAlt className='outline p-2 rounded-full' />
          </div>
          <p className="capitalize text-lg font-semibold">{user?.name}</p>
          <p className="text-sm">{user?.role}</p>
        </div>

        {/***navigation */}
        <div>
          <nav className="grid p-4">
            <Link to={"all-users"} className="px-2 py-1 hover:bg-slate-100">
              All Users
            </Link>
            <Link to={"all-products"} className="px-2 py-1 hover:bg-slate-100">
              All product
            </Link>
          </nav>
        </div>
      </aside>

      <main className="w-full h-full p-2">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminPanel