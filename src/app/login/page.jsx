"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { TbEyeClosed } from "react-icons/tb";
import { MdOutlineRemoveRedEye } from "react-icons/md";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormRegister from "@/components/FormRegister";
import Image from "next/image";
import { ThemeContext } from "@/context/ThemeContext";

const Login = () => {

  const { theme } = useContext(ThemeContext);
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [activeButton, setActiveButton] = useState("login");

  const handlePasswordVisible = () => {
    setPasswordVisible(prev => !prev);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const name = e.target[0].value;
    const password = e.target[1].value;

    try {
      if (name === "" || password === "") {
        toast.error("Field required!");
        return;
      }

      if (password.length < 5) {
        toast.error("Password must be at least 5 characters");
        return;
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      })

      const error = await res.json();

      if (res.status === 200) {
        const timeOutId = setTimeout(() => {
          setLoading(false);
          signIn("credentials", {
            name: name,
            password: password,
          });
        }, 3000)

        return () => clearTimeout(timeOutId);
      } else {
        toast.error(error.message);
        setLoading(false);
      }

    } catch (error) {
      toast.error(error.message);
    }

  };

  useEffect(() => {
    if (session) {
      if (session.user.role === 'admin' || session.user.role === 'master') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [router, session]);


  return (
    <>
      <div className="w-full relative px-1 pt-24 pb-4 sm:pt-24 flex flex-col gap-2 items-center justify-center">
        <div className="w-full h-full blur-[2px] fixed left-0 top-0 ">
          <Image src="/hexa.jpg" alt="race-flag" sizes="100%" priority={true} fill className="object-cover" />
        </div>
        <div className={`relative z-40 w-full max-w-md rounded-xl shadow-lg ${theme === "light" ? "second text-gray-100" : "bg-white text-gray-700"}`}>
          <h2 className="text-center text-lg pt-6 font-bold">
            {activeButton === "login" ? "LOGIN FORM" : "REGISTER FORM"}
          </h2>
          <div className="w-full text-sm md:text-md py-6 flex flex-col gap-2 h-full px-6 ">
            <div className=" flex items-center gap-1 justify-center w-full overflow-hidden text-center">
              <button className={`text-sm sm:text-md rounded-tl-xl text-center w-full py-3 sm:py-4 ${activeButton === "login" ? "bg-gradient-to-tr from-green-500 to-lime-400 text-white" : " text-gray-400"}`} onClick={() => setActiveButton("login")}>MASUK</button>
              <button className={`text-sm sm:text-md rounded-tr-xl  text-center w-full py-3 sm:py-4 ${activeButton === "register" ? "bg-gradient-to-tr from-green-500 to-lime-400 text-white" : " text-gray-400"}`} onClick={() => setActiveButton("register")}>DAFTAR</button>
            </div>

            {activeButton === "login" &&
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Nama Pengguna"
                  name="name"
                  required
                  className="px-4 py-3  dark:text-gray-900 rounded placeholder:text-zinc-400  w-full border-gray-300 border-2 bg-transparent text-gray-200 outline-none focus:outline-none focus:ring-0 focus:border-2  focus:border-green-400"
                />
                <div className="flex items-center justify-between relative">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="Password"
                    name="password"
                    className="px-4 py-3  dark:text-gray-900 rounded  w-full border-gray-300 border-2 bg-transparent text-gray-200 outline-none focus:outline-none focus:ring-0 focus:border-2  focus:border-green-400"
                  />
                  <div className="absolute right-3 cursor-pointer">
                    {!passwordVisible ? <TbEyeClosed className="text-gray-400/80" onClick={() => handlePasswordVisible()} /> : <MdOutlineRemoveRedEye className="text-green-400" onClick={handlePasswordVisible} />}
                  </div>

                </div>
                <button className="py-3 px-6 uppercase text-slate-100 transition-all duration-150 ease-linear bg-gradient-to-tr from-green-500 to-lime-400  hover:bg-green-500 hover:text-white rounded-md" type="submit">
                  {loading ? <div className="flex gap-2 items-center justify-center">
                    <span className=" text-white">Loading... </span>
                    <span className="loader"></span>
                  </div> : "Masuk"}
                </button>
              </form>
            }

            {activeButton === "register" &&
              <FormRegister setActiveButton={setActiveButton} />
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
