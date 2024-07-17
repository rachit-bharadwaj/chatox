import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import useAppStore from "../store";

const PrivateRoutes = ({ children }: { children: ReactNode }) => {
  const { userData } = useAppStore();

  if (!userData._id) return <Navigate to="/auth" />;
  else {
    return <>{children}</>;
  }
};

export default PrivateRoutes;
