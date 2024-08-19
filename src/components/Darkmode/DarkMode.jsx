import { ThemeContext } from "@/context/ThemeContext";
import React, { useContext } from "react";

import { WiMoonAltWaxingCrescent6 } from "react-icons/wi";
import { PiSunLight } from "react-icons/pi";



const DarkModeToggle = () => {
  const { toggle, theme } = useContext(ThemeContext);


  return (
    <button onClick={toggle} className={`py-1 px-1.5 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-100 text-gray-800" : "bg-[#081225] text-gray-200"}`}>
      {theme === "dark" ? <PiSunLight size={20} /> : <WiMoonAltWaxingCrescent6 size={20} />}
    </button>
  );
};

export default DarkModeToggle;
