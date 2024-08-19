"use client";
import useSWR from "swr";
import React, { useEffect, useState } from "react";
import { RiDeleteBin2Line } from "react-icons/ri";
import { toast } from "react-toastify";
import FormAddUser from "@/components/Dashboard/FormAddUser";

const TABLE_HEAD = ["No", "Nama", "No.Handphone", "Role", "Action"];

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const UserPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [users, setUsers] = useState([]);


  const { data, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_PRO}/api/user`, fetcher);

  useEffect(() => {
    if (data) {
      // Mengurutkan data hanya jika data ada
      const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
      setUsers(sortedData);
      mutate(); // Update data
    }

  }, [data, mutate]);


  const handleShowModal = (id) => {
    setDeleteId(id); // Menyimpan ID yang akan dihapus
    setShowDeleteModal(true);
  }

  const handleDelete = async () => {
    if (!deleteId) return; // Jika tidak ada ID yang diset, tidak lakukan apa-apa

    try {
      // Cari nama rider yang akan dihapus dari state
      const userToDelete = users.find(user => user._id === deleteId);
      const userName = userToDelete ? userToDelete.name : "User";

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_PRO}/api/user/${deleteId}`, {
        method: "DELETE",
      });

      const errorData = await res.json();

      if (res.status === 200) {
        toast.success(`${userName} dihapus`);
        setShowDeleteModal(false);
        // Perbarui state riders jika diperlukan
        setUsers(prevUsers => prevUsers.filter(user => user._id !== deleteId));
        mutate(); // Memuat ulang data
      } else {
        toast.error(errorData.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  return (
    <>
      <div className="w-full flex items-center justify-between border-b border-gray-400 dark:border-gray-800 pb-5">
        <button
          onClick={() => setShowModal((prev) => !prev)}
          className="second dark:bg-slate-800 text-gray-50 py-2 px-5 rounded shadow-lg"
          type="button"
        >
          Add User
        </button>
      </div>
      <div className="relative overflow-x-auto my-8 sm:rounded-lg">
        {showModal && <FormAddUser setShowModal={setShowModal} />}
        <table className="w-full shadow-md table-auto text-sm text-left ">
          <thead className="text-md text-gray-700 uppercase second ">
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className=" px-6 py-4 second dark:bg-slate-800 text-gray-50">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users?.map((user, i) => (
              <React.Fragment key={user?._id}>
                <tr className={`px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-100 ${user?.role === "user" ? "bg-gray-100 dark:bg-slate-600" : "bg-gray-200 dark:bg-slate-700"}`}>
                  <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-500 whitespace-nowrap">
                    {i + 1}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-500 capitalize whitespace-nowrap">
                    {user?.name}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-500 whitespace-nowrap">
                    {user?.phone}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-500 capitalize whitespace-nowrap">
                    {user?.role}
                  </td>
                  <td className="px-8 py-4 border-b border-gray-300 dark:border-gray-500 whitespace-nowrap">

                    <button
                      className="relative group"
                      onClick={() => handleShowModal(user?._id)}
                      disabled={user?.role === "master" ? true : false}
                    >
                      <RiDeleteBin2Line
                        className="hover:text-red-500"
                        size={28}
                      />
                      <span className="absolute top-0 -right-12 text-sm hidden font-medium text-red-500 group-hover:block">
                        {" "}
                        delete
                      </span>
                    </button>
                  </td>
                </tr>

              </React.Fragment>
            ))}
          </tbody>
        </table>
        {showDeleteModal && deleteId && (
          <div className="fixed top-0 left-0 w-full h-screen shadow-lg z-50 bg-black/30 text-white flex items-center justify-center">
            <div className="second py-8 px-6 rounded">
              <p className="text-lg py-2">Anda yakin ingin menghapus <br /> {users.find(r => r._id === deleteId)?.name} ?</p>
              <div className="flex gap-3 pt-6">
                <button className="py-1.5 px-4 bg-gradient-to-tr rounded from-green-400 to-lime-500 hover:bg-gradient-to-tl hover:from-green-400 hover:to-lime-500" onClick={handleDelete}>Ya Hapus</button>
                <button className="py-1.5 px-4 bg-red-500 hover:bg-red-600 rounded" onClick={() => setShowDeleteModal(false)}>Batal</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserPage;
