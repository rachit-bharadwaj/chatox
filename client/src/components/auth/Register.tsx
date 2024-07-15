import { ChangeEvent, useState } from "react";

import axios from "axios"

// locals
import { User } from "../../../types";

// icons
import { TiUser } from "react-icons/ti";
import { BiSolidUserBadge } from "react-icons/bi";
import { HiMail, HiLockClosed } from "react-icons/hi";
import { BsFileLockFill } from "react-icons/bs";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function Register() {
  const [registerData, setRegisterData] = useState<User>({
    name: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      name: registerData.name,
      userName: registerData.userName,
      email: registerData.email,
      password: registerData.password,
    };

    try {
      console.log("processing");

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        data
      );
      const resData = await res.data;
      console.log(resData);
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
        <TiUser className="text-2xl text-gray-400" />
        <input
          type="text"
          placeholder="Full name"
          className="flex-1 outline-none"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setRegisterData({ ...registerData, name: e.target.value })
          }
        />
      </div>

      <div className="flex gap-2 border rounded py-2 px-3">
        <BiSolidUserBadge className="text-2xl text-gray-400" />
        <input
          type="text"
          placeholder="Username"
          className="flex-1 outline-none"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setRegisterData({ ...registerData, userName: e.target.value })
          }
        />
      </div>

      <div className="flex gap-2 border rounded py-2 px-3">
        <HiMail className="text-2xl text-gray-400" />
        <input
          type="email"
          placeholder="Email"
          className="flex-1 outline-none"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setRegisterData({ ...registerData, email: e.target.value })
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
            setRegisterData({ ...registerData, password: e.target.value })
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

      <div className="flex gap-2 border rounded py-2 px-3">
        <BsFileLockFill className="text-2xl text-gray-400" />
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Password"
          className="flex-1 outline-none"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setRegisterData({
              ...registerData,
              confirmPassword: e.target.value,
            })
          }
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? (
            <IoEyeOff className="text-2xl text-gray-400" />
          ) : (
            <IoEye className="text-2xl text-gray-400" />
          )}
        </button>
      </div>

      <button className="bg-gradient-blue text-white py-2 rounded font-bold text-lg">
        Register
      </button>
    </form>
  );
}
