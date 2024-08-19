"use client"

import { ThemeContext } from '@/context/ThemeContext';
import { useContext, useEffect } from 'react';

const Modal = ({ children, isOpen, handleCancel }) => {

  const { theme } = useContext(ThemeContext)


  if (!isOpen) return null;

  return (
    <div className="w-full px-4 h-screen fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur ">
      <div className={`shadow-md w-full sm:w-4/5 px-1 pb-8 pt-6 rounded-lg ${theme === "light" ? "light" : "dark"}`}>
        <button onClick={handleCancel} className="absolute top-2 text-gray-500 bg-gray-100/90 hover:bg-gray-100 hover:text-gray-600 px-2 rounded-md right-6 text-3xl">&times;</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;