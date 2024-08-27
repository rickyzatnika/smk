"use client"

import { toast } from "react-toastify";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import useSWR from "swr";


const fetcher = (...args) => fetch(...args).then((res) => res.json());

const FormAddBrainstorming = ({ setShowModal }) => {


  const { mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_PRO}/api/brainstorming`,
    fetcher
  );

  const [loading, setLoading] = useState(false);


  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const title = e.target[0].value;
    const description = e.target[1].value;
    const creator = e.target[2].value;

    if (!title || !description || !creator) {
      toast.error("field required!");
      setLoading(false);
      return;
    }

    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_PRO}/api/brainstorming`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, creator }),
      });

      const errorData = await res.json();

      if (res.status === 201) {

        const timeoutId = setTimeout(() => {
          setLoading(false);
          setShowModal(false);
          toast.success(`Brainstorming berhasil dibuat`);
          mutate();
        }, 3000);
        return () => clearTimeout(timeoutId);
      } else {
        toast.error(errorData.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <>

      <div className="fixed w-full top-0 left-0 right-0 h-screen z-50 bg-black/20 backdrop-blur-sm">
        <div className="max-w-xl mx-auto rounded-xl shadow-xl bg-white mt-14 py-8 relative">

          <div className="flex items-center justify-between px-8">
            <h3 className="text-lg text-gray-700 font-medium antialiased -tracking-wide">Buat Topik Pembahasan</h3>
            <button onClick={() => setShowModal(false)} className=" text-sm p-1 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-800 font-medium">
              <IoMdClose size={22} />
            </button>
          </div>
          <form
            onSubmit={handleRegister}
            className="w-full flex py-8 max-w-lg mx-auto flex-col gap-4"
          >
            <input
              type="text"
              placeholder="Judul"
              name="title"
              required
              className="placeholder:text-sm placeholder:text-gray-400/80 px-4 py-3 rounded  w-full border-gray-300 border-2 bg-transparent text-zinc-500 outline-none  focus:outline-none focus:ring-0 focus:border-2   focus:border-green-400"
            />
            <input
              type="text"
              placeholder="Deskripsi"
              name="description"
              required
              className="placeholder:text-sm placeholder:text-gray-400/80 px-4 py-3 rounded  w-full border-gray-300 border-2 bg-transparent text-zinc-500 outline-none  focus:outline-none focus:ring-0 focus:border-2   focus:border-green-400"
            />

            <input
              type="text"
              placeholder="Creator"
              name="creator"
              required
              className="placeholder:text-sm placeholder:text-gray-400/80 px-4 py-3 rounded  w-full border-gray-300 border-2 bg-transparent text-zinc-500 outline-none  focus:outline-none focus:ring-0 focus:border-2   focus:border-green-400"
            />

            <button className="px-4 py-3 rounded uppercase transition-all duration-150 ease-linear bg-gradient-to-tr from-green-500 to-lime-400 text-slate-100 hover:bg-green-500 hover:text-white" type="submit">
              {loading ? <div className="flex gap-2 items-center justify-center">
                <span className=" text-white">Loading... </span>
                <span className="loader"></span>
              </div> : "Submit"}
            </button>
          </form>
        </div>
      </div>

    </>

  );
};

export default FormAddBrainstorming;
