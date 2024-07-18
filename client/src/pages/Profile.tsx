import { FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

// locals
import { Contact, User } from "../types";
import { apiClient } from "../utils/apiClient";
import { FETCH_BY_USERNAME } from "../constants";
import useAppStore from "../store";

// icons
import { TiUser } from "react-icons/ti";

// shadcn
import { toast } from "sonner";

// components
import { EditForm } from "../components/profile";
import { Navbar } from "../components/shared";

const UserPage: FC = () => {
  const { userName } = useParams<{ userName: string }>();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [NotFound, setNotFound] = useState(false);

  const { userData, setSelectedChatData } = useAppStore();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await apiClient.post(
          FETCH_BY_USERNAME,
          { userName },
          { withCredentials: true }
        );
        const resData = res.data;
        console.log(res.status);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        setProfileData(resData.user);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setNotFound(true);
        setLoading(false);
      }
    };

    if (userName) {
      fetchUserData();
    }
  }, [userName]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (NotFound) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Navbar />
        <p className="text-5xl text-indigo-500 font-bold">Page Not Found</p>
      </div>
    );
  }

  const copyProfileLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("Link copied to clipboard!");
  };

  return (
    <div className="p-3">
      <Navbar />

      <div className="flex justify-center text-center flex-col items-center gap-5 mt-20">
        {profileData?.profilePicture ? (
          <img
            src={profileData.profilePicture}
            alt={profileData.name}
            className="h-28 w-28 rounded-full"
          />
        ) : (
          <TiUser className="h-28 w-28 rounded-full text-gray-500 border" />
        )}

        <div>
          <h1 className="text-3xl font-bold">{profileData?.name}</h1>
          <p className="text-gray-500">@{profileData?.userName}</p>
          <p className="text-gray-500">{profileData?.email}</p>
        </div>

        <div className="text-gray-500 text-justify max-w-lg">
          {profileData?.bio}
        </div>
      </div>

      <div className="my-10 gap-10 flex-wrap flex justify-center">
        <button
          className="bg-blue-500 border text-white px-5 py-2 rounded-lg"
          onClick={copyProfileLink}
        >
          Copy profile link
        </button>
        {userData.userName === userName ? (
          <EditForm profileData={profileData!} />
        ) : (
          <Link
            to="/"
            className="text-blue-500 border border-blue-500 px-5 py-2 rounded-lg"
            onClick={() => setSelectedChatData(profileData as Contact)}
          >
            Send message
          </Link>
        )}
      </div>
    </div>
  );
};

export default UserPage;
