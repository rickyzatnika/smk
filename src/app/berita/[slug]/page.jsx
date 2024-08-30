import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import axios from 'axios';
import moment from 'moment';


const getEvent = async (slug) => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_PRO}/api/news/${slug}`);
  const data = await res.data;
  return data;
};


const DetailsEvent = async ({ params }) => {

  const news = await getEvent(params?.slug);

  return (
    <div className='w-full max-w-4xl mx-auto relative flex  justify-center flex-col gap-3 py-6 sm:py-14  '>
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
      <p className='text-md font-medium'>{news?.desc}</p>
      <div className='leading-relaxed text-sm text-gray-600 dark:text-gray-400' dangerouslySetInnerHTML={{ __html: news?.content }} />
    </div>
  )
}

export default DetailsEvent;