import { Menu } from "@/interfaces/menu.interface";
import {
  BiSolidNews,
  BiSolidSpreadsheet,
  BiUser,
} from "react-icons/bi";
import { TbToolsOff } from "react-icons/tb";
import { RiMindMap } from "react-icons/ri";
import { BsChatLeftText } from "react-icons/bs";

export const baseMenu: Menu[] = [
  {
    id: "exams",
    label: "Exams",
    href: "#",
    icon: BiSolidSpreadsheet,
  },
  {
    id: "mca-roadmap",
    label: "MCA Roadmap",
    href: "/mca-journey",
    icon: RiMindMap,
  },
  {
    id: "free-tools",
    label: "MCA Tools",
    href: "/tools/college",
    icon: TbToolsOff,
  },
  {
    id: "blogs",
    label: "Blogs",
    href: "/blogs",
    icon: BsChatLeftText,
  },
];

// 👇 Optional grouped menu (clean UX)


// 👇 Dashboard config
export const dashboardMenu: Menu = {
  id: "dashboard",
  label: "Dashboard",
  href: "/dashboard",
  icon: BiUser,
};