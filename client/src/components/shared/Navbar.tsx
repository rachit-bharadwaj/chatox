import { Link } from "react-router-dom";
import Cookies from "js-cookie";

import useAppStore from "../../store";

// icons
import { TiUser } from "react-icons/ti";

// shadcn
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

export default function Navbar() {
  const { userData } = useAppStore();

  const logout = () => {
    Cookies.remove("token");
    window.location.reload();
  };

  return (
    <nav className="p-3 border-b fixed w-full top-0 flex justify-between items-center">
      <h1 className="text-3xl font-extrabold text-[#615ef0]">
        <Link to="/">Chatox</Link>
      </h1>

      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          {userData?.profilePicture ? (
            <img
              src={userData?.profilePicture}
              alt={userData?.name}
              className="w-7 h-7 rounded-full"
            />
          ) : (
            <div className="rounded-full border p-2">
              <TiUser className="h-7 w-7 text-gray-500" />
            </div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link to={`/${userData?.userName}`} className="w-full text-left">
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link to="/settings" className="w-full text-left">
              Settings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <button className="w-full text-left" onClick={logout}>
              Logout
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
