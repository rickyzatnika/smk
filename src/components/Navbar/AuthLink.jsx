"use client"

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import DarkModeToggle from "../Darkmode/DarkMode";



const AuthLink = () => {

  const { data: session, status } = useSession();



  return (
    <div className='ml-3 md:ml-4 flex items-center gap-2 pb-0 md:pb-3'>
      {status === "authenticated" && (
        <p className="text-gray-500  block text-xs capitalize antialiased font-medium dark:text-gray-300">Hi, {session?.user?.name}</p>
      )}
      {status === "loading" && (
        <div className="loader hidden sm:block text-xs" />
      )}
      {status === "unauthenticated" ? (
        <Link className="rounded-md bg-gradient-to-tr  from-green-500 to-lime-400 text-slate-100 hover:bg-gradient-to-tl hover:from-green-400 hover:to-lime-500 px-4 py-2 transition-colors text-sm ease-linear duration-200 hover:text-white" href={"/login"}>Masuk</Link>
      ) : (
        ""
        // <button onClick={() => signOut()} className="uppercase rounded-md bg-gradient-to-tr from-green-500 to-lime-400 text-slate-100 hover:bg-gradient-to-tl hover:from-green-400 hover:to-lime-500 px-4 py-2 text-sm transition-colors ease-linear duration-200 hover:text-white ">Logout</button>
      )}
    </div>
  )
}

export default AuthLink