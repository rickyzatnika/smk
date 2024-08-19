"use client"

import { ThemeContext } from "@/context/ThemeContext";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import moment from "moment";


const fetcher = (...args) => fetch(...args).then((res) => res.json());

const EventPage = () => {

  const [query, setQuery] = useState(""); // State untuk query pencarian
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false); // State untuk mencatat pencarian yang tidak ditemukan
  const { theme } = useContext(ThemeContext);
  const { data, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_PRO}/api/news${query ? `?q=${query}` : ""}`,
    fetcher
  );

  useEffect(() => {
    if (!data) {
      setLoading(true);
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    } else {
      setLoading(false);
      setNotFound(data?.events?.length === 0); // Atur notFound jika tidak ada hasil pencarian
    }

    mutate();
  }, [data, mutate]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setLoading(true);
  };



  return (
    <div className="w-full h-full pb-12 py-2 sm:py-4 md:py-8">
      <div className="flex items-start justify-between mb-6 ">
        <h1 className="text-xl md:text-3xl font-medium mb-6">{loading ? "loading data..." : <span className="border-b pb-1 border-lime-500">Berita Terbaru</span>}</h1>
        <input onChange={handleSearch} type="search" className="w-32 md:w-3/12 lg:w-4/12 py-1 md:py-2 px-4 placeholder:text-sm rounded-xl border-gray-400 text-gray-500 focus:border-lime-400 focus:outline-none focus:ring-0" placeholder="Search" />
      </div>
      {/* Pesan peringatan jika tidak ada hasil pencarian */}
      {notFound && (
        <div className="w-full text-center py-8">
          <p className="text-lg text-red-500">Pencarian tidak ditemukan</p>
        </div>
      )}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {data?.news?.map((n, i) => (
          <Link href={`/news/${n?.slug}`} key={i} className={`w-full group overflow-hidden h-full items-center flex flex-col gap-3 rounded-md shadow hover:shadow-md ${theme === "light" ? "bg-gray-100 text-gray-600 shadow-slate-300" : "bg-[#181A18] text-gray-300 shadow-gray-950 "}`}>
            <div className="overflow-hidden w-full ">
              <Image src={n?.imageUrl} alt={n?.title} width={384} height={288} className="w-full object-cover h-72 group-hover:scale-150 transition-all ease-in-out duration-[4000ms] " priority={true} />
            </div>
            <div className="flex flex-col items-start gap-2 w-full px-1.5">
              <div className="flex items-center gap-1 ">
                <span className="text-xs text-gray-500 dark:text-gray-200" >Di posting :</span>
                <span className="text-xs px-2 py-0.5 rounded-full text-gray-500 bg-slate-200 shadow dark:bg-slate-700 dark:text-gray-200 w-fit">{moment(n?.createdAt).format('ll')}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 dark:text-gray-200" >Kategory :</span>
                <span className="text-xs px-2 py-0.5 rounded-full text-gray-500 bg-slate-200 shadow dark:bg-slate-700 dark:text-gray-200 w-fit">{n?.category}</span>
              </div>
            </div>

            <div className="w-full px-2 py-4 flex flex-col gap-4 antialiased">
              <h1 className="text-lg md:text-xl font-medium group-hover:text-gray-900 dark:group-hover:text-gray-50">{n?.title}</h1>
              {/* <p className="text-sm pl-1 text-gray-500 font-medium dark:text-gray-300">{e?.desc}</p> */}

            </div>
          </Link>
        ))}
      </div>

    </div >
  )
}

export default EventPage