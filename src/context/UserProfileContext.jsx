import React, { createContext, useState, useContext, useEffect } from "react";
import { fetchProfile } from "../API/profileAPI";
import { useAuth } from "../context/AuthContext";

const UserProfileContext = createContext();

export function UserProfileProvider({ children }) {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    role: "",
    photo: "",
  });
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      setProfile({ username: "", email: "", role: "", photo: "" });
      return;
    }
    (async () => {
      try {
        const data = await fetchProfile();
        setProfile({
          username: data.username,
          email: data.email,
          role: data.role,
          photo: data.photo_url || data.photo || "",
        });
      } catch {
        setProfile({ username: "", email: "", role: "", photo: "" }); // fallback safe
      }
    })();
  }, [token]);

  const updateProfilePhoto = (newPhoto) => {
    setProfile((prev) => ({ ...prev, photo: newPhoto }));
  };

  const updateProfileAll = (p) => setProfile((prev) => ({ ...prev, ...p }));

  return (
    <UserProfileContext.Provider value={{ profile, updateProfilePhoto, updateProfileAll }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  return useContext(UserProfileContext);
}
