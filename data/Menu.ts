import { Menu } from "@/interfaces/menu.interface";
import {
  BiSolidNews ,
  BiSolidFileBlank,
  BiSolidSpreadsheet, 
  BiSolidDashboard,
} from "react-icons/bi";


export const menu: Menu[] = [
  {
    id: "1",
    label: "Mock Tests",
    href: "/mock-tests",
    icon: BiSolidNews ,
    isActive: false,
  },
  {
    id: "exams",
    label: "Exams",
    href: "#",
    icon: BiSolidSpreadsheet,
    isActive: false,
  },
  {
    id: "3",
    label: "Past Papers",
    href: "/past-papers",
    icon: BiSolidFileBlank,
    isActive: false,
  },
  {
    id: "4",
    label: "Dashboard",
    href: "/dashboard",
    icon: BiSolidDashboard,
    isActive: false,
  },
];