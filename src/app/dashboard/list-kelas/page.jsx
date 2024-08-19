"use client"
import FormAddClass from "@/components/Dashboard/FormAddClass";
import { formatCurrency } from "@/utils/formatCurrency";
import useSWR from "swr";
import React, { useState } from "react";
import { RiDeleteBin2Line } from "react-icons/ri";
import { toast } from "react-toastify";


const TABLE_HEAD = ["Kelas", "", "Action"];

const TableListClass = () => {
  const [showModal, setShowModal] = useState(false);


  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, error, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_PRO}/api/raceClasses`, fetcher);


  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/raceClasses/${id}`, {
        'method': "DELETE",
      });

      if (res.status === 200) {
        toast.success("Kelas berhasil dihapus");
      }
    } catch (error) {
      toast.error("Maaf sepertinya ada kesalahan pada server.", error);
    }
    mutate();
  };

  if (error) {
    return <p className="text-gray-700 dark:text-gray-300">Error fetching data</p>
  }


  return (
    <>
      <div className="w-full flex items-center justify-between border-b border-gray-400 dark:border-gray-800 pb-5">

        <button onClick={() => setShowModal(prev => !prev)} className="py-2 px-5 second dark:bg-slate-800 text-gray-50 dark:text-gray-100 rounded shadow-lg " type="button">
          Buat Kelas
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md my-8 ">
        {showModal &&
          <FormAddClass setShowModal={setShowModal} />
        }
        <table className="w-full table-auto text-left ">
          <thead className="text-md uppercase ">
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="px-6 py-4 second dark:bg-slate-900 text-gray-50">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((list) => (
              <React.Fragment key={list?._id}>
                <tr className="bg-gray-200 dark:bg-slate-700  ">
                  <td className="px-6 border-b text-gray-700 dark:text-slate-100 border-gray-300 dark:border-gray-500 text-sm py-2 uppercase font-semibold">
                    {list?.title}
                  </td>
                  <td className=" px-6 py-4 border-b border-gray-300 dark:border-gray-500 font-medium uppercase text-sm">Harga</td>
                  <td className="px-10 py-4 border-b border-gray-300 dark:border-gray-500">
                    <button className="relative group" onClick={() => handleDelete(list?._id)}><RiDeleteBin2Line className="hover:text-red-500" size={24} />
                      <span className="absolute top-0 -right-14 bg-slate-900 text-gray-50 dark:bg-gray-50 rounded-full py-0.5 px-2 text-xs hidden font-medium dark:text-red-500 group-hover:block"> delete</span>
                    </button>
                  </td>
                </tr>
                {list?.classes?.map((cls) => (
                  <tr key={cls?.name} className="bg-gray-100 dark:bg-slate-600 border-b border-gray-300 dark:border-gray-500 ">
                    <td className="px-8  py-4 text-sm font-medium text-gray-500/80 dark:text-slate-300/80 uppercase ">{cls?.name}</td>
                    <td className="px-6  py-4 text-sm font-medium text-gray-500/80 dark:text-slate-300/80">{formatCurrency(cls?.price)}</td>
                    {/* Anda bisa menambahkan kolom kosong jika ingin menyelaraskan dengan kolom tombol aksi */}
                    <td className="px-6 py-4"></td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>


    </>
  );
};

export default TableListClass;

