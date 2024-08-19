"use client"

import { Bar } from 'react-chartjs-2';
import useSWR from 'swr';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors
} from 'chart.js';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '@/context/ThemeContext';
import { formatCurrency } from '@/utils/formatCurrency';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Colors);

const BarChart = () => {


  const { theme } = useContext(ThemeContext);
  const [sortData, setSortData] = useState([]);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_PRO}/api/daftar`, fetcher);

  useEffect(() => {
    if (data && data.riders) {
      const dataSort = data?.riders?.sort((a, b) => a.name.localeCompare(b.name))
      mutate();
      return setSortData(dataSort);
    }

  }, [data, mutate]);

  const chartData = {
    labels: sortData?.map(rider => rider.name),
    datasets: [
      {
        label: `Rp`,
        data: sortData?.map(item => item.totalPrice),
        backgroundColor: 'rgb(118,202,41)',
      },
    ],
  };

  const options = {

    plugins: {
      legend: {
        display: false, // Menyembunyikan legend
        labels: {
          color: 'white', // Warna font pada legend
        },
      },
      title: {
        display: true,
        text: `Total pendapatan yang masuk sebesar ${formatCurrency(sortData?.reduce((sum, rider) => sum + rider.totalPrice, 0))
          }`,
        color: `${theme === "light" ? '#797979' : '#c7c7c7'}`, // Warna font pada title
      },
    },

    scales: {
      x: {
        ticks: {
          color: `${theme === "light" ? '#797979' : '#c7c7c7'}`, // Warna font pada label sumbu X
        },
      },
      y: {
        ticks: {
          color: `${theme === "light" ? '#797979' : '#c7c7c7'}`, // Warna font pada label sumbu Y
        },
      },
    },
  };

  return (
    <div className='bg-gray-100 dark:bg-slate-800  px-6 py-4 w-full'>
      <Bar data={chartData} options={options} />
    </div>
  )
};

export default BarChart;