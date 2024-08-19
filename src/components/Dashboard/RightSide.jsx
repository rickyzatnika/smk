// "use client"

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { IoIosArrowRoundForward } from "react-icons/io";
// import useSWR from "swr";

// const fetcher = (...args) => () => fetch(...args).then(res => res.json());


// const RightSide = () => {


//   const [unpaidCount, setUnpaidCount] = useState(0);
//   const [paidCount, setPaidCount] = useState(0);


//   const { data, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_PRO}/api/daftar`, fetcher)


//   useEffect(() => {
//     if (data && data.riders) {
//       const unpaidRiders = data?.riders?.filter((rider) => rider.isPayment === false);
//       const paidRiders = data?.riders?.filter((rider) => rider.isPayment === true);
//       setUnpaidCount(unpaidRiders?.length);
//       setPaidCount(paidRiders?.length);
//       mutate();
//     }
//   }, [data, mutate]);


//   return (
//     <div className='w-full h-screen px-4 flex flex-col gap-4 bg-gray-200/70 rounded-lg dark:bg-slate-900'>
//       <h3 className="py-3">Data Payment Validation :</h3>

//       <div className="bg-gray-100 flex flex-col gap-4 shadow-lg dark:bg-slate-800  px-3 py-8 rounded-lg">
//         <p className="text-red-400">Belum Valid :</p>
//         <p className="text-xl font-medium">{unpaidCount === 0 ? "-" : `${unpaidCount} Orang`}</p>
//         <div className="text-sm text-lime-500 ">
//           <Link href="/dashboard/list-riders" className="flex gap-1 items-center group">
//             <p>Lihat Detail</p>
//             <div className="relative right-0 transition-all duration-300 ease-in-out group-hover:-right-2">
//               <IoIosArrowRoundForward size={20} />
//             </div>
//           </Link>
//         </div>
//       </div>
//       <div className="bg-gray-100 flex flex-col gap-4 shadow-lg dark:bg-slate-800  px-3 py-8 rounded-lg">
//         <p className="">Sudah Valid :</p>
//         <p className="text-xl font-medium">{paidCount === 0 ? "-" : `${paidCount} Orang`} </p>
//         <div className="text-sm text-lime-500 ">
//           <Link href="/dashboard/list-riders" className="flex gap-1 items-center group">
//             <p>Lihat Detail</p>
//             <div className="relative right-0 transition-all duration-300 ease-in-out group-hover:-right-2">
//               <IoIosArrowRoundForward size={20} />
//             </div>
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default RightSide;
"use client"

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import useSWR from "swr";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { ThemeContext } from "@/context/ThemeContext";

Chart.register(ArcElement, Tooltip, Legend);

const fetcher = (...args) => () => fetch(...args).then(res => res.json());

const RightSide = () => {
  const [unpaidCount, setUnpaidCount] = useState(0);
  const [paidCount, setPaidCount] = useState(0);
  const { data, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_PRO}/api/daftar`, fetcher);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (data && data.riders) {
      const unpaidRiders = data?.riders?.filter((rider) => rider.isPayment === false);
      const paidRiders = data?.riders?.filter((rider) => rider.isPayment === true);
      setUnpaidCount(unpaidRiders?.length);
      setPaidCount(paidRiders?.length);
      mutate();
    }
  }, [data, mutate]);

  const chartData = {
    labels: ['Belum Valid', 'Sudah Valid'],
    datasets: [
      {
        data: [unpaidCount, paidCount],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };
  const options = {

    plugins: {
      legend: {
        display: true, // Menyembunyikan legend
        labels: {
          color: `${theme === "light" ? '#797979' : '#c7c7c7'}`, // Warna font pada title
        },
      },
    },
  };


  return (
    <div className='w-full h-screen px-4 flex flex-col gap-4 bg-gray-200/70 rounded-lg dark:bg-slate-900'>
      <h3 className="py-3 text-center">Data Payment Validation</h3>

      <div className="bg-gray-100 flex flex-col gap-4 shadow-lg dark:bg-slate-800 px-3 py-8 rounded-lg">
        <Doughnut data={chartData} options={options} />
      </div>

      <div className="text-sm text-lime-500 mt-4">
        <Link href="/dashboard/list-riders" className="flex gap-1 items-center group">
          <p>Lihat Detail</p>
          <div className="relative right-0 transition-all duration-300 ease-in-out group-hover:-right-2">
            <IoIosArrowRoundForward size={20} />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default RightSide;