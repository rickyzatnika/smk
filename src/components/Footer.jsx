"use client"

import { ThemeContext } from "@/context/ThemeContext"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useContext } from "react"

const Footer = () => {

  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`${pathname === "/login" || isDashboard ? "hidden" : " block w-full"}`}>
      <footer className="bg-gray-200 rounded-tr-2xl rounded-tl-2xl shadow dark:bg-[#1B1D21] ">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="md:flex md:items-start md:justify-between">
            <Link prefetch={false} href="/" className="w-fit flex flex-col gap-3 items-start  mb-4 sm:mb-0  rtl:space-x-reverse">
              <span className="flex gap-2 items-center">
                <Image src={`${theme === "light" ? "/icb.png" : "/icb-putih.png"}`} priority={true} width={500} height={500} className="object-contain w-20 md:w-28 h-auto" alt="SMK ICB" />
                <div className="px-3">
                  <p className="text-gray-600 dark:text-gray-300/80 text-md md:text-xl font-medium">SMK ICB CINTA NIAGA</p>
                  <p className="text-gray-600 dark:text-gray-300/80 text-sm  ">Bisnis Management dan Teknik Informatika</p>
                </div>
              </span>
              <span className="px-0 md:px-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300/80 mb-6 md:mb-0" >PROJECT TEST.</span>
            </Link>
            <ul className="flex flex-col gap-3 md:gap-0 md:flex-row flex-wrap items-start md:items-center mb-6 text-sm font-medium text-gray-400 sm:mb-0">
              <li>
                <Link prefetch={false} href="/about" className="hover:underline me-4 md:me-6">About</Link>
              </li>
              <li>
                <Link prefetch={false} href="/contact" className="hover:underline me-4 md:me-6">Contact</Link>
              </li>
              <li>
                <Link prefetch={false} href="/terms-conditions" className="hover:underline me-4 md:me-6">Terms & Conditions</Link>
              </li>
              <li>
                <Link prefetch={false} href="/privacy-police" className="hover:underline me-4 md:me-6">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-lime-500 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="flex flex-col md:flex-row items-start sm:justify-between text-sm text-gray-400 sm:text-center "><Link href="/" className="hover:underline">© SMK ICB CINTA NIAGA power by CODERS.ID</Link>All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  )
}

export default Footer