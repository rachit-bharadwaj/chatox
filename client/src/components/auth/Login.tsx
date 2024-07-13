import { ChangeEvent, useState } from "react";

// locals
import { User } from "../../../types";

// icons
import { BiSolidUserBadge } from "react-icons/bi";
import { HiLockClosed } from "react-icons/hi";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function Login() {
  const [loginData, setLoginData] = useState<User>({
    emailOrUsername: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="shadow p-3 rounded flex flex-col gap-5">
      <div className="flex gap-2 border rounded py-2 px-3">
        <BiSolidUserBadge className="text-2xl text-gray-400" />
        <input
          type="text"
          placeholder="Email or username"
          className="flex-1 outline-none"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setLoginData({ ...loginData, userName: e.target.value })
          }
        />
      </div>

      <div className="flex gap-2 border rounded py-2 px-3">
        <HiLockClosed className="text-2xl text-gray-400" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="flex-1 outline-none"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <IoEyeOff className="text-2xl text-gray-400" />
          ) : (
            <IoEye className="text-2xl text-gray-400" />
          )}
        </button>
      </div>

      <button className="bg-gradient-blue text-white py-2 rounded font-bold text-lg">
        Login
      </button>
    </form>
  );
}
