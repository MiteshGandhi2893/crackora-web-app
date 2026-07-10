import { Menu } from "@/interfaces/menu.interface";
import { BiSolidSpreadsheet, BiUser } from "react-icons/bi";
import { TbToolsOff } from "react-icons/tb";
import { RiMindMap } from "react-icons/ri";
import { BsChatLeftText } from "react-icons/bs";
import { MdOutlineOndemandVideo } from "react-icons/md"; // 👈 new icon

export const baseMenu: Menu[] = [
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