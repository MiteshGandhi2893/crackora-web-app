import { Menu } from "@/interfaces/menu.interface";
import {
  BiSolidNews,
  BiSolidSpreadsheet,
} from "react-icons/bi";
import { TbToolsOff } from "react-icons/tb";
import { RiMindMap } from "react-icons/ri";
import { BsChatLeftText } from "react-icons/bs";


export const menu: Menu[] = [
  {
    id: "exams",
    label: "Exams", // mega menu → all MCA entrances
    href: "#",
    icon: BiSolidSpreadsheet,
  },
  // {
  //   id: "mock-tests",
  //   label: "Mock Tests",
  //   href: "https://learn.crackora.com/learn/MCA-Mocktest-Series",
  //   icon: BiSolidNews,
  //   target: "_blank",
  // },
  {
    id: "mca-roadmap",
    label: "MCA Roadmap",
    href: "/mca-journey",
    icon: RiMindMap,
  },
  {
    id: "free-tools",
    label: "MCA Tools", // replaces Dashboard — much more traffic
    href: "/tools/college",
    icon: TbToolsOff,
  },
  {
    id: "blogs",
    label: "Blogs", // replaces Dashboard — much more traffic
    href: "/blogs",
    icon: BsChatLeftText,
  },
];
