"use client"

import { usePathname } from "next/navigation";

const Wrapper = ({ children }) => {

    const pathname = usePathname();

    const isDashboard = pathname.startsWith('/dashboard');
    const isJurusan = pathname.startsWith('/jurusan');
    const isLogin = pathname === '/login';
    const isHome = pathname === '/';


    return (
        <div className={`${isDashboard || isLogin || isHome || isJurusan ? "pt-0 px-0 " : "min-h-screen pt-24 px-4 sm:px-12 md:px-20 lg:px-28 2xl:px-32"}`}>{children}</div>
    )
}

export default Wrapper