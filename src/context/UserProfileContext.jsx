import React, { createContext, useState, useContext, useEffect } from "react";
import { fetchProfile } from "../API/profileAPI";

const UserProfileContext = createContext();

export function UserProfileProvider({ children }) {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    role: "",
    photo: "",
  });

  // Fetch profile once on mount
  useEffect(() => {
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
        // fallback kosong, ignore error
      }
    })();
  }, []);

  // Agar halaman Setting bisa update langsung context:
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
