"use client"

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import BarChart from '@/components/Dashboard/BarChart';
import { TbLogout } from "react-icons/tb";
import { signOut, useSession } from 'next-auth/react';
import RightSide from '@/components/Dashboard/RightSide';
import DarkModeToggle from '@/components/Darkmode/DarkMode';


const HeaderInformation = dynamic(() => import('@/components/Dashboard/HeaderInformation'), { ssr: false });

const Dashboard = () => {


  const { data: session } = useSession();

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      const formattedTime = now.toLocaleString('id-ID', options);
      setCurrentTime(formattedTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);


  return (

    <>
      <div className="flex items-center justify-between pb-4 px-2 max-w-full border-b border-gray-400 dark:border-gray-800 ">
        <div className='flex flex-col '>
          <h1 className='text-md font-medium uppercase'>Dashboard</h1>
          <h3 className="text-sm">Hi {session?.user?.name}, Enjoy your work.</h3>
        </div>

        <div className='relative flex gap-3'>
          <DarkModeToggle />
          <div className='relative group flex justify-between items-center gap-3'>
            <TbLogout size={28} onClick={() => signOut()} className='cursor-pointer ' />
            <span className='hidden group-hover:block text-[10px] absolute -top-2 -left-12 py-1 px-2 bg-black rounded-lg text-gray-200'>Logout</span>
          </div>
        </div>
      </div>
      <div className='w-full relative flex gap-3'>
        <div className='flex flex-col basis-9/12 '>
          <div className='w-full bg-gray-100 shadow-md dark:bg-slate-800 my-3 rounded-lg'>
            <p className='text-xs antialiased text-center py-2 capitalize'>{currentTime} WIB</p>
          </div>
          <HeaderInformation />
          <div className='flex antialiased flex-col shadow-lg gap-4 w-full my-6 bg-gray-100 dark:bg-slate-800 py-6 rounded-lg px-6'>
            <h2 className='text-sm font-medium'>Data Transaksi Keseluruhan Pembayaran Tunai dan Transfer </h2>
            <BarChart />
          </div>
        </div>
        <div className='basis-3/12 h-full my-3 sticky top-5'>
          <RightSide />
        </div>
      </div>
    </>

  );
};

export default Dashboard;
