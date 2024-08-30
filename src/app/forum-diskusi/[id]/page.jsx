"use client";

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaImage, FaRegComments, FaUserCircle } from 'react-icons/fa';
import moment from 'moment';
import { MdAccessTime } from 'react-icons/md';
import Image from 'next/image';
import EmojiPicker, { Emoji } from 'emoji-picker-react';

const fetcher = async (url, token) => {
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const BrainstormingDetail = ({ params }) => {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [session, setSession] = useState(null);
  const [newIdea, setNewIdea] = useState('');
  const [newComment, setNewComment] = useState('');
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showModalIdea, setShowModalIdea] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectImageFile, setSelectImageFile] = useState(null);
  const [commentImage, setCommentImage] = useState(null);


  const [showEmojiPicker, setShowEmojiPicker] = useState(false);



  const CLOUD_NAME = "inkara-id";
  const UPLOAD_PRESET = "myBlog_project_nextjs";

  useEffect(() => {
    const getTokenAndSession = async () => {
      const session = await getSession();
      if (!session?.user?.accessToken) {
        router.push("/login");
        return;
      }
      setToken(session.user.accessToken);
      setSession(session); // Set session state
    };

    getTokenAndSession();
  }, [router]);

  const { data: brains, error: swrError, mutate } = useSWR(params?.id ? `${process.env.NEXT_PUBLIC_API_PRO}/api/brainstorming/${params.id}` : null,
    fetcher,
    // { refreshInterval: 1000 }
  );

  useEffect(() => {
    if (swrError) {
      console.error("Error fetching brainstorming session:", swrError);
      setError(swrError.message || 'Something went wrong');
    }
  }, [swrError]);


  const handleFileChange = (e) => {
    setSelectImageFile(e.target.files[0]);

  };

  const handleCommentFileChange = (e) => {

    setCommentImage(e.target.files[0])
  };


  const handleIdeaSubmit = async (e) => {
    e.preventDefault();

    if (!newIdea || !session?.user?.name) return;
    try {
      setLoading(true);

      let imageUrl = "";

      if (selectImageFile) {
        const formData = new FormData();
        formData.append('file', selectImageFile);
        formData.append('upload_preset', UPLOAD_PRESET);

        const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          formData);
        imageUrl = response.data["secure_url"];
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_PRO}/api/brainstorming/${params.id}/ideas`,
        { content: newIdea, author: session?.user?.name, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        const timeoutId = setTimeout(() => {
          setLoading(false); // Hide loading spinner after 3 seconds
          setNewIdea('');
          setShowModalIdea(false); // Hide modal when an idea is added
          setSelectImageFile(null);
          mutate(); // Refresh the data
        }, 1000)

        return () => clearTimeout(timeoutId); // Clear timeout when component unmounts 
      }
    } catch (error) {
      console.error("Error adding idea:", error);
      setLoading(false);
      setError(error.message || 'Something went wrong');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment || !selectedIdeaId || !session?.user?.name) return;
    try {

      let imageUrl = "";

      if (commentImage) {
        const formData = new FormData();
        formData.append('file', commentImage);
        formData.append('upload_preset', UPLOAD_PRESET);

        const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          formData);
        imageUrl = response.data["secure_url"];
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_PRO}/api/brainstorming/${params.id}/ideas/${selectedIdeaId}/comments`,
        { content: newComment, author: session.user.name, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        const timeoutId = setTimeout(() => {
          setLoading(false); // Hide loading spinner after 3 seconds
          setNewComment('');
          setSelectedIdeaId(null); // Reset selected idea
          setShowCommentForm(false); // Hide comment form
          setCommentImage(null); // Reset selected image for comment
          mutate(); // Refresh the data
        }, 1000)
        return () => clearTimeout(timeoutId); // Clear timeout when component unmounts 
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      setError(error.message || 'Something went wrong');
    }
  };

  const handleSelectIdea = (ideaId) => {
    if (selectedIdeaId === ideaId && showCommentForm) {
      // Jika ide yang sama diklik lagi, tutup form
      setShowCommentForm(false);
      setSelectedIdeaId(null);
    } else {
      setSelectedIdeaId(ideaId);
      setShowCommentForm(true);
    }
  };

  const handleEmojiClick = (emojiObject) => {

    if (emojiObject.emoji) {
      setNewComment(prevComment => prevComment + emojiObject.emoji);
    } else {
      console.error('Emoji not found in emojiObject');
    }
    setShowEmojiPicker(false); // Menutup emoji picker setelah emoji dipilih
  };


  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!brains) {
    return <div className='w-full h-screen flex items-center justify-center'>Loading...</div>;
  }

  return (
    <>
      <div className="w-full max-w-4xl mx-auto py-8">
        <div className='p-6 bg-white dark:bg-[#1B1D21] rounded-lg shadow-md mb-8 '>
          <h1 className="text-2xl font-bold mb-2 text-gray-700 dark:text-gray-200/90">{brains?.title}</h1>
          <p className="text-gray-500 dark:text-gray-300/80 mb-4">{brains?.description}</p>
          <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
            <div className='flex flex-row gap-2 items-center'>
              <div className='flex items-center gap-2'>
                <FaUserCircle size={20} className="text-gray-500 dark:text-gray-300/80" />
                <p className='text-sm font-semibold text-gray-500 dark:text-gray-300/80'>{brains?.creator}</p>
              </div>
              <span className='text-sm text-gray-500 dark:text-gray-300/80 flex items-center gap-1'><MdAccessTime size={20} />{moment(brains?.createdAt).fromNow()}</span>
            </div>
            <button onClick={() => setShowModalIdea((prev) => !prev)} className='w-full md:w-max py-2 px-4 bg-lime-400 rounded-full shadow-md text-white text-sm'>Beri Masukkan</button>
          </div>
          {showModalIdea && (
            <form onSubmit={handleIdeaSubmit} div className="mt-6" >

              <textarea
                value={newIdea}
                onChange={(e) => setNewIdea(e.target.value)}
                placeholder="Write your idea here..."
                className="w-full p-2 border border-none rounded-lg dark:border-gray-600 bg-gray-100 dark:bg-[#2D3036] outline-none focus:outline-none focus:border-none focus:ring-lime-300/40"
              />
              <div className="mb-3 px-3 pb-3 w-max">
                <label
                  htmlFor="file_input"
                  className="flex items-center cursor-pointer text-blue-500 hover:text-blue-600 dark:text-blue-300"
                >
                  <FaImage size={14} className="mr-2" />
                  <span className='text-sm'>Tambahkan Foto</span>
                </label>
                <input
                  id="file_input"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {selectImageFile && (
                  <>
                    <div className='flex items-center justify-center gap-3 mt-2 text-gray-600 dark:text-gray-400'>
                      <p className="text-sm ">
                        {selectImageFile.name}
                      </p>
                      <button className='text-xs font-bold' onClick={() => setSelectImageFile("")}>X</button>
                    </div>
                  </>
                )}
              </div>
              <button type='submit' className="text-white bg-gradient-to-tr from-green-400 to-lime-500 hover:bg-gradient-to-tl hover:from-green-400 hover:to-lime-500 hover:scale-95 text-sm py-2 px-4 rounded mt-4 w-full md:w-40 mx-auto transition-all duration-300 ease-linear">
                {loading ? <div className="flex gap-2 items-center justify-center">
                  <span className=" text-white">Loading... </span>
                  <span className="loader"></span>
                </div> : "Submit"}
              </button>

            </form>
          )
          }
        </div>
        <div>

          <h2 className="text-sm italic font-semibold mb-2 text-gray-700 dark:text-gray-200/80 capitalize">{`${brains?.ideas?.length === 0 ? "Belum ada" : brains?.ideas?.length}`} Masukkan</h2>


          <div className="space-y-6 w-full">
            {brains?.ideas?.map((idea) => (
              <div key={idea?._id} className="px-2 md:px-4 py-8 bg-white dark:bg-[#2D3036] rounded-lg shadow-md ">
                <div className="flex flex-col md:flex-row items-start gap-4 mb-6 md:mb-0">
                  <div className='flex flex-row md:flex-col gap-2 items-center md:items-start '>
                    <div className='flex gap-1 items-center'>
                      <FaUserCircle size={28} className="text-gray-500 dark:text-gray-300/80" />
                      <span className='text-md capitalize text-gray-500 dark:text-gray-300/80'>{idea?.author}</span>
                    </div>
                    <span className='text-xs italic'>{moment(idea.createdAt).format("LL")}</span>
                  </div>
                  <div className="w-full flex-1 pl-0 md:pl-4 border-none md:border-l-2 border-lime-300/50  dark:border-lime-300/20">
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200/80">{idea?.content}</p>
                    {idea?.image && (
                      <Image src={idea?.image} alt="Idea Image" width={100} height={100} priority={true} className="w-auto h-auto object-contain mt-2 rounded-lg " />
                    )}
                    <div className='mt-6 '>
                      {/* <div className="text-sm text-gray-500 dark:text-gray-400/80">
                        Votes: {idea?.votes}
                      </div> */}
                      <button
                        onClick={() => handleSelectIdea(idea?._id)}
                        className="text-gray-500 text-right dark:text-gray-400/80 text-sm flex justify-end gap-2 items-center"
                      >
                        <FaRegComments size={22} />
                        Komentari
                      </button>
                    </div>
                    {selectedIdeaId === idea._id && showCommentForm && (
                      <form onSubmit={handleCommentSubmit} className="mt-6 ">
                        <div className='relative '>
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write your comment here..."
                            rows={8}
                            className="w-full relative p-2 border border-none rounded-lg dark:border-gray-600 bg-gray-100 dark:bg-[#24272C] outline-none focus:outline-none focus:border-none focus:ring-lime-300/40"
                          />
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                              className="text-gray-500 hover:text-gray-700 absolute bottom-2 right-2"
                            >
                              😊


                            </button>
                            {showEmojiPicker && (
                              <div className="absolute bottom-4 right-8 md:right-10 z-10">
                                <EmojiPicker width={230} height={420} lazyLoadEmojis={true} onEmojiClick={handleEmojiClick} />
                              </div>
                            )}

                          </div>


                        </div>
                        <div className="mb-3 px-3 pb-3 w-max">
                          <label
                            htmlFor="file_comment"
                            className="flex items-center cursor-pointer text-blue-500 hover:text-blue-600 dark:text-blue-300"
                          >
                            <FaImage size={14} className="mr-2" />
                            <span className='text-xs'>Tambahkan Foto</span>
                          </label>
                          <input
                            id="file_comment"
                            type="file"
                            onChange={handleCommentFileChange}
                            className="hidden"
                          />
                          {commentImage && (
                            <>
                              <div className='flex items-center justify-center gap-3 mt-2 text-gray-600 dark:text-gray-400'>
                                <p className="text-sm ">
                                  {commentImage.name}
                                </p>
                                <button className='text-xs font-bold' onClick={() => setCommentImage("")}>X</button>
                              </div>
                            </>
                          )}
                        </div>
                        <button type='submit' className="text-white bg-gradient-to-tr from-green-400 to-lime-500 hover:bg-gradient-to-tl hover:from-green-400 hover:to-lime-500 hover:scale-95 text-sm py-2 px-4 rounded mt-4 w-full md:w-40 mx-auto transition-all duration-300 ease-linear">
                          {loading ? <div className="flex gap-2 items-center justify-center">
                            <span className=" text-white">Loading... </span>
                            <span className="loader"></span>
                          </div> : "Submit"}
                        </button>
                      </form>
                    )}
                    <div className="mt-4 space-y-5 bg-white dark:bg-[#2D3036] py-4 px-2">
                      <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-300 capitalize">{idea?.comments?.length === 0 ? "belum ada" : idea?.comments?.length} Komentar</h3>
                      {idea?.comments?.length > 0 ? (
                        idea?.comments?.map((comment, idx) => (
                          <div key={idx} className="px-2 py-4 bg-gray-50 dark:bg-[#393D43] rounded-lg shadow-sm ">
                            <div className="mb-6 flex items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-300/80">
                              <span className='flex gap-1 text-sm items-center text-gray-500 dark:text-gray-300/80 capitalize'><FaUserCircle size={20} className="text-gray-500 dark:text-gray-300/80" /> {comment?.author}</span>
                              <span className='flex gap-1 text-xs items-center text-gray-500 dark:text-gray-300/80'><MdAccessTime size={14} /> {moment(comment?.createdAt).fromNow()}</span>
                            </div>

                            <p className="text-sm">{comment?.content}</p>
                            {comment?.image && (
                              <Image src={comment?.image} alt="Idea Image" width={100} height={100} priority={true} className="w-auto h-auto object-contain mt-2 rounded-lg " />
                            )}

                          </div>
                        ))
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </>

  );
};

export default BrainstormingDetail;
