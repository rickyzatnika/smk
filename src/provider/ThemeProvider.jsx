"use client"

import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useEffect, useState } from "react";


const ThemeProviders = ({ children }) => {

  const { theme } = useContext(ThemeContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [])

  if (mounted) {
    return <div className={theme}>{children}</div>
  }
}

export default ThemeProviders;