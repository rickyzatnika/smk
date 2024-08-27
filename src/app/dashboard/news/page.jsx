"use client"

import { useEffect, useState } from "react";
import useSWR from "swr";
import Link from "next/link";

const fetcher = (...args) => fetch(...args).then(res => res.json());

const EventPage = () => {

  const [noData, setNodata] = useState(false);
  const [events, setEvents] = useState([]);

  const { data, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_PRO}/api/news`, fetcher);


  useEffect(() => {
    if (data && data.news) {
      setEvents(data);
      mutate()
    }
  }, [data, mutate])

  return (
    <div className=''>
      <div className="w-full flex items-center justify-between border-b border-gray-400 dark:border-gray-800 pb-5">
        <Link
          prefetch={false}
          href="/dashboard/news/add-news"
          className="second dark:bg-slate-800 text-gray-50 py-2 px-5 rounded shadow-lg">
          Add News
        </Link>
        <div>
          {events.length} Event
        </div>
      </div>

    </div>
  )
}

export default EventPage