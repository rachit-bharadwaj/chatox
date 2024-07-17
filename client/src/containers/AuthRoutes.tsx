import { ReactNode } from "react";
import useAppStore from "../store";
import { Navigate } from "react-router-dom";

const AuthRoutes = ({ children }: { children: ReactNode }) => {
  const { userData } = useAppStore();

  if (userData._id) return <Navigate to="/" />;
  else {
    return <>{children}</>;
  }
};

export default AuthRoutes;
