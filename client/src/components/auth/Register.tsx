import { ChangeEvent, useEffect, useState } from "react";

// locals
import { User } from "../../types";

// icons
import { TiUser } from "react-icons/ti";
import { BiSolidUserBadge } from "react-icons/bi";
import { HiMail, HiLockClosed } from "react-icons/hi";
import { BsFileLockFill } from "react-icons/bs";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { CHECK_EMAIL, CHECK_USERNAME, REGISTER_ROUTE } from "../../constants";
import { apiClient } from "../../utils/apiClient";
import { cn } from "../../lib/utils";

// shadcn
import { toast } from "sonner";

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

  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [emailAvailable, setEmailAvailable] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [allFilled, setAllFilled] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkUsername = async (e: ChangeEvent<HTMLInputElement>) => {
    const userName = e.target.value;

    try {
      const res = await apiClient.post(CHECK_USERNAME, { userName });

      const resStatus = res.status;
      console.log(resStatus);

      if (resStatus === 409) {
        setUsernameAvailable(false);
      } else {
        setUsernameAvailable(true);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response.status) {
        setUsernameAvailable(false);
      }
      console.log(error.response.status);
    }
  };

  const checkEmail = async (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;

    if (email === "") {
      setEmailAvailable(true);
      return;
    }

    try {
      const res = await apiClient.post(CHECK_EMAIL, { email });

      const resStatus = res.status;

      if (resStatus === 409) {
        setEmailAvailable(false);
      } else {
        setEmailAvailable(true);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response.status) {
        setEmailAvailable(false);
      }
      console.log(error.response.status);
    }
  };

  const checkEmailValidity = (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;

    if (email === "") {
      setValidEmail(true);
      return;
    }

    // check if email is valid, by comparing it with a regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(email)) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  };

  const checkPasswordValidity = (password: string) => {
    // check if password is valid, by comparing it with a regex
    // the password should contain at least one uppercase letter, one lowercase letter, and one number, and be at least 8 characters long and have at least one special character

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (passwordRegex.test(password)) {
      setValidPassword(true);
    } else {
      setValidPassword(false);
    }
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === "userName") {
      checkUsername(e);
    }
    if (id === "email") {
      checkEmail(e);
      checkEmailValidity(e);
    }
    if (id === "password") {
      checkPasswordValidity(value);
    }
    setRegisterData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  useEffect(() => {
    const checkPasswordMatch = () => {
      if (registerData.confirmPassword === "") return;
      if (registerData.password === registerData.confirmPassword) {
        setPasswordsMatch(true);
      } else {
        setPasswordsMatch(false);
      }
    };

    const checkFieldsFilled = () => {
      // check if all the fields are filled
      if (
        registerData.name &&
        registerData.userName &&
        registerData.email &&
        registerData.password &&
        registerData.confirmPassword
      ) {
        setAllFilled(true);
      } else {
        setAllFilled(false);
      }
    };

    checkPasswordMatch();
    checkFieldsFilled();
  }, [registerData]);

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const data = {
      name: registerData.name,
      userName: registerData.userName,
      email: registerData.email,
      password: registerData.password,
    };

    if (!allFilled) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await apiClient.post(REGISTER_ROUTE, data, {
        withCredentials: true,
      });
      const resStatus = res.status;
      if (resStatus === 201) {
        setRegisterData({});
        setLoading(false);
        toast.success("Registration successful");
        window.location.reload();
      }
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
          onChange={handleInput}
          id="name"
        />
      </div>

      <div className="flex flex-col gap-1">
        <div
          className={cn(
            "flex gap-2 border rounded py-2 px-3",
            !usernameAvailable && "border-red-500"
          )}
        >
          <BiSolidUserBadge className="text-2xl text-gray-400" />
          <input
            type="text"
            placeholder="Username"
            className="flex-1 outline-none"
            onChange={handleInput}
            id="userName"
          />
        </div>
        {!usernameAvailable && (
          <p className="text-red-500">Username already taken</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div
          className={cn(
            "flex gap-2 border rounded py-2 px-3",
            (!emailAvailable || !validEmail) && "border-red-500"
          )}
        >
          <HiMail className="text-2xl text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            className="flex-1 outline-none"
            onChange={handleInput}
            id="email"
          />
        </div>
        {!emailAvailable && (
          <p className="text-red-500">
            Email already exists. If it belongs to you, try login
          </p>
        )}
        {!validEmail && (
          <p className="text-red-500">Please enter a valid email</p>
        )}
      </div>

      <div>
        <div className="flex gap-2 border rounded py-2 px-3">
          <HiLockClosed className="text-2xl text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="flex-1 outline-none"
            onChange={handleInput}
            id="password"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <IoEyeOff className="text-2xl text-gray-400" />
            ) : (
              <IoEye className="text-2xl text-gray-400" />
            )}
          </button>
        </div>
        {!validPassword && (
          <ul className="text-red-500">
            <p>
              Password must be at least 8 characters long, and contain:
              <ul className="list-disc px-5">
                <li>At least one uppercase letter</li>
                <li>At least one lowercase letter</li>
                <li>At least one number</li>
                <li>At least one special character</li>
              </ul>
            </p>
          </ul>
        )}
      </div>

      <div>
        <div className="flex gap-2 border rounded py-2 px-3">
          <BsFileLockFill className="text-2xl text-gray-400" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="flex-1 outline-none"
            onChange={handleInput}
            id="confirmPassword"
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
        {!passwordsMatch && (
          <p className="text-red-500">Passwords don&apos;t match</p>
        )}
      </div>

      <button
        disabled={
          !allFilled ||
          !validPassword ||
          !passwordsMatch ||
          !validEmail ||
          !emailAvailable ||
          !usernameAvailable
        }
        className={`text-white flex justify-center items-center py-2 rounded font-bold text-lg ${
          allFilled &&
          validPassword &&
          passwordsMatch &&
          validEmail &&
          emailAvailable &&
          usernameAvailable
            ? "bg-gradient-blue"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {loading ? (
          <img
            src="/graphics/loading.gif"
            alt="registering"
            className="h-10 w-fit"
          />
        ) : (
          "Register"
        )}
      </button>
    </form>
  );
}
