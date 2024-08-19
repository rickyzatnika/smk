"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { asideLink } from "@/utils/asideLink";
import Image from "next/image";
import DarkModeToggle from "../Darkmode/DarkMode";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";


const Aside = () => {
  const { data: session } = useSession();

  const pathname = usePathname();


  const { theme } = useContext(ThemeContext);

  return (
    <div className="h-screen w-full min-h-screen flex items-center flex-col justify-between sticky left-0 top-0 z-10 ">
      <div className="w-full py-4 border-b border-gray-400 dark:border-gray-800 px-2 ">
        <Link href="/" className="">
          <Image src="/bar.png" alt="bar-logo" width={140} height={140} priority={true} className="object-contain w-full h-auto py-4" />
        </Link>

      </div>

      {asideLink.map((item) => (
        <div key={item?.id} className="w-full  flex flex-col items-start  justify-start">
          <Link href={item?.link} className={`w-full gap-2 text-sm overflow-hidden relative uppercase flex items-center  py-2.5 px-4 transition-all  ease-linear duration-100 
            ${pathname === item?.link ? `${theme === 'dark' ? 'bg-slate-800 text-gray-200' : 'second text-white'} ` : `${theme === 'dark' ? 'hover:bg-slate-800 hover:text-gray-200' : 'hover:bg-[#081225] hover:text-white'} hover:shadow-md`}`}>
            <span>{item?.icon}</span>
            <h3>{item?.title}</h3>
          </Link>
        </div>
      ))}
      <div></div>
      <div></div>
      <div></div>
      <div></div>

      <button onClick={() => signOut()} type="button" className="w-full focus:outline-none text-white bg-gradient-to-tr from-green-400 to-lime-500 hover:bg-gradient-to-tl hover:from-green-400 hover:to-lime-500 focus:ring-4 focus:ring-green-300 font-medium text-sm py-2.5  dark:bg-lime-600 dark:hover:bg-lime-700 dark:focus:ring-green-800">Logout</button>
    </div>
  );
};

export default Aside;
