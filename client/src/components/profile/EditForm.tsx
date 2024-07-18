/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useEffect, useState } from "react";
import { User } from "../../types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { TiUser } from "react-icons/ti";
import { apiClient } from "../../utils/apiClient";
import { EDIT_PROFILE } from "../../constants";
import { toast } from "sonner";

export default function EditForm({ profileData }: { profileData: User }) {
  const [previewURL, setPreviewURL] = useState<string>(
    profileData.profilePicture || ""
  );
  const [editedData, setEditedData] = useState<User>(profileData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();
    formData.append("_id", editedData._id!);
    formData.append("name", editedData.name!);
    formData.append("userName", editedData.userName!);
    formData.append("bio", editedData.bio!);
    if (selectedFile) {
      formData.append("profilePicture", selectedFile);
    }

    try {
      const res = await apiClient.post(EDIT_PROFILE, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const resData = await res.data;
      if (resData.user) {
        setLoading(false);
        toast.success("Profile updated successfully");
        setEditedData(resData.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setEditedData((prevData) => ({
      ...prevData,
      profilePicture: previewURL,
    }));
  }, [previewURL]);

  return (
    <form onSubmit={handleSubmit}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="text-blue-500 border border-blue-500 px-5 py-2 rounded-lg">
            Edit profile
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <div className="items-center h-fit w-fit border rounded-xl p-5 mx-auto">
            <>
              <label
                htmlFor="profile-pic"
                className="flex gap-3 items-center cursor-pointer"
              >
                {editedData.profilePicture ? (
                  <img
                    src={editedData.profilePicture}
                    alt={editedData.name}
                    className="w-40 h-40 rounded-full"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <TiUser className="h-20 w-20 text-gray-500" />
                    <p className="text-gray-400">New profile picture</p>
                  </div>
                )}
              </label>
              <input
                type="file"
                name="profile-pic"
                accept="image/*"
                id="profile-pic"
                hidden
                onChange={handleInput}
              />
            </>
            {/* )} */}
          </div>

          <div className="border rounded-lg flex gap-2 items-center">
            <label
              htmlFor="name"
              className="bg-gray-700 text-white p-3 rounded-l-lg"
            >
              Name:
            </label>
            <input
              type="text"
              defaultValue={editedData.name}
              className="outline-none py-3 w-full pr-3"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setEditedData({ ...editedData, name: e.target.value });
              }}
            />
          </div>

          <div className="border rounded-lg flex gap-2 items-center">
            <label
              htmlFor="userName"
              className="bg-gray-700 text-white p-3 rounded-l-lg"
            >
              Username
            </label>
            <input
              type="text"
              defaultValue={editedData.userName}
              className="outline-none py-3 w-full pr-3"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setEditedData({ ...editedData, userName: e.target.value });
              }}
            />
          </div>
          <div className="border rounded-lg flex gap-2 items-center">
            <label
              htmlFor="bio"
              className="bg-gray-700 text-white p-3 rounded-l-lg"
            >
              Bio
            </label>
            <input
              type="text"
              defaultValue={editedData.bio}
              className="outline-none py-3 w-full pr-3"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setEditedData({ ...editedData, bio: e.target.value });
              }}
              placeholder="Your bio goes here..."
            />
          </div>

          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <button type="submit" onClick={handleSubmit}>
              {loading ? (
                <img
                  src="/graphics/loading.gif"
                  alt="updating profile"
                  className="w-10"
                />
              ) : (
                "Save"
              )}
            </button>
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
