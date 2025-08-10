import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import useAppStore from "../store";

const PrivateRoutes = ({ children }: { children: ReactNode }) => {
  const { userData } = useAppStore();

  // Check if userData exists and has a valid _id
  if (!userData || !userData._id) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
};

export default PrivateRoutes;
