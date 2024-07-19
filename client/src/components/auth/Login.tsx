/* eslint-disable @typescript-eslint/no-explicit-any */
// react
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// locals
import { User } from "../../types";
import { apiClient } from "../../utils/apiClient";
import { LOGIN_ROUTE } from "../../constants";
import useAppStore from "../../store";

// icons
import { BiSolidUserBadge } from "react-icons/bi";
import { HiLockClosed } from "react-icons/hi";
import { IoEye, IoEyeOff } from "react-icons/io5";

// shadcn
import { toast } from "sonner";

export default function Login() {
  const { setUserData } = useAppStore();

  const navigate = useNavigate();

  const [loginData, setLoginData] = useState<User>({
    emailOrUsername: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [allFilled, setAllFilled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // remove focus from input bar
    e.currentTarget.blur();

    try {
      const res = await apiClient.post(LOGIN_ROUTE, loginData, {
        withCredentials: true,
      });

      const resData = await res.data;
      setUserData(resData.user);
      if (resData.user) navigate("/");
      else {
        toast.error(resData.message);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkFieldsFilled = () => {
      // check if all the fields are filled
      if (loginData.emailOrUsername && loginData.password) {
        setAllFilled(true);
      } else {
        setAllFilled(false);
      }
    };

    checkFieldsFilled();
  }, [loginData]);

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
        disabled={!allFilled}
        className={`text-white flex justify-center items-center py-2 rounded font-bold text-lg ${
          allFilled ? "bg-gradient-blue" : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {loading ? (
          <img
            src="/graphics/loading.gif"
            alt="registering"
            className="h-10 w-fit"
          />
        ) : (
          "Login"
        )}
      </button>
    </form>
  );
}
