"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { formatCurrency } from "@/utils/formatCurrency";

const EditRiders = ({ params }) => {

  const router = useRouter();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [nik, setNik] = useState("");
  const [kis, setKis] = useState("");
  const [team, setTeam] = useState("");
  const [numberStart, setNumberStart] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [preview, setPreview] = useState("");
  const [raceClass, setRaceClass] = useState([]);
  const [isPayment, setIsPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getRiderById() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_PRO}/api/daftar/${params.id}`);
      const rider = await res.json();

      setName(rider?.name);
      setAddress(rider?.address);
      setPhone(rider?.phone);
      setNik(rider?.nik);
      setKis(rider?.kis);
      setTeam(rider?.team);
      setNumberStart(rider?.numberStart);
      setTotalPrice(rider?.totalPrice);
      setIsPayment(rider?.isPayment);
      setPreview(rider?.img);
      setRaceClass(rider?.raceClass);
    }
    getRiderById();
  }, [params.id]);

  // useEffect untuk menghitung totalPrice berdasarkan raceClass
  useEffect(() => {
    const newTotalPrice = raceClass.reduce((sum, cls) => sum + parseFloat(cls.price || 0), 0);
    setTotalPrice(newTotalPrice);
  }, [raceClass]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      let img = preview;
      const body = { name, address, kis, nik, phone, team, numberStart, totalPrice, raceClass, isPayment };
      if (img !== null) {
        body.img = img;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_PRO}/api/daftar/${params.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.status === 200) {
        const setTimeoutId = setTimeout(() => {
          toast.success(`${name} berhasil diperbaharui`);
          setLoading(false);
          router.push(`/dashboard/list-riders`);
        }, 3000);

        return () => clearTimeout(setTimeoutId);
      } else {
        toast.error(data.message);
        setLoading(false);
      }

    } catch (error) {
      toast.error("Ups something went wrong", error);
      setLoading(false);
    }
  };

  // Handle raceClass change
  const handleRaceClassChange = (index, field, value) => {
    const newRaceClass = [...raceClass];
    newRaceClass[index][field] = field === 'price' ? parseFloat(value) || 0 : value;
    setRaceClass(newRaceClass);
  };

  // const handleRaceClassChange = (index, field, value) => {
  //   const newRaceClass = [...raceClass];
  //   newRaceClass[index][field] = field === 'price' ? parseFloat(value) || 0 : value;
  //   setRaceClass(newRaceClass);
  // };

  return (
    <>
      <div className=" second dark:bg-slate-800 text-white">
        <h1 className="py-4 px-4">Edit Riders</h1>
      </div>
      <div className="w-full flex gap-4 py-8 px-4 ">
        <div className="flex flex-col w-full ">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white " />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Alamat</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white " />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">No.Handphone</label>
              <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white " />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">No.Identitas/NIK</label>
              <input type="number" value={nik} onChange={(e) => setNik(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white " />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">No.KIS</label>
              <input type="number" value={kis} onChange={(e) => setKis(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white " />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama Team</label>
              <input type="text" value={team} onChange={(e) => setTeam(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white " />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nomor Start</label>
              <input type="text" value={numberStart} onChange={(e) => setNumberStart(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white " />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Biaya Pendaftaran</label>
              <input type="text" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white " />
            </div>
            <div className="mb-5 flex flex-col gap-1 ">
              <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Status Pembayaran</label>
              <div className="border rounded-lg flex flex-col gap-3 border-gray-300 dark:border-gray-800 py-4 px-2">
                <label htmlFor="default-radio-1" className="flex gap-3">
                  <input
                    type="radio"
                    id="default-radio-1"
                    value="true"
                    name="isPayment"
                    onChange={(e) => setIsPayment(e.target.value)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  Valid
                </label>
                <label htmlFor="default-radio-2" className="flex gap-3">
                  <input
                    type="radio"
                    id="default-radio-2"
                    value="false"
                    name="isPayment"
                    onChange={(e) => setIsPayment(e.target.value)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  Tidak Valid
                </label>
              </div>
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Kelas Balap</label>
              {raceClass.map((cls, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={cls.name}
                    onChange={(e) => handleRaceClassChange(index, 'name', e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Nama Kelas"
                  />
                  <input
                    type="number"
                    value={cls.price}
                    onChange={(e) => handleRaceClassChange(index, 'price', e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Harga Kelas"
                  />
                  <button type="button" onClick={() => setRaceClass(raceClass.filter((_, i) => i !== index))} className="text-red-500">Hapus</button>
                </div>
              ))}
              <button type="button" onClick={() => setRaceClass([...raceClass, { name: '', price: '' }])} className="text-lime-500">Tambah Kelas</button>
            </div>
            <button type="submit" className="text-white bg-gradient-to-tr from-green-400 to-lime-500 hover:bg-gradient-to-tl hover:from-green-400 hover:to-lime-500 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ">
              {loading ? <div className="flex gap-2 items-center justify-center">
                <span className=" text-white">Loading... </span>
                <span className="loader"></span>
              </div> : "Simpan"}
            </button>
          </form>
        </div>
        {preview || preview === "" ?
          <div className="w-full">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-5">Bukti Pembayaran</h3>
            <Image src={preview} alt="bukti-pembayaran" width={350} height={350} priority={true} className="object-contain" />
          </div> :

          <div className="w-full">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-5">Pembayaran</h3>
            <p>Bayar Dilokasi sebesar {formatCurrency(totalPrice)} </p>
          </div>
        }


      </div>
    </>
  );
};

export default EditRiders;
