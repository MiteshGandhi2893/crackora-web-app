import { useModal } from "../../context/ModalContext";
import { BiLogIn } from "react-icons/bi";

export function LoginRegister(props: any) {
  const { mobile } = props;
  const { openModal } = useModal();
  return (
    <>
      <div
        className={`flex gap-2 ${
          mobile ? "text-cyan-900 text-2xl" : "text-gray-300"
        }  items-center text-sm font-normal`}
      >
        <div className="flex gap-2">
          
          <BiLogIn className="text-amber-700 w-6 h-6"/>
          <div
            onClick={() => openModal("LoginModal", { source: "header-click", loginFlag: true })}
            className={`cursor-pointer text-[17px] font-semibold ${
              mobile
                ? "text-cyan-900  hover:text-cyan-950 "
                : "text-gray-300 hover:text-white"
            }`}
          >
            Log In
          </div>
          
        </div>
      </div>
    </>
  );
}
