"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const Footer = () => {

  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');


  return (
    <div className={`${pathname === "/login" || isDashboard ? "hidden" : " block w-full"}`}>
      <footer className="bg-gray-200 rounded-tr-2xl rounded-tl-2xl shadow dark:bg-[#0C0C0C] ">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="md:flex md:items-center md:justify-between">
            <Link prefetch={false} href="/" className="w-fit flex flex-col gap-3 items-start mb-4 sm:mb-0  rtl:space-x-reverse">
              <Image src="/logo-smk.png" priority={true} width={260} height={160} className="object-contain w-80 h-40" alt="Logo Barland" />
              <span className="text-xs sm:text-sm text-gray-400 mb-6 md:mb-0" >Lorem ipsum dolor sit amet consectetur, adipisicing elit. Error, magnam.</span>
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
          <span className="flex flex-col md:flex-row items-start sm:justify-between text-sm text-gray-400 sm:text-center "><Link href="/" className="hover:underline">© 2024 SMK ICB CINTA NIAGA.</Link>All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  )
}

export default Footer