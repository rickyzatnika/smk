"use client"
import { useEffect, useState } from "react";
import { CiViewBoard } from "react-icons/ci";
import useSWR from "swr";
import { IoIosArrowRoundForward } from "react-icons/io";
import Link from "next/link";



const fetcher = (...args) => fetch(...args).then((res) => res.json());

const HeaderInformation = () => {

  const [totalRiders, setTotalRiders] = useState([]);
  const [user, setUser] = useState([]);
  const [classes, setClasses] = useState([])


  // const { data, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_DEV}/api/daftar`, fetcher);
  // const { data: dataUser } = useSWR(`${process.env.NEXT_PUBLIC_API_DEV}/api/user`, fetcher);
  // const { data: dataClass } = useSWR(`${process.env.NEXT_PUBLIC_API_DEV}/api/raceClasses`, fetcher);

  const { data, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_PRO}/api/daftar`, fetcher);
  const { data: dataUser } = useSWR(`${process.env.NEXT_PUBLIC_API_PRO}/api/user`, fetcher);
  const { data: dataClass } = useSWR(`${process.env.NEXT_PUBLIC_API_PRO}/api/raceClasses`, fetcher);



  useEffect(() => {
    if (data && data.riders) {
      setTotalRiders(data?.riders?.length);
      setUser(dataUser);
      setClasses(dataClass);
      mutate();
    }

  }, [data, dataClass, dataUser, mutate]);


  return (
    <div className='items-center justify-start flex gap-3'>
      <div className="shadow-lg rounded-lg flex  justify-items-end flex-col gap-3 w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 ">
        <div className="flex gap-4">
          <CiViewBoard size={24} />
          <div className="flex-col flex gap-3">
            <p className="text-sm">Total Riders</p>
            <p className="text-lg font-medium">{totalRiders} Orang</p>
            <div className="text-sm text-lime-500 ">
              <Link href="/dashboard/list-riders" className="flex gap-1 items-center group">
                <p>Lihat Detail</p>
                <div className="relative right-0 transition-all duration-300 ease-in-out group-hover:-right-2">
                  <IoIosArrowRoundForward size={20} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* 2 */}
      <div className="shadow-lg rounded-lg flex  justify-items-end flex-col gap-3 w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 ">
        <div className="flex gap-4">
          <CiViewBoard size={24} />
          <div className="flex-col flex gap-3">
            <p className="text-sm">Total User</p>
            <p className="text-lg font-medium">{user?.length} Orang</p>
            <div className="text-sm text-lime-500 ">
              <Link href="/dashboard/users" className="flex gap-1 items-center group">
                <p>Lihat Detail</p>
                <div className="relative right-0 transition-all duration-300 ease-in-out group-hover:-right-2">
                  <IoIosArrowRoundForward size={20} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* 3 */}
      <div className="shadow-lg rounded-lg flex  justify-items-end flex-col gap-3 w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 ">
        <div className="flex gap-4">
          <CiViewBoard size={24} />
          <div className="flex-col flex gap-3">
            <p className="text-sm ">Kelas Balap</p>
            <p className="text-lg font-medium">{classes?.length} Kelas</p>
            <div className="text-sm text-lime-500 ">
              <Link href="/dashboard/list-kelas" className="flex gap-1 items-center group">
                <p>Lihat Detail</p>
                <div className="relative right-0 transition-all duration-300 ease-in-out group-hover:-right-2">
                  <IoIosArrowRoundForward size={20} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderInformation