import { Menu } from "@/interfaces/menu.interface";
import { BiSolidSpreadsheet, BiUser } from "react-icons/bi";
import { TbToolsOff } from "react-icons/tb";
import { RiMindMap } from "react-icons/ri";
import { BsChatLeftText } from "react-icons/bs";
import { BiDice4 } from "react-icons/bi";

export const baseMenu: Menu[] = [
    {
    id: "courses",
    label: "Courses",
    href: "#",
    icon: BiDice4,
  },
  {
    id: "exams",
    label: "Exams",
    href: "#",
    icon: BiSolidSpreadsheet,
  },
   {
    id: "roadmap",
    label: "Roadmaps",
    href: "#",
    icon: RiMindMap,
  },

  {
    id: "free-tools",
    label: "Tools",
    href: "/tools/college",
    icon: TbToolsOff,
  },
  // {
  //   id: "webinars",             // 👈 NEW
  //   label: "Webinars",
  //   href: "/webinar",
  //   icon: MdOutlineOndemandVideo,
  // },
  {
    id: "blogs",
    label: "Blogs",
    href: "/blogs",
    icon: BsChatLeftText,
  },
];

export const dashboardMenu: Menu = {
  id: "dashboard",
  label: "Dashboard",
  href: "/dashboard",
  icon: BiUser,
};