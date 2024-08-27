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





const Navbar = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { theme } = useContext(ThemeContext);
  const [showMenu, setShowMenu] = useState(false);
  const isDashboard = pathname.startsWith("/dashboard");
  const router = useRouter();




  const handleLogout = async () => {
    await signOut({ redirect: false }); // Jangan redirect otomatis
    router.push('/login'); // Redirect secara manual ke halaman login
  };

  return (
    <div
      className={`w-full h-24 flex items-center  fixed top-0 right-0 left-0 z-50 shadow  px-2 sm:px-12 md:px-20 lg:px-24 2xl:px-28 ${isDashboard ? "hidden" : "fixed"
        } ${theme === "light" ? "shadow-gray-200 bg-white" : "shadow-gray-950 bg-[#0C0C0C]"} `}
    >
      <div onClick={() => setShowMenu(false)} className="flex flex-1">
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
          className={`font-medium pb-3 ${pathname === "/"
            ? "text-lime-500 border-b border-lime-500 "
            : " text-gray-500 hover:text-lime-500 "
            }`}
          prefetch={false}
          href="/"
        >
          Home
        </Link>
        <Link
          className={`font-medium pb-3 ${pathname === "/berita"
            ? "text-lime-500 border-b border-lime-500 pb-1"
            : " text-gray-500 hover:text-lime-500 "
            }`}
          prefetch={false}
          href="/berita"
        >
          Berita
        </Link>
        <Link
          className={`font-medium pb-3 ${pathname === "/informasi"
            ? "text-lime-500 border-b border-lime-500 pb-1"
            : " text-gray-500 hover:text-lime-500 "
            }`}
          prefetch={false}
          href="/informasi"
        >
          Informasi
        </Link>
        <div
          className="relative pb-3 group group-hover:delay-300 font-medium cursor-pointer text-gray-500  hover:text-lime-500"
        >
          Jurusan
          <ul
            className="hidden opacity-0 group-hover:opacity-100 group-hover:block py-4 transition-all duration-300 absolute left-0 z-50 top-5 w-48 bg-white dark:bg-[#111] dark:text-gray-50 shadow-lg rounded-md"
          >
            {dropLink?.map((item) => (
              <li key={item?.id} className="text-gray-600 dark:text-gray-400 text-left hover:text-lime-500 dark:hover:text-lime-500">
                <Link
                  className={`block capitalize px-4 py-2 ${pathname === item.url ? "text-lime-500 font-semibold" : ""}`}
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
          className={`font-medium pb-3 ${pathname === "/pendaftaran"
            ? "text-lime-500 border-b border-lime-500 pb-1"
            : " text-gray-500 hover:text-lime-500 "
            }`}
          prefetch={false}
          href="/pendaftaran"
        >
          Pendaftaran
        </Link>
        {status === "authenticated" && session?.user?.role === "user" ? (
          <>
            <Link
              className={`font-medium pb-3 ${pathname === "/profile"
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
          className={`font-medium pb-3 ${pathname === "/brainstorming"
            ? "text-lime-500 border-b border-green-500 pb-1"
            : "text-gray-500 hover:text-lime-500 pb-1"
            }`}
          prefetch={false}
          href="/forum-diskusi"
        >
          Forum
        </Link>


        {status === "authenticated" && session?.user?.role === "admin" && <Link
          className={`font-medium pb-3 ${pathname === "/dashboard"
            ? "text-lime-500 border-b border-green-500 pb-1"
            : "text-gray-500 hover:text-lime-500 pb-1"
            }`}
          prefetch={false}
          href="/dashboard"
        >
          Dashboard
        </Link>}

      </div>
      <div className="ml-4 pb-0 md:pb-3">
        <DarkModeToggle />
      </div>
      <AuthLink />
      {status === "authenticated" && <button
        type="button"
        onClick={handleLogout}
        className="ml-3 text-xs py-1.5 px-3 bg-lime-500 text-white rounded mb-3"

      >
        Logout
      </button>}
      <MobileNav showMenu={showMenu} setShowMenu={setShowMenu} />
    </div>
  );
};

export default Navbar;
