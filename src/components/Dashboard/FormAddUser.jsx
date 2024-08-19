"use client"

import { toast } from "react-toastify";
import { TbEyeClosed } from "react-icons/tb";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";


import useSWR from "swr";

const FormAddUser = ({ setShowModal }) => {

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  // fetch user data use SWR
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_PRO}/api/user`, fetcher);


  const handlePasswordVisible = () => {
    setPasswordVisible(prev => !prev);
  }

  const handleConfirmVisible = () => {
    setConfirmVisible(prev => !prev);
  }


  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const name = e.target[0].value;
    const phone = e.target[1].value;
    const password = e.target[2].value;
    const confPassword = e.target[3].value;
    const role = e.target[4].value;



    if (!name || !phone || !password || !confPassword) {
      toast.error("field required!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password harus lebih dari 6 karakter");
      return;
    }
    if (password !== confPassword) {
      toast.error("Password dan Konfirmasi Password harus sama");
      return;
    }

    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_PRO}/api/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, password, role }),
      });

      const errorData = await res.json();

      if (res.status === 201) {

        const timeoutId = setTimeout(() => {
          setLoading(false);
          setShowModal(false);
          toast.success(`${name} berhasil ditambahkan`);
          mutate();
        }, 3000);
        return () => clearTimeout(timeoutId);
      } else {
        toast.error(errorData.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed w-full top-0 left-0 right-0 h-screen z-50 bg-black/20 backdrop-blur-sm">
      <div className="max-w-xl mx-auto rounded-xl shadow-xl bg-white mt-14 py-8 relative">

        <div className="flex items-center justify-between px-8">
          <h3 className="text-lg text-gray-700 font-medium antialiased -tracking-wide">Tambah User</h3>
          <button onClick={() => setShowModal(false)} className=" text-sm p-1 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-800 font-medium">
            <IoMdClose size={22} />
          </button>
        </div>
        <form
          onSubmit={handleRegister}
          className="w-full flex py-8 max-w-lg mx-auto flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Nama Pengguna"
            name="name"
            className="placeholder:text-sm placeholder:text-gray-400/80 px-4 py-3 rounded  w-full border-gray-300 border-2 bg-transparent text-zinc-500 outline-none  focus:outline-none focus:ring-0 focus:border-2   focus:border-green-400"
          />
          <input
            type="number"
            placeholder="No.Handphone"
            name="phone"
            className="placeholder:text-sm placeholder:text-gray-400/80 px-4 py-3 rounded  w-full border-gray-300 border-2 bg-transparent text-zinc-500 outline-none  focus:outline-none focus:ring-0 focus:border-2   focus:border-green-400"
          />
          <div className="flex items-center justify-between relative">
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              name="password"
              className="placeholder:text-sm placeholder:text-gray-400/80 px-4 py-3 rounded  w-full border-gray-300 border-2 bg-transparent text-zinc-500 outline-none  focus:outline-none focus:ring-0 focus:border-2   focus:border-green-400"
            />
            <div className="absolute right-3 cursor-pointer">
              {!passwordVisible ? <TbEyeClosed className="text-gray-400/80" onClick={() => handlePasswordVisible()} /> : <MdOutlineRemoveRedEye className="text-green-400" onClick={handlePasswordVisible} />}
            </div>

          </div>
          <div className="flex items-center justify-between relative">
            <input
              type={confirmVisible ? 'text' : 'password'}
              placeholder="Konfirmasi Password"
              className="placeholder:text-sm placeholder:text-gray-400/80 px-4 py-3 rounded  w-full border-gray-300 border-2 bg-transparent text-zinc-500 outline-none  focus:outline-none focus:ring-0 focus:border-2   focus:border-green-400"
            />
            <div className="absolute right-3 cursor-pointer">
              {!confirmVisible ? <TbEyeClosed className="text-gray-400/80" onClick={() => handleConfirmVisible()} /> : <MdOutlineRemoveRedEye className="text-green-400" onClick={handleConfirmVisible} />}
            </div>
          </div>
          <select className="px-4 py-3 rounded  w-full border-gray-300 border-2 bg-transparent text-zinc-500 outline-none  focus:outline-none focus:ring-0 focus:border-2   focus:border-green-400 ">
            <option style={{ display: "none" }} value="">Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <button className="px-4 py-3 rounded uppercase transition-all duration-150 ease-linear bg-gradient-to-tr from-green-500 to-lime-400 text-slate-100 hover:bg-green-500 hover:text-white" type="submit">
            {loading ? <div className="flex gap-2 items-center justify-center">
              <span className=" text-white">Loading... </span>
              <span className="loader"></span>
            </div> : "Submit"}
          </button>
        </form>
      </div>
    </div>

  );
};

export default FormAddUser;
