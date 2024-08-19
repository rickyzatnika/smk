"use client"

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import MyEditor from "../Editor";

const FormAddNews = () => {


  const CLOUD_NAME = "inkara-id";
  const UPLOAD_PRESET = "myBlog_project_nextjs";
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    content: '',
    slug: '',
    category: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      // Automatically generate slug when the title changes
      slug: name === 'title' ? generateSlug(value) : prevData.slug,
    }));
  };

  const handleContentChange = (value) => {
    setFormData({ ...formData, content: value });
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase() // Convert to lowercase
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .trim() // Trim whitespace
      .replace(/\s+/g, '-'); // Replace spaces with dashes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      const imageUrl = await uploadImage();

      if (!imageUrl || imageUrl === '') {
        return toast.error('Gagal mengupload, masukkan gambar');
      }

      setFormData({ ...formData, imageUrl: imageUrl });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_PRO}/api/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, imageUrl }),

      });
      await res.json();

      if (res.status === 201) {
        const timeoutId = setTimeout(() => {
          setFormData({
            title: '',
            desc: '',
            content: '',
            slug: '',
            category: '',
          });
          setLoading(false);
          toast.success('Oke Berita berhasil dibuat');
          router.push('/dashboard/news');
        }, 3000);
        return () => clearTimeout(timeoutId);
      } else {
        // Handle response errors
        console.error("Failed to save data");
        toast.error('Failed to save data');
        setLoading(false);
      }
    } catch (error) {
      console.error("Error occurred while saving data", error);
      toast.error('Error occurred while saving data');
      setLoading(false);
    }
    // Proceed with your form submission logic here
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", photo);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {

      if (!photo) {
        return;
      }
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      const imageUrl = data["secure_url"];
      return imageUrl;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (

    <form onSubmit={handleSubmit} className="p-4 w-full max-w-3xl rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Judul Berita
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 px-2 py-3 w-full bg-gray-50 dark:bg-slate-800 border rounded-lg"
          placeholder="Enter title"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="desc" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Deskripsi
        </label>
        <textarea
          id="desc"
          name="desc"
          value={formData.desc}
          required
          onChange={handleChange}
          className="mt-1 px-2 py-3 w-full bg-gray-50 dark:bg-slate-800 border rounded-lg"
          placeholder="Enter description"
        />
      </div>
      <div className="mb-4 ">
        <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Content
        </label>
        <MyEditor value={formData.content} onChange={handleContentChange} />
      </div>
      <div className="mb-4">
        <label htmlFor="slug" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Slug
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          required
          value={formData.slug}
          onChange={handleChange}
          className="mt-1 px-2 py-3 w-full bg-gray-50 dark:bg-slate-800 border rounded-lg"
          placeholder="Generated slug"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Kategori
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="mt-1 px-2 py-3 w-full bg-gray-50 dark:bg-slate-800 border rounded-lg"
          placeholder="Enter category"
        />
      </div>
      <div className='mb-4 pb-3'>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload Gambar</label>
        <input onChange={handleFileChange} name="img" className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" />
      </div>
      <button type="submit" className="py-3 px-6 uppercase text-slate-100 transition-all duration-150 ease-linear bg-gradient-to-tr from-green-500 to-lime-400  hover:bg-green-500 hover:text-white rounded-md">
        {loading ? <div className="flex gap-2 items-center justify-center">
          <span className=" text-white">Loading... </span>
          <span className="loader"></span>
        </div> : "Publish"}
      </button>
    </form>

  )
}

export default FormAddNews;