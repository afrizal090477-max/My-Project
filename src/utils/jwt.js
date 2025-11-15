import { jwtDecode } from "jwt-decode";

// Mengembalikan payload JWT atau null jika gagal decode
export function decodeToken(token) {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Mengecek apakah token sudah expired (true = expired)
export function isTokenExpired(token) {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;
  return payload.exp * 1000 < Date.now();
}

// Mapping role berdasarkan payload JWT
export function mapRoleFromPayload(payload) {
  if (!payload) return "user";
  if (payload.is_admin === true) return "admin";
  if (payload.email === "admin@mail.com") return "admin";
  if (payload.user_id === 1 || payload.user_id === "1") return "admin";
  return "user";
}

// Helper untuk langsung ambil role dari token
export function getRoleFromToken(token) {
  const payload = decodeToken(token);
  return mapRoleFromPayload(payload);
}
