import { useEffect, useState } from "react";

// react router
import { Route, Routes } from "react-router-dom";

import Cookies from "js-cookie";

// local
import useAppStore from "./store";

// pages
import { Auth, Home, NotFound, Profile } from "./pages";

// containers
import { GET_USER_INFO } from "./constants";
import { AuthRoutes, PrivateRoutes } from "./containers";
import { apiClient } from "./utils/apiClient";

// shadcn
import { Toaster } from "./components/ui/sonner";

// components
import NotificationBanner from "./components/ui/notification-banner";

function App() {
  const token = Cookies.get("token");

  const { setUserData, userData } = useAppStore();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });
        const resData = await res.data;
        setUserData(resData.user);
        setLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (userData._id) return;

    if (token && !userData._id) {
      fetchUser();
    }
  }, [token, userData._id, setUserData]);

  if (loading) return null;

  return (
    <>
      {/* Notification Permission Banner */}
      <NotificationBanner />
      
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoutes>
              <Home />
            </PrivateRoutes>
          }
        />
        <Route
          path="/auth"
          element={
            <AuthRoutes>
              <Auth />
            </AuthRoutes>
          }
        />

        <Route path="/:userName" element={<Profile />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
