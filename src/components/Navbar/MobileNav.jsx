"use client"

import Link from "next/link"
import { useContext, useState } from "react"
import { IoIosArrowUp, IoIosHome } from "react-icons/io";
import { MdOutlineEmojiEvents, MdOutlineSpaceDashboard } from "react-icons/md";
import { BiSolidBookContent } from "react-icons/bi";
import { FaRegAddressBook } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ThemeContext } from "@/context/ThemeContext";
import { TbRouteScan } from "react-icons/tb";
import { dropLink } from "@/utils/dropLink";


const MobileNav = ({ setShowMenu, showMenu }) => {


  const { theme } = useContext(ThemeContext);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [showMajor, setShowMajor] = useState(false);

  return (
    <div className='block md:hidden ml-3 0'>
      <div onClick={() => setShowMenu(prev => !prev)} className="flex flex-col items-center gap-[4.5px] cursor-pointer relative z-50 ">
        <div className={` w-6 h-1 transition-all duration-150 ease-linear rounded-md  ${showMenu ? "rotate-45" : ""} origin-left ${theme === "light" ? "second" : "bg-white"}`} />
        <div className={` w-4 h-1 ml-auto transition-all duration-150 ease-linear rounded-md ${showMenu ? "opacity-0" : "opacity-100"}  ${theme === "light" ? "second" : "bg-white"}`} />
        <div className={` w-6 h-1  transition-all duration-150 ease-linear rounded-md ${showMenu ? "-rotate-45" : ""} origin-left ${theme === "light" ? "second" : "bg-white"}`} />
      </div>


      {/* Mobile navigation menu */}
      <div div className={`w-full h-screen fixed top-24 left-0 z-40 transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800 transform ${showMenu ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-full px-6 pt-4 overflow-y-scroll space-y-4">
          <div onClick={() => setShowMenu(false)} className={`flex gap-2 w-full border-b pb-2 ${pathname === "/" ? "text-lime-500 border-lime-500" : "border-gray-400 dark:border-gray-600 text-gray-600/80 dark:text-gray-400"}`}>
            <IoIosHome size={24} />
            <Link className="text-md uppercase" href={"/"}>Home</Link>
          </div>
          <div onClick={() => setShowMenu(false)} className={`flex gap-2 w-full border-b pb-2 ${pathname === "/berita" ? "text-lime-500 border-lime-500" : "border-gray-400 dark:border-gray-600 text-gray-600/80 dark:text-gray-400"}`}>
            <MdOutlineEmojiEvents size={24} />
            <Link className="text-md uppercase" href={"/berita"}>Berita</Link>
          </div>
          <div onClick={() => setShowMenu(false)} className={`flex gap-2 w-full border-b pb-2 ${pathname === "/informasi" ? "text-lime-500 border-lime-500" : "border-gray-400 dark:border-gray-600 text-gray-600/80 dark:text-gray-400"}`}>
            <BiSolidBookContent size={24} />
            <Link className="text-md uppercase" href={"/informasi"}>Informasi</Link>
          </div>
          <button type="button" onClick={() => setShowMajor(prev => !prev)} className="outline-none focus-visible:outline-none border-b pb-2 flex items-center justify-between w-full border-gray-400 dark:border-gray-600 text-gray-600/80 dark:text-gray-400">
            <span className="flex gap-2">
              <TbRouteScan size={24} />
              <span className="uppercase">Jurusan</span>
            </span>
            {showMajor ? <IoIosArrowUp size={24} /> : <IoIosArrowDown size={24} />}
          </button>
          {showMajor && (
            <div className="flex flex-col gap-3">
              {dropLink?.map((d, i) => (
                <Link onClick={() => setShowMenu(false)} className={`w-full h-full text-sm px-2 ${pathname === d?.url ? "text-lime-500 border-lime-500" : "text-gray-600/80 dark:text-gray-400"}`} href={d?.url} key={i}>{d?.label}</Link>
              ))}
            </div>
          )}
          <div onClick={() => setShowMenu(false)} className={`flex gap-2 w-full border-b pb-2 ${pathname === "/pendaftaran" ? "text-lime-500 border-lime-500" : "border-gray-400 dark:border-gray-600 text-gray-600/80 dark:text-gray-400"}`}>
            <BiSolidBookContent size={24} />
            <Link className="text-md uppercase" href={"/pendaftaran"}>Pendaftaran</Link>
          </div>
          <div onClick={() => setShowMenu(false)} className={`flex gap-2 w-full border-b pb-2 ${pathname === "/forum-diskusi" ? "text-lime-500 border-lime-500" : "border-gray-400 dark:border-gray-600 text-gray-600/80 dark:text-gray-400"}`}>
            <BiSolidBookContent size={24} />
            <Link className="text-md uppercase" href={"/forum-diskusi"}>Forum</Link>
          </div>
          <div onClick={() => setShowMenu(false)} className={`flex gap-2 w-full border-b pb-2 ${pathname === "/help" ? "text-lime-500 border-lime-500" : "border-gray-400 dark:border-gray-600 text-gray-600/80 dark:text-gray-400"}`}>
            <FaRegAddressBook size={24} />
            <Link className="text-md uppercase" href={"/help"}>Help</Link>
          </div>
          {status === "authenticated" && session?.user?.role === "user" && (
            <div onClick={() => setShowMenu(false)} className={`flex gap-2 w-full border-b pb-2 ${pathname === "/profile" ? "text-lime-500 border-lime-500" : "border-gray-400 dark:border-gray-600 text-gray-600/80 dark:text-gray-400"}`}>
              <FaRegCircleUser size={24} />
              <Link className="text-md uppercase" href="/profile">Profile</Link>
            </div>
          )}
          {session?.user?.role === "admin" && (
            <div onClick={() => setShowMenu(false)} className="flex gap-2 w-full border-b pb-2 border-gray-400 text-gray-600/80">
              <MdOutlineSpaceDashboard size={24} />
              <Link className={`${pathname === "/dashboard" ? "text-lime-500 border-b border-lime-500 pb-1" : "text-gray-600/70 hover:text-lime-500 pb-1 dark:text-gray-400"}`} prefetch={false} href="/dashboard">Dashboard</Link>
            </div>
          )}
        </div>
      </div>


    </div>
  )
}

export default MobileNav