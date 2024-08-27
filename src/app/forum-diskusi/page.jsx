
"use client"

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';
import useSWR from 'swr';
import moment from 'moment';
import { GrFormView } from 'react-icons/gr';
import { FaUserCircle } from 'react-icons/fa';
import Image from 'next/image';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function BrainstormingPage() {
  const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_PRO}/api/brainstorming`, fetcher);

  const { data: news } = useSWR(
    `${process.env.NEXT_PUBLIC_API_DEV}/api/news`,
    fetcher
  );

  const limitedData = news?.news?.slice(0, 3);

  if (error) return <div>Error loading brainstorming sessions.</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <>
      <div className="w-full min-h-screen py-8 grid grid-cols-1 md:grid-cols-12 gap-3 relative">
        {/* Left */}
        <div className='col-span-12 md:col-span-9 py-5'>
          <div className='p-4 bg-gray-200/30 dark:bg-[#333] mb-4 rounded shadow-lg shadow-gray-300 dark:shadow-gray-950/10'>
            <h1 className="text-lg md:text-xl font-medium mb-3">Topik Umum</h1>
            <p className='text-sm text-gray-500 dark:text-gray-300/80'>Ini adalah forum untuk diskusi seputar kegiatan sekolah, panduan, tips belajar, ekstrakurikuler, acara sekolah, dan topik lain yang berkaitan dengan SMK ICB secara umum. Jika Anda memiliki pertanyaan terkait kegiatan atau informasi yang tidak termasuk dalam kategori forum khusus, silakan gunakan forum ini untuk diskusi atau bertanya. Forum ini bukanlah tempat untuk konsultasi akademik atau tugas sekolah yang spesifik, melainkan wadah untuk berbagi informasi dan pengalaman yang bermanfaat bagi seluruh warga sekolah.</p>
          </div>
          <div className="flex flex-col w-full shadow-lg shadow-gray-300 dark:shadow-gray-950/10">
            <div className='w-full flex uppercase font-medium bg-lime-600 py-3 items-center justify-between px-8'>
              <h1 className='text-center text-white text-lg'>Diskusi Umum</h1>
            </div>
            {data.sessions.map((session) => (
              <div key={session?._id} >
                <div className='px-2 py-2 md:px-8 md:py-4 flex flex-col-reverse md:flex-row justify-between items-start gap-1 md:gap-4 border-b pb-3 border-gray-400 dark:border-gray-500 bg-gray-200/30 dark:bg-[#333] '>
                  <Link href={`/forum-diskusi/${session?._id}`} className='flex flex-col basis-auto w-full max-w-xl hover:underline '>
                    <h1 className='text-sm md:text-lg text-gray-700 dark:text-gray-200 font-medium'>{session?.title}</h1>
                    <p className='text-sm text-gray-500 dark:text-gray-300/80'>{session?.description}</p>
                    <div className='flex items-center gap-3 py-3'>

                      <span className={`${session?.status === "ongoing" ? "bg-lime-600" : "bg-red-500"} text-xs text-white px-2 py-0.5 rounded-full capitalize`}>{session?.status === "ongoing" ? "Sedang Berlangsung" : "Selesai"}</span>
                      <span className='bg-[#555] text-xs flex items-center text-white px-2 py-0.5 rounded-full capitalize'><GrFormView size={15} />{session?.views} orang</span>
                    </div>
                  </Link>
                  <div className='basis-1 flex flex-col-reverse md:flex-row gap-0 md:gap-6'>
                    <span className='text-sm text-gray-500 dark:text-gray-300/80 py-0.5 max-w-lg'>{moment(session?.createdAt).format("LLLL")}</span>
                    <p className='text-sm font-medium flex gap-1 text-gray-500 dark:text-gray-300/80 py-3'>
                      <FaUserCircle size={20} />
                      {session?.creator}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Right */}

        <div className='col-span-12 md:col-span-3 relative md:sticky top-0 md:top-36 w-full h-full md:h-96 bg-gray-200/30 dark:bg-[#333] p-5 rounded shadow-lg shadow-gray-300 dark:shadow-gray-950/10'>
          <h1 className='py-3 font-medium border-b mb-3 border-gray-400 dark:border-gray-500 text-gray-600 dark:text-gray-400'>BERITA TERBARU</h1>
          <div className='flex flex-col items-center gap-4 justify-center'>
            {limitedData.map((n, i) => (
              <Link href={`/berita/${n?.slug}`} key={i} className='flex gap-2 items-start py-2 hover:underline '>
                <Image src={n?.imageUrl} alt={n?.title} width={40} height={40} priority={true} className='rounded-full w-12 h-12 object-contain' />
                <h3 className='text-sm text-gray-700 dark:text-gray-200/80 '>{n?.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}