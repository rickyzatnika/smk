"use client";

import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";
import AuthLink from "./AuthLink";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import DarkModeToggle from "../Darkmode/DarkMode";
import { dropLink } from "@/utils/dropLink";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Navbar = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { theme } = useContext(ThemeContext);
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const isDashboard = pathname.startsWith("/dashboard");
  const isMajor = pathname.startsWith("/jurusan");
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false }); // Jangan redirect otomatis
    router.push('/login'); // Redirect secara manual ke halaman login
  };


  const handleCloseMenu = () => {
    setShowMenu(false);
    setShowDropdown(false);
  }

  return (
    <div
      className={`w-full h-24 flex items-center fixed top-0 right-0 left-0 z-[9999] shadow  px-2 sm:px-12 md:px-20 lg:px-24 2xl:px-28 ${isDashboard ? "hidden" : "fixed"
        } ${theme === "light" ? "shadow-md shadow-gray-500/20 bg-white" : "shadow-md shadow-[#111]/60 bg-[#1B1D21]"} `}
    >
      <div onClick={handleCloseMenu} className="flex flex-1 ">
        <Link prefetch={false} href={"/"}>
          <Image
            src="/logo-smk.png"
            alt=""
            width={75}
            height={50}
            className="w-30 md:w-24 h-auto object-contain py-2"
            priority={true}
          />
        </Link>
      </div>

      <div className="hidden text-center md:flex  items-center gap-4 tracking-widest text-xs uppercase">
        <Link
          onClick={handleCloseMenu}
          className={`font-medium pb-2 ${pathname === "/"
            ? "text-lime-500 border-b border-lime-500 "
            : " text-gray-500 hover:text-lime-500 "
            }`}
          prefetch={false}
          href="/"
        >
          Home
        </Link>
        <Link
          onClick={handleCloseMenu}
          className={`font-medium pb-2 ${pathname === "/berita"
            ? "text-lime-500 border-b border-lime-500 pb-1"
            : " text-gray-500 hover:text-lime-500 "
            }`}
          prefetch={false}
          href="/berita"
        >
          Berita
        </Link>
        <Link
          onClick={handleCloseMenu}
          className={`font-medium pb-2 ${pathname === "/informasi"
            ? "text-lime-500 border-b border-lime-500 pb-1"
            : " text-gray-500 hover:text-lime-500 "
            }`}
          prefetch={false}
          href="/informasi"
        >
          Informasi
        </Link>
        <div
          className={`relative font-medium cursor-pointer text-gray-500 hover:text-lime-500 ${showDropdown ? "text-lime-400" : ""}`}
        >
          <button type="button" onClick={() => setShowDropdown((prev) => !prev)} className={` uppercase ${isMajor ? " text-lime-400 border-b border-lime-500 pb-2 " : " text-gray-500"} flex gap-1 items-center pb-2 `}>
            <span>Jurusan</span>
            {showDropdown ? <IoIosArrowUp size={14} /> : <IoIosArrowDown size={14} />}
          </button>
          <ul
            className={`transition-all py-4 duration-300 ease-in-out transform ${showDropdown ? "opacity-100  scale-100" : "opacity-0 top-20  pointer-events-none"} absolute -right-14 z-50 top-12 w-52 bg-white dark:bg-[#1B1D21] dark:text-gray-50 shadow-gray-500/30 dark:shadow-[#111]/70 shadow-lg rounded-md`}
          >
            {dropLink?.map((item) => (
              <li key={item?.id} className="text-md  text-gray-600 dark:text-gray-400 text-left hover:text-lime-500 dark:hover:text-lime-500">
                <Link
                  onClick={() => setShowDropdown(false)}
                  className={`block capitalize px-4 py-2 ${pathname === item.url ? "text-lime-500 " : ""}`}
                  prefetch={false}
                  href={item?.url}
                >
                  {item?.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link
          className={`font-medium pb-2 ${pathname === "/pendaftaran"
            ? "text-lime-500 border-b border-lime-500 pb-1"
            : " text-gray-500 hover:text-lime-500 "
            }`}
          prefetch={false}
          onClick={handleCloseMenu}
          href="/pendaftaran"
        >
          Pendaftaran
        </Link>
        {status === "authenticated" && session?.user?.role === "user" ? (
          <>
            <Link
              onClick={handleCloseMenu}
              className={`font-medium pb-2 ${pathname === "/profile"
                ? "text-lime-500 border-b border-lime-500 pb-1"
                : "text-gray-500 hover:text-lime-500 pb-1"
                }`}
              prefetch={false}
              href="/profile"
            >
              Profile
            </Link>
          </>
        ) : (
          ""
        )}

        <Link
          className={`font-medium pb-2 ${pathname === "/brainstorming"
            ? "text-lime-500 border-b border-green-500 pb-1"
            : "text-gray-500 hover:text-lime-500 pb-1"
            }`}
          prefetch={false}
          onClick={handleCloseMenu}
          href="/forum-diskusi"
        >
          Forum
        </Link>


        {status === "authenticated" && session?.user?.role === "admin" && <Link
          className={`font-medium pb-2 ${pathname === "/dashboard"
            ? "text-lime-500 border-b border-green-500 pb-1"
            : "text-gray-500 hover:text-lime-500 pb-1"
            }`}
          prefetch={false}
          onClick={handleCloseMenu}
          href="/dashboard"
        >
          Dashboard
        </Link>}

      </div>
      <div className="ml-4 pb-0 md:pb-2">
        <DarkModeToggle />
      </div>
      <AuthLink />
      {status === "authenticated" && <button
        type="button"
        onClick={handleLogout}
        className="ml-3 text-xs py-1.5 px-3 bg-lime-500 text-white rounded mb-0 md:mb-2"

      >
        Logout
      </button>}
      <MobileNav showMenu={showMenu} setShowMenu={setShowMenu} />
    </div>
  );
};

export default Navbar;
