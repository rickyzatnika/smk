"use client";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { TbEyeClosed } from "react-icons/tb";
import { MdOutlineRemoveRedEye } from "react-icons/md";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormRegister from "@/components/FormRegister";
import Image from "next/image";
import { ThemeContext } from "@/context/ThemeContext";

const Login = () => {

  const { theme } = useContext(ThemeContext);
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


    if (name === "" || password === "") {
      toast.error("Field required!");
      setLoading(false);
      return;
    }

    if (password.length < 5) {
      toast.error("Password must be at least 5 characters");
      setLoading(false);
      return;
    }

    try {
      // Sign in with redirect set to false to handle response manually
      const result = await signIn("credentials", {
        redirect: false,
        name,
        password,
      });

      if (result?.error) {
        // Display error message received from server
        toast.error(result.error);
      } else if (result?.status === 200) {
        // Get the session to access user role
        const session = await getSession();
        const role = session?.user?.role;

        const redirectUrl = role === "admin" ? "/dashboard" : "/";
        router.push(redirectUrl);
      } else {
        toast.error("Login failed. Please check your credentials and try again.");
      }

    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="relative flex flex-col items-center justify-center w-full px-4 pt-24 pb-6 sm:pt-24 mt-3">
        <div className="hexa fixed top-0 left-0 w-full h-full blur-[2px]">
          <Image src="/hexa.jpg" alt="race-flag" sizes="100%" priority={true} fill className="object-cover" />
        </div>

        <div className={`relative z-40 w-full max-w-md rounded-xl shadow-xl ${theme === "light" ? "bg-white/10 text-gray-700 backdrop-blur-[3px]" : "text-gray-100 bg-[#1E201E]/70 backdrop-blur-[3px]"}`}>
          <h2 className="pt-6 text-lg font-bold text-center">
            {activeButton === "login" ? "LOGIN FORM" : "REGISTER FORM"}
          </h2>

          <div className="flex flex-col gap-4 px-6 py-8 text-sm md:text-base">
            <div className="flex items-center justify-center w-full text-center overflow-hidden">
              <button
                className={`w-full py-3 sm:py-4 rounded-tl-xl ${activeButton === "login" ? "bg-gradient-to-tr from-green-500 to-lime-400 text-white" : "text-gray-400 dark:text-gray-50"}`}
                onClick={() => setActiveButton("login")}>
                MASUK
              </button>
              <button
                className={`w-full py-3 sm:py-4 rounded-tr-xl ${activeButton === "register" ? "bg-gradient-to-tr from-green-500 to-lime-400 text-white" : "text-gray-400 dark:text-gray-50"}`}
                onClick={() => setActiveButton("register")}>
                DAFTAR
              </button>
            </div>

            {activeButton === "login" &&
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Nama Pengguna"
                  name="name"
                  required
                  className="w-full px-4 py-3 text-gray-600 focus:placeholder-transparent dark:placeholder-gray-300 focus:dark:placeholder-transparent bg-transparent border-2 border-gray-300 rounded outline-none focus:ring-0 focus:border-green-400 dark:text-gray-300"
                />
                <div className="relative flex items-center">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="Password"
                    name="password"
                    required
                    className="w-full px-4 py-3 text-gray-600 focus:placeholder-transparent dark:placeholder-gray-300 focus:dark:placeholder-transparent bg-transparent border-2 border-gray-300 rounded focus:ring-0 outline-none focus:border-green-400 dark:text-gray-300"
                  />
                  <div className="absolute right-3 cursor-pointer">
                    {!passwordVisible ? <TbEyeClosed className="text-gray-400/80" onClick={() => handlePasswordVisible()} /> : <MdOutlineRemoveRedEye className="text-green-400" onClick={handlePasswordVisible} />}
                  </div>
                </div>
                <button className="px-6 py-3 text-white uppercase transition-all duration-150 ease-linear bg-gradient-to-tr from-green-500 to-lime-400 rounded-md hover:bg-green-500">
                  {loading ? <div className="flex items-center justify-center gap-2"><span>Loading...</span><span className="loader"></span></div> : "Masuk"}
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
