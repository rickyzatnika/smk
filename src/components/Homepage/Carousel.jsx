"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";


const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Carousel = () => {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_DEV}/api/news`,
    fetcher
  );

  const limitedData = data?.news?.slice(0, 3);


  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  const delay = 10000;


  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setCurrentIndex((prevIndex) =>
          prevIndex === data?.news.length - 1 ? 0 : prevIndex + 1
        ),
      delay,

    );

    return () => {
      resetTimeout();
    };
  }, [currentIndex, data]);

  if (error) return <div className="w-full h-screen flex items-center justify-center">Error loading data...</div>;
  if (!data) return <div className="w-full h-screen flex items-center justify-center ">Loading...</div>;

  const scrollPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? data.news.length - 1 : prevIndex - 1
    );
  };

  const scrollNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === data.news.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>

      <div className="pt-24 px-4 sm:px-12 md:px-20 lg:px-28 2xl:px-32 bg-gradient-to-b relative">
        <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-t from-lime-300 to-green-500 z-10" />
        <div className="carousel-container relative overflow-hidden z-20">
          <div
            className="carousel-wrapper flex transition-transform duration-1000 ease-linear "
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              opacity: 1,
            }}
          >
            {limitedData?.map((n, i) => (
              <div
                key={i}
                className="carousel-slide min-w-full flex flex-col-reverse md:flex-row"
              >
                <div className="flex flex-col flex-1 px-2 py-4 md:py-20 md:px-4 gap-3">
                  <h1 className="text-lg md:text-2xl font-bold text-gray-50">{n?.title}</h1>
                  <p className="text-md md:text-lg leading-relaxed text-gray-100">{n?.desc}</p>
                  <Link
                    href={`/berita/${n?.slug}`}
                    className="text-sm w-fit py-2 px-4 bg-black text-gray-100 rounded-md mt-2 hover:scale-95 transition-all duration-150 ease-linear"
                  >
                    Selengkapnya
                  </Link>
                </div>
                <div className="relative flex-1 h-64 md:h-auto">
                  <Image
                    src={n?.imageUrl}
                    alt={n?.title || "News Image"}
                    width={1200}
                    height={800}
                    priority={true}
                    className="object-cover w-full h-full md:h-[75%] rounded-md"
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Navigation Buttons */}
          <div className="absolute left-1 bottom-24 hidden md:flex gap-4">
            <button onClick={scrollPrev} className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
              <IoIosArrowBack />
            </button>
            <button onClick={scrollNext} className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
              <IoIosArrowForward />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Carousel;
