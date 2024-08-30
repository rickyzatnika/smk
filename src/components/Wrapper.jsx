"use client"

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Wrapper = ({ children }) => {

  const pathname = usePathname();

  const isDashboard = pathname.startsWith('/dashboard');
  const isJurusan = pathname.startsWith('/jurusan');
  const isForum = pathname.startsWith('/forum-diskusi');
  const isLogin = pathname === '/login';
  const isHome = pathname === '/';


  return (
    <div className={`${isDashboard || isLogin || isHome || isJurusan ? "pt-0 px-0 " : "min-h-screen pt-24 px-4 sm:px-12 md:px-20 lg:px-28 2xl:px-32"}`}>{children}
      <div className={`${isDashboard || isForum ? "hidden" : "fixed bottom-4 md:bottom-8 lg:bottom-14 right-5 bg-lime-400 rounded-xl "}`}>
        <Link prefetch={false} target="_blank" href="https://wa.link/8qvcs8" className="relative z-20 group flex gap-2 items-center w-full ">
          <span className="text-white px-6 absolute left-44 group-hover:-left-36 rounded-lg w-max -z-10 bg-lime-400 py-2 transition-all ease-linear duration-200">Hubungi Kami</span>
          <Image src="/whatsapp.png" alt="whatsapp" priority={true} width={100} height={100} className="object-contain w-14 h-14 hover:scale-95 transition-all ease-linear duration-150" />
        </Link>
      </div>
    </div>
  )
}

export default Wrapper