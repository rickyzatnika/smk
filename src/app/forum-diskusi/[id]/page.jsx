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
import { toast } from 'react-toastify';
import { BsReplyAll } from "react-icons/bs";

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
  const [replyImage, setReplyImage] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [activeEmojiPicker, setActiveEmojiPicker] = useState(null); // new state to track active emoji picker

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
      setSession(session);
    };

    getTokenAndSession();
  }, [router]);

  const { data: brains, error: swrError, mutate } = useSWR(params?.id ? `${process.env.NEXT_PUBLIC_API_PRO}/api/brainstorming/${params.id}` : null,
    fetcher,
    { refreshInterval: 1000 }
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
    setCommentImage(e.target.files[0]);
  };

  const handleReplyFileChange = (e) => {
    setReplyImage(e.target.files[0]);
  }

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

        const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData);
        imageUrl = response.data["secure_url"];
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_PRO}/api/brainstorming/${params.id}/ideas`,
        { content: newIdea, author: session?.user?.name, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        const timeoutId = setTimeout(() => {
          setLoading(false);
          setNewIdea('');
          setShowModalIdea(false);
          setSelectImageFile(null);
          mutate();
        }, 1000);

        return () => clearTimeout(timeoutId);
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

        const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData);
        imageUrl = response.data["secure_url"];
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_PRO}/api/brainstorming/${params.id}/ideas/${selectedIdeaId}/comments`,
        { content: newComment, author: session.user.name, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        const timeoutId = setTimeout(() => {
          setLoading(false);
          setNewComment('');
          setSelectedIdeaId(null);
          setShowCommentForm(false);
          setCommentImage(null);
          mutate();
        }, 1000);
        return () => clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      setError(error.message || 'Something went wrong');
    }
  };


  // handleReplyClick function
  const handleReplyClick = (commentId) => {
    if (activeReplyId === commentId) {
      setActiveReplyId(null);  // Close the reply form if clicked again
    } else {
      setActiveReplyId(commentId);  // Open the reply form for the specific commentId
      setShowEmojiPicker(false);    // Ensure the emoji picker is closed
      setActiveEmojiPicker(null);
    }
  };


  const handleSelectIdea = (ideaId) => {
    if (selectedIdeaId === ideaId && showCommentForm) {
      setShowCommentForm(false);
      setSelectedIdeaId(null);
    } else {
      setSelectedIdeaId(ideaId);
      setShowCommentForm(true);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    if (activeEmojiPicker === "comment") {
      setNewComment((prevComment) => prevComment + emojiObject.emoji);
    } else if (activeEmojiPicker === "reply") {
      setReplyContent((prevContent) => prevContent + emojiObject.emoji);
    }
    setShowEmojiPicker(false);
    setActiveEmojiPicker(null);
  };

  const handleCommentEmojiClick = () => {
    setShowEmojiPicker((prev) => !prev);
    setActiveEmojiPicker("comment");
    setActiveReplyId(null);
  };

  const handleReplyEmojiClick = (commentId) => {
    setActiveReplyId(commentId);
    setShowEmojiPicker((prev) => !prev);
    setActiveEmojiPicker("reply");
  };

  const handleReplySubmit = async (e, ideaId, commentId) => {
    e.preventDefault();

    if (!replyContent) {
      toast.error("Field is required");
      return;
    }

    try {
      setLoading(true);
      // Send the reply to the server

      let imageUrl = "";

      if (replyImage) {
        const formData = new FormData();
        formData.append('file', replyImage);
        formData.append('upload_preset', UPLOAD_PRESET);

        const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData);
        imageUrl = response.data["secure_url"];
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_PRO}/api/brainstorming/${params.id}/ideas/${ideaId}/comments/${commentId}/replies`,
        { content: replyContent, author: session.user.name, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        const timeoutId = setTimeout(() => {
          setLoading(false);
          setReplyContent('');

          setActiveReplyId(null);
          mutate();
        }, 1000);
        return () => clearTimeout(timeoutId);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message || 'Something went wrong');
      console.error("Error adding reply:", error);
    }
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
                rows={6}
                placeholder="Write your idea here..."
                className="w-full relative max-w-xl p-2 border text-gray-500 dark:text-gray-300/80 border-none rounded-lg dark:border-gray-600 bg-gray-100 dark:bg-[#2D3036] outline-none focus:outline-none focus:border-none focus:ring-lime-300/40"
              />

              <div className="mb-3 px-3 pb-3 w-max ">
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
              <button disabled={loading} type='submit' className="text-white bg-gradient-to-tr from-green-400 to-lime-500 hover:bg-gradient-to-tl hover:from-green-400 hover:to-lime-500 hover:scale-95 text-sm py-2 px-4 rounded mt-4 w-full md:w-40 mx-auto transition-all duration-300 ease-linear">
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
          <h2 className="text-sm italic font-semibold mb-2 text-gray-700 dark:text-gray-200/80 capitalize">{`${brains?.ideas?.length === 0 ? "Belum ada" : brains?.ideas?.length}`} Komentar</h2>
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
                    <p className="text-md text-gray-700 dark:text-gray-200/80">{idea?.content}</p>
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
                              onClick={handleCommentEmojiClick}
                              className="text-gray-500 hover:text-gray-700 absolute bottom-2 right-2"
                            >
                              😊
                            </button>
                            {showEmojiPicker && activeEmojiPicker === "comment" && (
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
                        <button disabled={loading} type='submit' className="text-white bg-gradient-to-tr from-green-400 to-lime-500 hover:bg-gradient-to-tl hover:from-green-400 hover:to-lime-500 hover:scale-95 text-sm py-2 px-4 rounded mt-4 w-full md:w-40 mx-auto transition-all duration-300 ease-linear">
                          {loading ? <div className="flex gap-2 items-center justify-center">
                            <span className=" text-white">Loading... </span>
                            <span className="loader"></span>
                          </div> : "Submit"}
                        </button>
                      </form>
                    )}
                    <div className="mt-4 space-y-5 bg-white dark:bg-[#44484e] py-4 px-2">

                      {idea?.comments?.length > 0 ? (
                        idea?.comments?.map((comment, idx) => (
                          <div key={idx} className="px-2 py-4 bg-gray-50 dark:bg-[#393D43] rounded-lg shadow-sm relative">
                            <div className="mb-6 flex items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-300/80">
                              <span className='flex gap-1 text-sm items-center text-gray-500 dark:text-gray-300/80 capitalize'><FaUserCircle size={20} className="text-gray-500 dark:text-gray-300/80" /> {comment?.author}</span>
                              <span className='flex gap-1 text-xs items-center text-gray-500 dark:text-gray-300/80'><MdAccessTime size={14} /> {moment(comment?.createdAt).fromNow()}</span>
                            </div>

                            <p className="text-sm">{comment?.content}</p>
                            {comment?.image && (
                              <Image src={comment?.image} alt="Idea Image" width={100} height={100} priority={true} className="w-auto h-auto object-contain mt-2 rounded-lg " />
                            )}
                            <button type='button' className='text-xs mt-6 w-mx ml-auto flex items-center gap-1 text-gray-600 dark:text-gray-300/80 hover:text-gray-400 hover:dark:text-gray-50' onClick={() => handleReplyClick(comment?._id)}>

                              <BsReplyAll size={18} />
                              Reply
                            </button>

                            {comment?.replies?.map((reply) => (
                              <div key={reply?._id} className={`${!reply ? "hidden" : "block px-3 mt-3 bg-gray-50 dark:bg-[#444850] py-4 h-auto rounded-md shadow"}`}>
                                <div className='flex flex-col gap-2'>
                                  <div className='text-sm flex items-center gap-1'>
                                    <FaUserCircle size={18} />
                                    <span className=' text-gray-500 dark:text-gray-300/80'><span className='italic text-xs'>balasan dari</span> {reply?.author}</span>
                                  </div>
                                  <div className='text-xs flex gap-1 items-center text-gray-500 dark:text-gray-300/80'><MdAccessTime size={18} />{moment(reply?.createdAt).fromNow()}</div>
                                </div>
                                <div className='mt-3'>
                                  <p className=' text-gray-500 dark:text-gray-300/80'>{reply?.content}</p>
                                  <Image src={reply?.image} priority={true} alt="" width={100} height={100} className={`${reply?.image === "" || null ? "hidden" : "block"} object-contain w-32 h-32`} />

                                </div>
                              </div>
                            ))}

                            {/* Form balasan */}
                            {activeReplyId === comment?._id && (
                              <div className='fixed left-0 right-0 bottom-0 pb-8 z-50 h-screen w-full bg-black/70 backdrop-blur flex items-end justify-end px-2'>
                                <form onSubmit={(e) => handleReplySubmit(e, idea?._id, comment?._id)} className="mt-4 relative w-full md:w-7/12 mx-auto">
                                  <button className='absolute -right-5 -top-5 text-white hover:text-gray-900' onClick={() => handleReplyClick(false)}>X CLOSE</button>
                                  <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder={`balas komentar ${comment?.author}`}
                                    rows={8}
                                    className="w-full placeholder:capitalize p-2 border border-none rounded-lg dark:border-gray-600 bg-gray-100 dark:bg-[#24272C] outline-none focus:outline-none focus:border-none focus:ring-lime-300/40"
                                  />
                                  <div className="flex items-center space-x-2 relative">
                                    <button
                                      type="button"
                                      onClick={() => handleReplyEmojiClick(comment?._id)}
                                      className="text-gray-500 hover:text-gray-700 absolute bottom-2 right-2"
                                    >
                                      😊
                                    </button>
                                    {showEmojiPicker && activeEmojiPicker === "reply" && activeReplyId === comment._id && (
                                      <div className="absolute bottom-4 right-8 md:right-10 z-10">
                                        <EmojiPicker width={230} height={380} lazyLoadEmojis={true} onEmojiClick={handleEmojiClick} />
                                      </div>
                                    )}
                                  </div>
                                  <div className="mb-3 px-3 pb-3 w-max">
                                    <label
                                      htmlFor="file_reply"
                                      className="flex items-center cursor-pointer text-blue-500 hover:text-blue-600 dark:text-blue-300"
                                    >
                                      <FaImage size={14} className="mr-2" />
                                      <span className='text-xs'>Tambahkan Foto</span>
                                    </label>
                                    <input
                                      id="file_reply"
                                      type="file"
                                      onChange={handleReplyFileChange}
                                      className="hidden"
                                    />
                                    {replyImage && (
                                      <>
                                        <div className='flex items-center justify-center gap-3 mt-2 text-gray-600 dark:text-gray-400'>
                                          <p className="text-sm ">
                                            {replyImage.name}
                                          </p>
                                          <button type='button' className='text-xs font-bold' onClick={() => setReplyImage("")}>X</button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                  <button disabled={loading} type='submit' className="text-white bg-gradient-to-tr from-green-400 to-lime-500 hover:bg-gradient-to-tl hover:from-green-400 hover:to-lime-500 hover:scale-95 text-sm py-2 px-4 rounded mt-4 w-full md:w-40 mx-auto transition-all duration-300 ease-linear">
                                    {loading ? <div className="flex gap-2 items-center justify-center">
                                      <span className=" text-white">Loading... </span>
                                      <span className="loader"></span>
                                    </div> : "Submit"}
                                  </button>
                                </form>
                              </div>
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
