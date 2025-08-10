import { ReactNode } from "react";
import useAppStore from "../store";
import { Navigate } from "react-router-dom";

const AuthRoutes = ({ children }: { children: ReactNode }) => {
  const { userData } = useAppStore();

  // Check if userData exists and has a valid _id
  if (userData && userData._id) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

export default AuthRoutes;
