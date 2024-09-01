"use client"

import Link from 'next/link';
import { Suspense, useEffect } from 'react';
import useSWR from 'swr';
import moment from 'moment';
import { GrFormView } from 'react-icons/gr';
import { FaUserCircle } from 'react-icons/fa';
import Image from 'next/image';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function BrainstormingPage() {
  const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_PRO}/api/brainstorming`, fetcher, { suspense: true });

  const { data: news } = useSWR(
    `${process.env.NEXT_PUBLIC_API_PRO}/api/news`,
    fetcher
  );

  const limitedData = news?.news?.slice(0, 3);

  if (error) return <div>Error loading brainstorming sessions.</div>;


  return (
    <Suspense fallback={<div className='w-full h-screen flex items-center justify-center'>Loading...</div>} >
      <div className="w-full min-h-screen pt-2 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        {/* Left */}
        <div className='col-span-12 lg:col-span-8 py-5'>
          <div className='p-4 bg-white dark:bg-[#1B1D21] mb-8 rounded shadow-md shadow-gray-300 dark:shadow-[#111]/60'>
            <h1 className="text-lg md:text-xl font-medium mb-3">Topik Umum</h1>
            <p className='text-sm leading-relaxed text-gray-500 dark:text-gray-300/80'>Ini adalah forum untuk diskusi seputar kegiatan sekolah, panduan, tips belajar, ekstrakurikuler, acara sekolah, dan topik lain yang berkaitan dengan SMK ICB secara umum. Jika Anda memiliki pertanyaan terkait kegiatan atau informasi yang tidak termasuk dalam kategori forum khusus, silakan gunakan forum ini untuk diskusi atau bertanya. Forum ini bukanlah tempat untuk konsultasi akademik atau tugas sekolah yang spesifik, melainkan wadah untuk berbagi informasi dan pengalaman yang bermanfaat bagi seluruh warga sekolah.</p>
          </div>
          <div className="flex flex-col w-full shadow-lg shadow-gray-200 dark:shadow-[#111]/60">
            <div className='w-full uppercase font-medium bg-lime-600 py-3  px-4 '>
              <p className='text-center text-white text-lg flex justify-start'>General Topic</p>
            </div>
            {data?.sessions?.map((session) => (
              <div key={session?._id} className='w-full border-b pb-2 border-gray-400 dark:border-gray-500 bg-white dark:bg-[#2D3036] flex flex-col-reverse md:flex-row py-4 gap-1 md:gap-8 items-start justify-between'>
                <div className='flex flex-col w-full px-2 md:px-6 py-4 md:py-2'>
                  <Link href={`/forum-diskusi/${session?._id}`} className='group '>
                    <h1 className='text-md md:text-lg text-gray-700 dark:text-gray-200 group-hover:text-gray-400/90 transition-all ease-in-out duration-100'>{session?.title}</h1>
                    <p className='text-sm leading-relaxed text-gray-500 dark:text-gray-300/80 group-hover:text-gray-400/90 transition-all ease-in-out duration-100'>{session?.description}</p>
                  </Link>
                  <div className='flex  items-center gap-3 py-3'>
                    <span className={`${session?.status === "ongoing" ? "bg-lime-600" : "bg-red-500"} text-xs text-white px-2 py-0.5 rounded-full capitalize`}>{session?.status === "ongoing" ? "Sedang Berlangsung" : "Selesai"}</span>
                    <span className='bg-[#555] text-xs flex items-center text-white px-2 py-0.5 rounded-full capitalize'><GrFormView size={15} />{session?.views} orang</span>
                  </div>
                </div>
                <div className='px-2 md:px-8 flex flex-row md:flex-col py-2 md:py-4 bg-[#1B1D21] md:bg-transparent w-full md:w-1/2 md:items-start items-center justify-between md:justify-start'>
                  <p className='text-sm font-medium flex gap-2 text-gray-400 dark:text-gray-300 py-2'>
                    <FaUserCircle size={24} />
                    {session?.creator}
                  </p>
                  <span className='text-xs text-gray-400 dark:text-gray-300 py-0.5 '>{moment(session?.createdAt).format("LLL")}</span>

                </div>
              </div>

            ))}
          </div>
        </div>


        {/* Right */}

        <div className='col-span-12 lg:col-span-4 relative md:sticky top-0 md:top-36 w-full h-full md:h-max bg-white dark:bg-[#2D3036] mb-8 rounded shadow-md shadow-gray-300 dark:shadow-[#111]/60 p-5 '>
          <h1 className='py-3 font-medium border-b mb-3 border-gray-400 dark:border-gray-500 text-gray-600 dark:text-gray-400'>BERITA TERBARU</h1>
          <div className='flex flex-col items-start gap-4 justify-center'>
            {limitedData?.map((n, i) => (
              <Link href={`/berita/${n?.slug}`} key={i} className='flex gap-2 items-center py-2 hover:underline '>
                <Image src={n?.imageUrl} alt={n?.title} width={100} height={100} priority={true} className='rounded-full w-14 h-14 md:w-24 lg:w-12 md:h-24 lg:h-12 object-contain' />
                <h3 className='text-sm text-gray-700 dark:text-gray-200/80 '>{n?.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Suspense>
  );
}