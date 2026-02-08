import { BiCaretDown } from "react-icons/bi";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { authService } from "../../services/Authentication.service";
import { useNavigate } from "react-router-dom";

export function UserStatus(props: any) {
    const {textColor} = props;
    const { user, setUser } = useAuth();
    const navigate = useNavigate()
    
    const [showSubmenu, setShowSubmenu] = useState(false);

    const handleMenu = () => {
        setShowSubmenu(!showSubmenu);
    }

    const signOut = async() => {
        const response = await authService.signOut();
        if (response.success) {
            setUser(null);
            navigate('/')
        }
    }
  
    return <>
          {user && user.username && <div className={`flex relative justify-center items-center gap-2 border ${textColor || 'text-cyan-900'} p-1 px-4 rounded-lg text-[14px] cursor-pointer`} onClick={handleMenu}>
          {user.fullname} <BiCaretDown className="w-4 h-4"/>

          <div className={`w-full absolute top-8 left-0 border bg-white shadow-xl rounded z-100 border-gray-200 transition-all duration-500 ${showSubmenu ? 'h-auto p-4' : 'h-0 opacity-0'}`}>
            <ul className="flex flex-col gap-4">
                <li className="border-b border-b-gray-200 py-1 text-cyan-900" onClick={() => signOut()}>Logout </li>
            </ul>
          </div>
          </div>}
    </>
}