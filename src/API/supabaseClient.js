// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// GANTI dengan project kamu!
const supabaseUrl = "https://bxdjjhpyrnzxoooauvfi.supabase.co"; // Masukkan URL Supabase (lihat di Settings > API)
const supabaseAnonKey = "sb_publishable_j0TigkUo5eMnsklCgDiqfg_tv0nMweI"; // Masukkan anon public key (Settings > API)

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper upload ke bucket Supabase Storage
/**
 * Upload file ke bucket Supabase dan return URL public
 * @param {File} file - file gambar yang dipilih user
 * @param {string} bucketName - nama bucket di Supabase (default: 'room-images')
 * @param {string} [folder] - nama folder opsional
 * @returns {Promise<string>} publicUrl - URL public untuk di-store ke backend
 */
export async function uploadRoomImage(file, bucketName = "room-images", folder = "") {
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
  const path = folder ? `${folder}/${fileName}` : fileName;

  // Upload file ke bucket
  const { data, error } = await supabase
    .storage
    .from(bucketName)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type
    });

  if (error) throw error;

  // Dapatkan public URL
  const { data: publicData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(path);

  if (!publicData || !publicData.publicUrl) throw new Error("Failed to get public URL from Supabase");

  return publicData.publicUrl;
}
