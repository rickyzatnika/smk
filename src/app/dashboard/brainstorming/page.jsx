"use client"

import FormAddBrainstorming from "@/components/Dashboard/FormAddBrainstorming";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GrEdit } from "react-icons/gr";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import useSWR from "swr";



const TABLE_HEAD = [
  "No",
  "Judul",
  "Status",
  "Peserta",
  "Dibuat Oleh",
  "Action",
];

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const BrainstormingPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [brainstorming, setBrainstorming] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");


  const { data, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_PRO}/api/brainstorming?q=${searchQuery}`,
    fetcher
  );


  useEffect(() => {
    if (data && data.sessions) {
      console.log(data.sessions);
      const sortedData = data?.sessions?.sort((a, b) => a.title.localeCompare(b.title));
      if (searchQuery.length === 0 || searchQuery.length > 2) {
        setBrainstorming(sortedData);
      }
      mutate();
    }
  }, [data, mutate, searchQuery]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };


  const handleShowModal = (id) => {
    setDeleteId(id); // Menyimpan ID yang akan dihapus
    setShowDeleteModal(true);
  }

  const handleDelete = async () => {
    if (!deleteId) return; // Jika tidak ada ID yang diset, tidak lakukan apa-apa

    try {
      // Cari nama rider yang akan dihapus dari state
      const brainToDelete = brainstorming.find((b) => b._id === deleteId);
      const brainName = brainToDelete ? brainToDelete?.title : "Brainstorming";

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_PRO}/api/brainstorming/${deleteId}`,
        {
          method: "DELETE",
        }
      );

      if (res.status === 200) {
        toast.success(`${brainName} dihapus`);
        setShowDeleteModal(false);
        // Perbarui state riders jika diperlukan
        setBrainstorming((prevBrains) =>
          prevBrains.filter((b) => b._id !== deleteId)
        );
        mutate(); // Memuat ulang data
      } else {
        toast.error("Gagal menghapus");
      }
    } catch (error) {
      toast.error("Ups, sesuatu yang salah");
    }
  };


  return (
    <>
      {showModal && (
        <FormAddBrainstorming setShowModal={setShowModal} />
      )}
      <div className="">
        <div className='w-full flex items-center justify-between border-gray-400 dark:border-gray-800 border-b pb-3'>
          <div className="w-full flex items-center gap-2">
            <button
              onClick={() => setShowModal((prev) => !prev)}
              className="second dark:bg-slate-800 text-gray-50 py-2 px-5 rounded shadow-lg"
              type="button"
            >
              Add Brainstorming
            </button>
          </div>
          <div className="w-96 flex items-center justify-center gap-2">
            <form className=" w-full ">
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4  text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  onChange={handleSearch}
                  type="search"
                  id="default-search"
                  className="block text-xs w-full p-4 ps-10 placeholder:text-xs text-gray-700 border border-gray-300 rounded-lg bg-gray-50 focus:ring-lime-500 focus:border-lime-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-400 dark:focus:border-gray-400"
                  placeholder="Search..."
                />
              </div>
            </form>
          </div>
        </div>
        {/* BRAINSTORMING PAGE / FETCHING DATA */}

        <div className="relative overflow-x-auto shadow-md ">
          <table className="w-full table-auto text-left rtl:text-right text-gray-500 dark:text-gray-300">
            <thead className="text-sm uppercase second text-gray-100 dark:bg-gray-700 dark:text-gray-300">
              <tr className="">
                {TABLE_HEAD.map((head) => (
                  <th key={head} className="px-6 py-3 ">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {brainstorming?.map((b, i) => (
                <tr
                  key={b?._id}
                  className="bg-white text-sm font-medium border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="px-6 py-4 capitalize antialiased leading-relaxed">
                    {i + 1}.
                  </td>
                  <td className="px-6 py-4 capitalize antialiased leading-relaxed">
                    {b?.title}
                  </td>
                  <td className="px-6 py-4 capitalize antialiased leading-relaxed">
                    {b?.status === "ongoing" ? "Sedang Berlangsung" : "Selesai"}
                  </td>
                  <td className="px-6 py-4 flex capitalize antialiased leading-relaxed">
                    {`${!b?.participants || b?.participants == [] ? <p>belum ada</p> : b?.participants?.length} Peserta`}
                  </td>
                  <td className="px-4 py-4 capitalize antialiased leading-relaxed">
                    {b?.creator}
                  </td>
                  <td className="px-6 py-4 ">
                    <div className="flex gap-4 items-center justify-center">
                      <Link className="relative group" href={`/dashboard/brainstorming/edit/${b?._id}`}>
                        <span className="hidden group-hover:block z-10 absolute -top-3 -left-8 text-xs second text-white py-0.5 px-2 rounded-full">edit</span>
                        <GrEdit className="group-hover:rotate-45 group-hover:text-green-400 transition-all duration-100" size={20} />
                      </Link>
                      <button className="relative group" onClick={() => handleShowModal(b?._id)}>
                        <span className="hidden group-hover:block z-10 absolute -top-3 -left-8 text-xs second text-white py-0.5 px-2 rounded-full">hapus</span>
                        <RiDeleteBin6Fill className="group-hover:rotate-45 group-hover:text-red-400 transition-all duration-100" size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showDeleteModal && deleteId && (
            <div className="fixed top-0 left-0 w-full h-screen shadow-lg z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-gray-100 dark:bg-slate-800 py-8 px-6 rounded shadow-lg shadow-gray-600 dark:shadow-slate-950">
                <p className="text-lg py-2 antialiased">
                  Anda yakin ingin menghapus  <br />
                  {brainstorming?.find((r) => r._id === deleteId)?.title} ?
                </p>
                <div className="flex gap-3 pt-6">
                  <button
                    className="py-1.5 px-4 text-white/90 bg-gradient-to-tr rounded from-green-400 to-lime-500 hover:bg-gradient-to-tl hover:from-green-400 hover:to-lime-500"
                    onClick={handleDelete}
                  >
                    Ya, Hapus
                  </button>
                  <button
                    className="py-1.5 px-4 text-white/90 bg-red-500 hover:bg-red-600 rounded"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          )}


        </div>
      </div>
    </>
  )
}

export default BrainstormingPage;