import { FaUserCog } from "react-icons/fa";
import { RiCalendarEventFill } from "react-icons/ri";
import { IoIosHome } from "react-icons/io";
import { LuActivitySquare } from "react-icons/lu";
import { MdFeaturedPlayList } from "react-icons/md";
import { RiDatabaseLine } from "react-icons/ri";

export const asideLink = [
  {
    id: "1",
    title: "dashboard",
    icon: <IoIosHome size={24} />,
    link: "/dashboard",
  },
  {
    id: "2",
    title: "Daftar Riders",
    icon: <LuActivitySquare size={24} />,
    link: "/dashboard/list-riders",
  },
  {
    id: "3",
    title: "News",
    icon: <RiCalendarEventFill size={24} />,
    link: "/dashboard/news",
  },
  {
    id: "4",
    title: "Kelas Balap",
    icon: <MdFeaturedPlayList size={24} />,
    link: "/dashboard/list-kelas",
  },
  {
    id: "5",
    title: "User",
    icon: <FaUserCog size={24} />,
    link: "/dashboard/users",
  },
  {
    id: "6",
    title: "Seklom",
    icon: <RiDatabaseLine size={24} />,
    link: "/dashboard/seklom",
  },
];
