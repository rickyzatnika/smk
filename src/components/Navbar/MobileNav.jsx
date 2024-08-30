"use client"

import Link from "next/link"
import { useContext, useState } from "react"
import { IoIosHome } from "react-icons/io";
import { MdOutlineEmojiEvents, MdOutlineSpaceDashboard } from "react-icons/md";
import { BiSolidBookContent } from "react-icons/bi";
import { FaRegAddressBook } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";

import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ThemeContext } from "@/context/ThemeContext";


const MobileNav = ({ setShowMenu, showMenu }) => {


  const { theme } = useContext(ThemeContext);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <div className='block md:hidden ml-3'>
      <div onClick={() => setShowMenu(prev => !prev)} className="flex flex-col items-center gap-[4.5px] cursor-pointer ">
        <div className={` w-6 h-1 transition-all duration-150 ease-linear rounded-md  ${showMenu ? "rotate-45" : ""} origin-left ${theme === "light" ? "second" : "bg-white"}`} />
        <div className={` w-4 h-1 ml-auto transition-all duration-150 ease-linear rounded-md ${showMenu ? "opacity-0" : "opacity-100"}  ${theme === "light" ? "second" : "bg-white"}`} />
        <div className={` w-6 h-1  transition-all duration-150 ease-linear rounded-md ${showMenu ? "-rotate-45" : ""} origin-left ${theme === "light" ? "second" : "bg-white"}`} />
      </div>


      <div className={`w-full h-full fixed border-t-2 border-lime-500 px-6 py-2 z-40 top-24 left-0 transition-all duration-200 ease-linear overflow-hidden gap-8 ${showMenu ? " translate-x-0 opacity-100  " : "top-20 opacity-0 -translate-x-[100%] -z-50"} ${theme === "light" ? "bg-white" : " second"}`}>
        <div className="flex flex-col items-start gap-8 py-8">
          <div onClick={() => setShowMenu(false)} className={` flex gap-2 w-full border-b pb-2 ${pathname === "/" ? "text-lime-500 border-lime-500" : "border-gray-400 dark:border-gray-600 text-gray-600/80"}`}>
            <IoIosHome size={24} />
            <Link className="text-md  uppercase" href={"/"}>Home</Link>
          </div>
          <div onClick={() => setShowMenu(false)} className={` flex gap-2 w-full border-b pb-2 ${pathname === "/news" ? "text-lime-500 border-lime-500" : "border-gray-400 dark:border-gray-600 text-gray-600/80"}`}>
            <MdOutlineEmojiEvents size={24} />
            <Link className="text-md  uppercase" href={"/news"}>Berita</Link>
          </div>
          <div onClick={() => setShowMenu(false)} className={` flex gap-2 w-full border-b pb-2 ${pathname === "/informasi" ? "text-lime-500 border-lime-500" : "border-gray-400 dark:border-gray-600 text-gray-600/80"}`}>
            <BiSolidBookContent size={24} />
            <Link className="text-md  uppercase" href={"/informasi"}>Informasi</Link>
          </div>
          <div onClick={() => setShowMenu(false)} className={` flex gap-2 w-full border-b pb-2 ${pathname === "/pendaftaran" ? "text-lime-500 border-lime-500" : "border-gray-400 dark:border-gray-600 text-gray-600/80"}`}>
            <BiSolidBookContent size={24} />
            <Link className="text-md  uppercase" href={"/pendaftaran"}>Pendaftaran</Link>
          </div>
          <div onClick={() => setShowMenu(false)} className={` flex gap-2 w-full border-b pb-2 ${pathname === "/forum-diskusi" ? "text-lime-500 border-lime-500" : "border-gray-400 dark:border-gray-600 text-gray-600/80"}`}>
            <BiSolidBookContent size={24} />
            <Link className="text-md  uppercase" href={"/forum-diskusi"}>Forum</Link>
          </div>
          <div onClick={() => setShowMenu(false)} className={` flex gap-2 w-full border-b pb-2 ${pathname === "/help" ? "text-lime-500 border-lime-500" : "border-gray-400 dark:border-gray-600 text-gray-600/80"}`}>
            <FaRegAddressBook size={24} />
            <Link className="text-md  uppercase" href={"/help"}>Help</Link>
          </div>
          {status === "authenticated" && session?.user?.role === "user" &&
            (<div onClick={() => setShowMenu(false)} className={`flex gap-2 w-full border-b pb-2 ${pathname === "/profile" ? "text-lime-500 border-lime-500 " : "border-gray-400 dark:border-gray-600 text-gray-600/80 "}`} >
              <FaRegCircleUser size={24} />
              <Link className="text-md  uppercase" href="/profile">Profile</Link>
            </div>)}
          {session?.user?.role === "admin" &&
            <div onClick={() => setShowMenu(false)} className="flex gap-2 w-full border-b pb-2 border-gray-400 text-gray-600/80">
              <MdOutlineSpaceDashboard size={24} />
              <Link className={`${pathname === "/dashboard" ? "text-lime-500 border-b border-lime-500 pb-1" : "text-gray-600/70 hover:text-lime-500 pb-1"}`} prefetch={false} href="/dashboard">Dashboard</Link>
            </div>

          }
          {!session ? (
            <div onClick={() => setShowMenu(false)} className={` flex gap-2 w-full border-b pb-2 ${pathname === "/login" ? "text-lime-500 border-lime-500" : "border-gray-400 dark:border-gray-600 text-gray-600/80"}`}>
              <FaRegAddressBook size={24} />
              <Link className="text-md  uppercase" href={"/login"}>Masuk</Link>
            </div>
          ) : (
            <div onClick={() => setShowMenu(false)} className="text-gray-600 flex gap-2 w-full border-b pb-2 border-gray-400 dark:border-gray-600">
              <FaRegAddressBook size={24} />
              <button onClick={() => signOut()} className="cursor-pointer">Logout</button>
            </div>
          )}
        </div>
      </div>


    </div>
  )
}

export default MobileNav