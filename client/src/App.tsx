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
        setLoading(false);
      }
    };

    // Only fetch user if we have a token and no user data
    if (token && (!userData || !userData._id)) {
      setLoading(true);
      fetchUser();
    } else if (!token) {
      setLoading(false);
    }
  }, [token, userData, setUserData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
