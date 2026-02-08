import { useEffect, useState } from "react";
import { coursesService } from "../../services/courses.service";
import { Entrance } from "../../interfaces/entrance-interface";
import { BiSolidDownArrow } from "react-icons/bi";
import { BiWindowAlt , BiSpreadsheet,BiSolidFileBlank, BiSolidDashboard     } from "react-icons/bi";

interface Menu {
  label: string;
  href: string;
  id: number | string;
  icon?: any;
  isActive: boolean;
  subMenu?: any[];
}

const leftMenu: Menu[] = [
  { label: "Mock Tests", href: "#", id: 1, isActive: false, icon: BiWindowAlt  },
 { label: "Exams", href: "#", id: "r1", isActive: false, icon: BiSpreadsheet  },  
 { label: "Past Papers", href: "#", id: 3, isActive: false, icon: BiSolidFileBlank  },
  {
    label: "Dasboard",
    href: "#",
    id: 4,
    isActive: false,
    icon: BiSolidDashboard ,
  },
];

const rightMenu: Menu[] = [
 
];

export function Navbar(props: any) {
  const { mobile, onCoursesClicked, onExamsInfoClicked } = props;
  const [menuItems, setMenuItems] = useState(leftMenu);
  const [rightMenuItems, setRightMenuItems] = useState(rightMenu);

  const handleMenuClick = (menu: Menu) => {
    const updateMenu = (items: Menu[]) =>
      items.map((v: Menu) => {
        const isCollapsing = menu.label === v.label && v.isActive;
        return {
          ...v,
          isActive: menu.label === v.label ? !v.isActive : false,
          subMenu:
            isCollapsing && v.subMenu
              ? v.subMenu.map((sub) => ({ ...sub, isActive: false }))
              : v.subMenu,
        };
      });

    setMenuItems((prev: Menu[]) => updateMenu(prev));
    setRightMenuItems((prev: Menu[]) => updateMenu(prev));

    if (
      menu.label === "Online Courses" &&
      typeof onCoursesClicked === "function" &&
      !mobile
    ) {
      onCoursesClicked();
    } else if (
      menu.label === "Exams" &&
      typeof onExamsInfoClicked === "function" &&
      !mobile
    ) {
      onExamsInfoClicked();
    }
  };

  const handleSubMenuClick = (menuLabel: string, subMenuLabel: string) => {
    const updateMenu = (items: Menu[]) =>
      items.map((menu: Menu) =>
        menu.label === menuLabel
          ? {
              ...menu,
              subMenu: menu.subMenu?.map((sub) => ({
                ...sub,
                isActive: sub.label === subMenuLabel ? !sub.isActive : false,
              })),
            }
          : menu
      );

    setMenuItems((prev: Menu[]) => updateMenu(prev));
    setRightMenuItems((prev: Menu[]) => updateMenu(prev));
  };

  useEffect(() => {
    const updateMenuItems = async () => {
      if (mobile) {
        await fetchCourses();
      }
    };
    updateMenuItems();
  }, [mobile]);

  const fetchCourses = async () => {
    try {
      const entrances: Entrance[] = await coursesService.getCoursesByExam();

      const subMenu = entrances.map((v, index) => ({
        label: v.title,
        isActive: v.isActive,
        id: "entrance" + index,
        subMenu: v.exams.map((e, i) => ({
          label: e.title,
          isActive: e.isActive,
          id: "exam" + i,
        })),
      }));

      const _menu = JSON.parse(JSON.stringify(menuItems));
      _menu[0].subMenu = subMenu;
      _menu[0].isActive = false;
      setMenuItems(_menu);

      const _rightMenu = JSON.parse(JSON.stringify(rightMenuItems));
      _rightMenu[0].subMenu = subMenu;
      _rightMenu[0].isActive = false;
      setRightMenuItems(_rightMenu);
    } catch (e) {
      console.log("Error while fetching courses/exams", e);
    }
  };

  const renderMenu = (menu: Menu) => (
    <div key={menu.id} className={`${mobile ? 'w-full' : 'w-fit'}`}>
      <li
        onClick={() => handleMenuClick(menu)}
        className={`${
          mobile
            ? "pl-2 pb-2 text-md border-b-gray-300 border-b mt-4"
            : "text-[16px]"
        }
  text-sky-900 relative cursor-pointer before:absolute before:bottom-0 before:left-1/2 before:w-0 before:h-[2px]
   before:bg-amber-600 before:transition-all before:duration-300 before:ease-in-out hover:before:left-0 hover:before:w-full `}
      >
        <a
          href={menu.href}
          className="text-sky-900 flex justify-between items-center gap-2"
        >
          <span className="flex gap-1 items-center">
            {menu.icon && (
              <menu.icon className="inline-block w-4 h-4 text-amber-600 opacity-80" />
            )}
            {menu.label}
          </span>
          {menu.subMenu && (
            <BiSolidDownArrow
              className={`w-4 h-4 transform transition-transform duration-300 ${
                menu.isActive ? "rotate-180" : "rotate-0"
              }`}
            />
          )}
        </a>
      </li>

      {/* Mobile submenu */}
      {mobile && menu.subMenu && menu.isActive && (
        <div className="transition-all duration-300 bg-sky-50 overflow-auto max-h-[300px] w-full rounded-md">
          <ul className="ml-4 mt-2 space-y-2 pr-2">
            {menu.subMenu?.map((sub) => (
              <div key={sub.id} className="w-full">
                <li
                  onClick={() => handleSubMenuClick(menu.label, sub.label)}
                  className="p-2 hover:bg-amber-50 rounded-md flex justify-between items-center text-cyan-700 cursor-pointer"
                >
                  {sub.label}
                  {sub.subMenu && (
                    <BiSolidDownArrow
                      className={`w-4 h-4 opacity-70 transform transition-transform duration-300 ${
                        sub.isActive ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  )}
                </li>

                {sub.subMenu && sub.isActive && (
                  <div className="ml-6 bg-white rounded-md border border-gray-100">
                    <ul className="max-h-[220px] overflow-auto pr-2">
                      {sub.subMenu.map((s: any, s_index: number) => (
                        <li
                          key={s_index}
                          className="border-b border-gray-200 py-2 text-gray-700 flex gap-3 items-center hover:bg-gray-50"
                        >
                          <img
                            src="/assets/exams/nim.jpg"
                            className="w-8 h-8 rounded"
                            alt=""
                          />
                          {s.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <nav
      className={`w-full ${
        mobile
          ? "flex flex-col gap-2 "
          : "flex items-center justify-between"
      }`}
    >
      {/* Left Menu */}
      <ul className={`flex ${mobile ? "flex-col w-full" : "w-1/2 gap-3"} list-none  `}>
        {menuItems.map((menu) => renderMenu(menu))}
      </ul>

      {/* Right Menu */}
      <ul
        className={`flex ${
          mobile ? "flex-col w-full mt-2" : "gap-5 ml-auto w-1/2  justify-end"
        } list-none`}
      >
        {rightMenuItems.map((menu) => renderMenu(menu))}
      </ul>
    </nav>
  );
}
