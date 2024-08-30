"use client"

import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";


const fetcher = (...args) => fetch(...args).then((res) => res.json());

const SectionTwo = () => {

  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_PRO}/api/news`,
    fetcher
  );

  const limitedData = data?.news?.slice(0, 3);

  if (error) return <div>Error loading data...</div>;
  if (!data) return <div className="w-full h-screen flex items-center justify-center ">Loading...</div>;

  return (
    <div className="max-w-full h-full w-full py-12 md:py-24 px-4 sm:px-12 md:px-20 lg:px-28 2xl:px-32 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-4">
        <div className="col-span-1 md:col-span-1 pr-0 md:pr-8 border-n md:border-r border-gray-600 ">
          <h1 className="text-lg sm:text-xl md:text-2xl font-medium mb-8">PROFILE SMK ICB CINTA NIAGA BANDUNG</h1>
          <Image src="/profile_.jpg" alt="foto-smk-icb" priority={true} width={1600} height={800} className="object-contain  py-4 w-full h-auto" />
          <p className="text-sm md:text-md leading-relaxed mb-6">
            SMK ICB Cinta Niaga Bandung adalah sekolah yang berdiri sejak tahun 1993, dibuat sebagai sekolah yang mendidik dan mengajar siswa berdasarkan nilai akademik, konsep dan metode belajar yang berkaitan dengan nilai akademik.
          </p>
          <Link
            href="/about"
            className="w-fit py-2 px-4 bg-black text-white rounded-md "
          >
            Tentang Kami
          </Link>
        </div>
        <div className=" col-span-1 md:col-span-1 pl-0 md:pl-8 h-full">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-lg sm:text-xl md:text-2xl font-medium border-b border-lime-500 pb-2">BERITA TERBARU</h1>
            <Link className="py-1 px-2 text-xs rounded bg-lime-500 shadow text-white" href="/news">Lihat Semua</Link>
          </div>
          {limitedData?.map((n, i) => (
            <Link className="flex flex-col md:flex-row items-start gap-6 mb-6 pb-6 border-b border-gray-600" href={`/berita/${n?.slug}`} key={i}>
              <div className="flex flex-col gap-2">
                <h1 className="text-lg md:text-xl dark:text-gray-300 font-medium">{n?.title}</h1>
                <p className="text-sm dark:text-gray-400">{n?.desc}</p>
              </div>
              <Image src={n?.imageUrl} alt={n?.title} width={1200} height={800} priority={true} className="object-contain w-full md:w-40 h-full" />
            </Link>
          ))}

        </div>
      </div>
    </div>
  )
}

export default SectionTwo;