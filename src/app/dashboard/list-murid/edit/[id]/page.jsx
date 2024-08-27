"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

const EditStudents = ({ params }) => {

  const router = useRouter();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [school, setSchool] = useState("");
  const [ttl, setTtl] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentJob, setParentJob] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getStudentsById() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_PRO}/api/daftar/${params.id}`);
      const murid = await res.json();

      setName(murid?.name);
      setAddress(murid?.address);
      setPhone(murid?.phone);
      setTtl(murid?.ttl);
      setSchool(murid?.school);
      setParentName(murid?.parentName);
      setParentJob(murid?.parentJob);
      setPreview(murid?.img);
    }
    getStudentsById();
  }, [params.id]);



  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      let img = preview;
      const body = { name, address, phone, ttl, school, parentName, parentJob };
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
          router.push(`/dashboard/list-murid`);
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



  return (
    <>
      <div className=" second dark:bg-slate-800 text-white">
        <h1 className="py-4 px-4">Edit</h1>
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
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tempat Tanggal Lahir</label>
              <input type="text" value={ttl} onChange={(e) => setTtl(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white " />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">No.Handphone</label>
              <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white " />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sekolah Asal</label>
              <input type="text" value={school} onChange={(e) => setSchool(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white " />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama Orang Tua</label>
              <input type="text" value={parentName} onChange={(e) => setParentName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white " />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pekerjaan Orang Tua</label>
              <input type="text" value={parentJob} onChange={(e) => setParentJob(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white " />
            </div>
            <button type="submit" className="text-white bg-gradient-to-tr from-green-400 to-lime-500 hover:bg-gradient-to-tl hover:from-green-400 hover:to-lime-500 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ">
              {loading ? <div className="flex gap-2 items-center justify-center">
                <span className=" text-white">Loading... </span>
                <span className="loader"></span>
              </div> : "Simpan"}
            </button>
          </form>
        </div>
        {preview &&
          <div className="w-full">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-5">Foto Murid</h3>
            <Image src={preview} alt="foto-murid" width={350} height={350} priority={true} className="object-contain" />
          </div>
        }
      </div>
    </>
  );
};

export default EditStudents;
