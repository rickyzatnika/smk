"use client";

import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SiMicrosoftexcel } from "react-icons/si";
import { GrDocumentPdf, GrEdit } from "react-icons/gr";
import { RiDeleteBin6Fill } from "react-icons/ri";
import Link from "next/link";
import { toast } from "react-toastify";
import useSWR from "swr";

const TABLE_HEAD = [
  "No",
  "Nama",
  "Alamat",
  "No.Handphone",
  "No.KIS",
  "No.Identitas/NIK",
  "Nama Team",
  "Nomor Start",
  "Kelas Yang diikuti",
  "Bukti Transfer",
  "Biaya Pendaftaran",
  "Status Pembayaran",
  "Action",
];

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const TableRiders = () => {
  const [showImage, setShowImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [riders, setRiders] = useState([]);
  const [noData, setNoData] = useState(false);
  const [showModalPayment, setShowModalPayment] = useState(false);
  const [riderName, setRiderName] = useState("");
  const [riderStatus, setRiderStatus] = useState("");
  const [riderId, setRiderId] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  // FOR PAGINATION
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  // const [totalItems, setTotalItems] = useState(0);
  // const limit = 10;
  // data fetching useSWR
  // const { data, mutate } = useSWR(
  //   `${process.env.NEXT_PUBLIC_API_DEV}/api/daftar?q=${searchQuery}&page=${currentPage}&limit=10`,
  //   fetcher
  // );

  const { data, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_PRO}/api/daftar?q=${searchQuery}`,
    fetcher
  );

  const [datas, setDatas] = useState(data);

  useEffect(() => {
    if (data && data.riders) {
      const sortedData = data?.riders?.sort((a, b) => a.name.localeCompare(b.name));
      if (searchQuery.length === 0 || searchQuery.length > 2) {
        setRiders(sortedData);
        mutate();
      }

      setNoData(sortedData.length === 0);
    } else {
      setNoData(true);
    }
  }, [data, mutate, searchQuery]);

  // FOR PAGINATION
  // const handlePageChange = (newPage) => {
  //   if (newPage >= 1 && newPage <= totalPages) {
  //     setCurrentPage(newPage);
  //   }
  // };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);

  };


  const handleImageClick = (imgSrc, name, totalPrice) => {
    setSelectedImage(imgSrc);
    setShowImage(true);
    setRiderName(name);
    setTotalPrice(totalPrice)
  };

  const exportPDF = async () => {
    try {
      const response = await fetch(`/api/daftar/export-pdf`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "riders.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };

  const exportExcel = async () => {
    try {
      const response = await fetch(`/api/daftar/export-excel`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "riders.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error exporting Excel:", error);
    }
  };

  const handleShowModal = (id) => {
    setDeleteId(id); // Menyimpan ID yang akan dihapus
    setShowModal(true);
  };


  const handleModalPayment = (id, status, name) => {
    setShowModalPayment((prev) => !prev);
    setRiderId(id);
    setRiderStatus(status);
    setRiderName(name);
  }


  const handleUpdatePaymentStatus = async (riderId, riderStatus, riderName) => {

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_PRO}/api/daftar/status/${riderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isPayment: riderStatus }),
        }
      );

      // Update state locally
      if (res.status === 200) {
        setDatas((prevData) =>
          prevData?.riders?.map((rider) =>
            rider?._id === riderId ? { ...rider, isPayment: riderStatus } : rider
          )
        );
        toast.success(`Status Pembayaran ${riderName} diperbarui`);
        mutate(); // Memuat ulang data
        setShowModalPayment(false);
      } else {
        toast.error(`Gagal memperbarui status pembayaran ${riderName}`);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memperbarui status pembayaran");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return; // Jika tidak ada ID yang diset, tidak lakukan apa-apa

    try {
      // Cari nama rider yang akan dihapus dari state
      const riderToDelete = riders.find((rider) => rider._id === deleteId);
      const riderName = riderToDelete ? riderToDelete.name : "Rider";

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_PRO}/api/daftar/${deleteId}`,
        {
          method: "DELETE",
        }
      );

      if (res.status === 200) {
        toast.success(`${riderName} dihapus`);
        setShowModal(false);
        // Perbarui state riders jika diperlukan
        setRiders((prevRiders) =>
          prevRiders.filter((rider) => rider._id !== deleteId)
        );
        mutate(); // Memuat ulang data
      } else {
        toast.error("Gagal menghapus rider");
      }
    } catch (error) {
      toast.error("Ups, sesuatu yang salah");
    }
  };

  return (
    <>
      {showImage && selectedImage && (
        <div className="fixed backdrop-blur bg-black/70 z-50 top-0 bottom-0 left-0 right-0 w-full h-full ">
          <div className=" text-gray-100 flex flex-col gap-3 p-8">
            <h3 className="text-sm">Bukti Transfer : {riderName}</h3>
            <h3 className="text-sm">Total Pembayaran : {formatCurrency(totalPrice)}</h3>
          </div>
          <button
            type="button"
            className=" w-full py-3 h-full"
            onClick={() => setShowImage(false)}
          >
            <Image
              src={selectedImage}
              alt="bukti-transfer"
              fill={true}
              sizes="100%" // Sesuaikan ukuran modal
              className="object-contain"
              blurDataURL={selectedImage}
              loading="lazy"
            />
          </button>
        </div>
      )}
      <div className="w-full flex items-center justify-between border-b border-gray-400 dark:border-gray-800 pb-1.5">
        <div className="flex flex-col items-start">
          <h1 className="text-lg font-semibold antialiased ">DAFTAR RIDERS</h1>
          {noData ? (
            <h3 className="w-full  font-medium text-sm">
              Belum ada data yang masuk...
            </h3>
          ) : (
            <div className="flex gap-2 items-center">
              <h2 className="text-sm antialiased ">Total Riders :</h2>
              <p className="text-sm antialiased">{riders?.length} Orang</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-6">
          <form className=" max-w-xs ">
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
                placeholder="Cari Nama Riders"
              />
            </div>
          </form>
          <div className="flex flex-col items-center justify-center">
            <div className="flex gap-1 relative">
              <button
                className="group hover:text-gray-300  second dark:bg-slate-800 p-2 rounded  text-red-500"
                onClick={exportPDF}
              >
                <GrDocumentPdf size={18} />
                <span className="hidden w-max  group-hover:block absolute -top-3 -left-16 rounded py-0.5 px-1 text-xs second text-gray-50">
                  Export To PDF
                </span>
              </button>
              <button
                className="group hover:text-gray-300  second dark:bg-slate-800 p-2 rounded  text-green-500"
                onClick={exportExcel}
              >
                <SiMicrosoftexcel size={18} />
                <span className="hidden w-max group-hover:block absolute -top-3 -left-10 rounded py-0.5 px-1 text-xs second text-gray-50">
                  Export To Excel
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md ">
        <table className="w-full table-auto text-left rtl:text-right text-gray-500 dark:text-gray-300">
          <thead className="text-sm uppercase second text-gray-100 dark:bg-gray-700 dark:text-gray-300">
            <tr className="">
              {TABLE_HEAD.map((head) => (
                <th key={head} className="px-6 py-3">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {riders?.map((rider, i) => (
              <tr
                key={rider?._id}
                className="bg-white text-sm font-medium border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4 capitalize antialiased leading-relaxed">
                  {i + 1}.
                </td>
                <td className="px-6 py-4 capitalize antialiased leading-relaxed">
                  <p className="w-32">{rider?.name}</p>
                </td>
                <td className="px-6 py-4 capitalize antialiased leading-relaxed">
                  <p className="w-52">{rider?.address}</p>
                </td>
                <td className="px-6 py-4 capitalize antialiased leading-relaxed">
                  {rider?.phone}
                </td>
                <td className="px-6 py-4 capitalize antialiased leading-relaxed">
                  {rider?.kis}
                </td>
                <td className="px-6 py-4 capitalize antialiased leading-relaxed">
                  {rider?.nik}
                </td>
                <td className="px-6 py-4 capitalize antialiased leading-relaxed">
                  <p className="w-32">{rider?.team}</p>
                </td>
                <td className="px-6 py-4 capitalize antialiased leading-relaxed">
                  {rider?.numberStart}
                </td>
                <td className="px-6 py-4 capitalize antialiased leading-relaxed ">
                  <p className="w-64">
                    {rider?.raceClass.map((cls) => `${cls?.name}`).join(", ")}
                  </p>
                </td>
                <td className="px-6 py-4 text-center flex items-center justify-center flex-col gap-2 ">
                  {!rider?.img || rider?.img === "" ? (
                    <div className="w-max px-3 py-4 antialiased">
                      Bayar dilokasi
                    </div>
                  ) : (
                    <button
                      className="w-fit my-4 text-sm second mx-auto antialiased text-gray-300 py-1 px-1.5 rounded"
                      onClick={() => handleImageClick(rider?.img, rider?.name, rider?.totalPrice)}
                      type="button"
                    >
                      Lihat Gambar
                    </button>
                  )}
                </td>
                <td className="px-6 py-4 capitalize antialiased leading-relaxed">
                  {formatCurrency(rider?.totalPrice)}
                </td>
                <td
                  onClick={() => handleModalPayment(rider?._id, !rider?.isPayment, rider?.name)}
                  className={`w-full relative px-1 py-4 flex flex-col items-center justify-center  capitalize antialiased leading-relaxed  ${rider?.isPayment
                    ? "bg-green-500 text-gray-50 cursor-pointer"
                    : "text-red-400 cursor-pointer"
                    }`}
                >
                  {rider?.isPayment === false ? (
                    <>
                      <p>(belum valid) </p>
                      <span className="text-[0.70rem]">
                        klik untuk validasi
                      </span>
                    </>
                  ) : (
                    "Valid"
                  )}
                </td>
                <td className="px-6 py-4 ">
                  <div className="flex gap-4 items-center justify-center">
                    <Link className="relative group" href={`/dashboard/list-riders/edit/${rider?._id}`}>
                      <span className="hidden group-hover:block z-10 absolute -top-3 -left-8 text-xs second text-white py-0.5 px-2 rounded-full">edit</span>
                      <GrEdit className="group-hover:rotate-45 group-hover:text-green-400 transition-all duration-100" size={20} />
                    </Link>
                    <button className="relative group" onClick={() => handleShowModal(rider?._id)}>
                      <span className="hidden group-hover:block z-10 absolute -top-3 -left-8 text-xs second text-white py-0.5 px-2 rounded-full">hapus</span>
                      <RiDeleteBin6Fill className="group-hover:rotate-45 group-hover:text-red-400 transition-all duration-100" size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/*FOR PAGINATION */}
        {/* <div className="flex items-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
          >
            Previous
          </button>
          <span>{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
          >
            Next
          </button>
        </div> */}
        {showModal && deleteId && (
          <div className="fixed top-0 left-0 w-full h-screen shadow-lg z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-gray-100 dark:bg-slate-800 py-8 px-6 rounded shadow-lg shadow-gray-600 dark:shadow-slate-950">
              <p className="text-lg py-2 antialiased">
                Anda yakin ingin menghapus Rider <br />
                {riders.find((r) => r._id === deleteId)?.name} ?
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
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
        {showModalPayment && (
          <div className="fixed top-0 left-0 w-full h-screen shadow-lg z-50 bg-black/50 backdrop-blur flex items-center justify-center">
            <div className="bg-gray-100 dark:bg-slate-800 py-8 px-6 rounded shadow-lg shadow-gray-600 dark:shadow-slate-950">
              <p className="text-lg py-2 antialiased">
                Konfirmasi Status Pembayaran {riders.find((r) => r._id === riderId)?.name} ?
              </p>
              <div className="flex gap-3 pt-6">
                <button
                  className="py-1.5 px-4 text-white/90 bg-gradient-to-tr rounded from-green-400 to-lime-500 hover:bg-gradient-to-tl hover:from-green-400 hover:to-lime-500"
                  onClick={() => handleUpdatePaymentStatus(riderId, riderStatus, riderName)}
                >
                  Ya, Update
                </button>
                <button
                  className="py-1.5 px-4 text-white/90 bg-red-500 hover:bg-red-600 rounded"
                  onClick={() => setShowModalPayment(false)}>
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default TableRiders;
