import React, { useState } from "react";
import { uploadRoomImage } from "../API/supabaseClient";

// Props: onChange(url) → callback setelah upload, mengembalikan URL ke parent/form
export default function RoomImageUpload({ onChange }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setPreview(URL.createObjectURL(file));
    try {
      const url = await uploadRoomImage(file); // upload ke bucket default
      onChange(url);
    } catch (err) {
      alert("Upload gagal: " + err.message);
    }
    setUploading(false);
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
      {uploading && <span>Uploading...</span>}
      {preview && <div style={{ marginTop: 8 }}><img src={preview} alt="preview" width={150}/></div>}
    </div>
  );
}
