// src/utils/jwt.js
import { jwtDecode } from "jwt-decode";

// Mengembalikan payload JWT atau null jika gagal
export function decodeToken(token) {
  try {
    return jwtDecode(token);
  } catch (error) {
      console.log(error);
    return null;
  }
}

// Mengecek apakah token expired (true/false)
export function isTokenExpired(token) {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;
  return payload.exp * 1000 < Date.now();
}
