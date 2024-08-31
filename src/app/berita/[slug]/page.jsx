import Image from 'next/image';
import React from 'react'
import axios from 'axios';
import moment from 'moment';
import SchoolInfo from '@/components/SchoolInfo';



const getEvent = async (slug) => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_PRO}/api/news/${slug}`);
  const data = await res.data;
  return data;
};


const DetailsEvent = async ({ params }) => {

  const news = await getEvent(params?.slug);

  return (
    <>
      <div className='w-full grid grid-cols-1 md:grid-cols-12 py-6 sm:py-14 gap-4 md:gap-8 '>
        {/* Left */}
        <div className="col-span-12 md:col-span-8">
          <div className='relative flex  justify-center flex-col gap-3 '>
            <h1 className='text-xl sm:text-3xl lg:text-5xl font-bold leading-relaxed tracking-wide'>{news?.title}</h1>
            <div className='relative w-full h-full my-2 sm:my-6'>
              <Image src={news?.imageUrl} width={600} height={600} style={{ width: "100%", height: "100%" }} priority={true} className='object-contain' alt={news?.title} />
              <div className="flex flex-col md:flex-row items-start gap-2 md:gap-0 md:items-center justify-between w-full px-0 md:px-2 pt-2">
                <div className="flex items-center gap-1 ">
                  <span className="text-xs text-gray-500 dark:text-gray-200" >Di posting :</span>
                  <span className="text-xs px-2 py-0.5 rounded-full text-gray-500 bg-slate-200 shadow dark:bg-slate-700 dark:text-gray-200 w-fit">{moment(news?.createdAt).format('ll')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500 dark:text-gray-200" >Kategori :</span>
                  <span className="text-xs px-2 py-0.5 rounded-full text-gray-500 bg-slate-200 shadow dark:bg-slate-700 dark:text-gray-200 w-fit">{news?.category}</span>
                </div>
              </div>
            </div>
            <p className='text-md font-medium text-gray-600 dark:text-gray-400'>{news?.desc}</p>
            <div className='leading-relaxed text-sm text-gray-600 dark:text-gray-400' dangerouslySetInnerHTML={{ __html: news?.content }} />
          </div>
        </div>

        {/* Right */}
        <div className='col-span-12 md:col-span-4 relative h-full md:sticky md:h-max top-0 md:top-28 rounded shadow-lg bg-white dark:bg-[#2D3036] shadow-gray-300 dark:shadow-[#111]/40 p-2 md:p-5'>
          <SchoolInfo />
        </div>
      </div>
    </>
  )
}

export default DetailsEvent;