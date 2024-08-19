"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";

const FormAddClass = ({ setShowModal }) => {
  const [title, setTitle] = useState("");
  const [classes, setClasses] = useState([{ name: "", price: 0 }]);
  const [loading, setLoading] = useState(false);

  // fetch user data use SWR
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_PRO}/api/raceClasses`, fetcher);


  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const newClasses = [...classes];
    newClasses[index][name] = value;
    setClasses(newClasses);
  };

  const handleAddClass = () => {
    setClasses([...classes, { name: "", price: 0 }]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = { title, classes };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_PRO}/api/raceClasses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const errorData = await res.json();

      if (res.status === 201) {

        const timeoutId = setTimeout(() => {
          setLoading(false);
          setShowModal(false);
          toast.success(`Kelas ditambahkan`);
          mutate();
        }, 3000);
        return () => clearTimeout(timeoutId);
      } else {
        toast.error(errorData.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div tabIndex="-1" aria-hidden="true" className="overflow-y-auto  mx-auto fixed top-0 right-0 bg-black/40 backdrop-blur-sm z-50 justify-center  items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div className="relative p-4 w-full mx-auto max-w-xl max-h-full">
          {/* <!-- Modal content --> */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Buat Kelas
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => setShowModal(false)}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* <!-- Modal body --> */}
            <form onSubmit={handleSubmit} className="p-4 md:p-5">
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label
                    htmlFor="title"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Title
                  </label>
                  <input
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    type="text"
                    name="title"
                    id="title"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Judul Kelas"
                    required
                  />
                </div>
                {classes.map((classItem, index) => (
                  <div key={index}>
                    <div className="col-span-2 sm:col-span-1">
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Name:
                        <input
                          type="text"
                          name="name"
                          value={classItem.name}
                          onChange={(e) => handleChange(index, e)}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"

                        />
                      </label>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Price:
                        <input
                          type="number"
                          name="price"
                          value={classItem.price}
                          onChange={(e) => handleChange(index, e)}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        />
                      </label>
                    </div>
                  </div>
                ))}
                <button className="w-max h-max m-auto py-2 px-4 second rounded-xl text-white" type="button" onClick={handleAddClass}>
                  <span className="flex items-center justify-center">
                    <svg
                      className="me-1 -ms-1 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Tambah
                  </span>
                </button>
              </div>
              <button type="submit" className="text-white inline-flex items-center bg-gradient-to-tr from-green-400 to-lime-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                {loading ?
                  <div className="flex gap-2 items-center justify-center">
                    <span className=" text-white">Loading... </span>
                    <span className="loader"></span>
                  </div> : "Simpan"
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormAddClass;


