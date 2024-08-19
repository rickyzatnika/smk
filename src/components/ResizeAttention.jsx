"use client"

import { useLayoutEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";


const ResizeAttention = () => {

  const [isVisible, setIsVisible] = useState(true);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 872 && window.innerWidth <= 1920) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Set visibility on initial load
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isVisible) {
    return (
      <div className="w-full bg-white px-3 h-screen gap-6 fixed top-0 left-0 z-[9999] flex flex-col items-center justify-evenly">
        <div className="text-center flex flex-col items-center">
          <Image
            src="/sad.svg"
            alt="sad-emoticon"
            width={100}
            height={100}
            priority={true}
            className="animate-spin-slow mb-2"
          />
          <h1 className="text-lg font-semibold antialiased leading-relaxed text-gray-600 dark:text-gray-400">
            Mohon maaf, halaman Dashboard hanya bisa dilihat pada layar
            laptop/PC .
          </h1>
        </div>
        <Link
          className="text-gray-500 text-lg dark:text-gray-400 underline"
          href="/"
        >
          {" "}
          Kembali ke Beranda
        </Link>
      </div>
    );
  }
};

export default ResizeAttention;
