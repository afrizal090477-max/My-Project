import apiHttp from "./http";

/**
 * Hapus Room berdasarkan ID dan tampilkan popup native browser saat sukses/gagal.
 * @param {string|number} roomId
 * @param {function} afterDelete (optional) - callback jika sukses, misal untuk refetch.
 */
export const deleteRoom = async (roomId, afterDelete) => {
  try {
    await apiHttp.delete(`/api/v1/rooms/${roomId}`);
    alert("[translate:Room berhasil dihapus!]");
    if (typeof afterDelete === "function") afterDelete();
  } catch (err) {
    alert(
      err?.response?.data?.message ||
      err?.message ||
      "[translate:Gagal menghapus room!]"
    );
  }
};
