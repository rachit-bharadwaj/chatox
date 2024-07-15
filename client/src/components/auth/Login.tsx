// react
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

// locals
import { User } from "../../types";
// import { apiClient } from "../../utils/apiClient";
// import { LOGIN_ROUTE } from "../../constants";
import useAppStore from "../../store";

// icons
import { BiSolidUserBadge } from "react-icons/bi";
import { HiLockClosed } from "react-icons/hi";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function Login() {

  const {setUserData} = useAppStore()

  const navigate = useNavigate();

  const [loginData, setLoginData] = useState<User>({
    emailOrUsername: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // const res = await apiClient.post(LOGIN_ROUTE, loginData, {
      //   withCredentials: true,
      // });

      const res = await axios.post(
        "https://chatox-vzh5.onrender.com/api/auth/login",
        loginData,
        { withCredentials: true }
      );

      const resData = await res.data;
      setUserData(resData.user);
      if (resData.user) navigate("/");
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="shadow p-3 rounded flex flex-col gap-5"
    >
      <div className="flex gap-2 border rounded py-2 px-3">
        <BiSolidUserBadge className="text-2xl text-gray-400" />
        <input
          type="text"
          placeholder="Email or username"
          className="flex-1 outline-none"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setLoginData({ ...loginData, emailOrUsername: e.target.value })
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

      <button
        type="submit"
        className="bg-gradient-blue text-white py-2 rounded font-bold text-lg"
      >
        Login
      </button>
    </form>
  );
}
