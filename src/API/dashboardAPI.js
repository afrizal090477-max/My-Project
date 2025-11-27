import apiHttp from "./http";

/**
 * Ambil semua reservations untuk range tanggal (loop semua page).
 */
const fetchAllReservations = async (startDate = null, endDate = null) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  let currentPage = 1;
  const pageSize = 50; // bebas, asal >= pageSize report
  let totalPages = 1;
  const allRows = [];

  while (currentPage <= totalPages) {
    const res = await apiHttp.get("/api/v1/reservations", {
      params: { ...params, page: currentPage, limit: pageSize },
    });

    const root = res.data || {};
    const dataPart = Array.isArray(root.data)
      ? root.data
      : Array.isArray(root.data?.rows)
      ? root.data.rows
      : Array.isArray(root.rows)
      ? root.rows
      : Array.isArray(root)
      ? root
      : [];

    allRows.push(...dataPart);

    const pag = root.pagination || root.data?.pagination || {};
    totalPages = pag.totalPages || pag.total_pages || totalPages;
    if (!totalPages) totalPages = 1;

    currentPage += 1;
  }

  return allRows;
};

/**
 * Ambil semua master room supaya room yang belum pernah dipakai tetap muncul.
 */
const fetchAllRooms = async () => {
  let currentPage = 1;
  const pageSize = 50; // pastikan >= pageSize di menu Room (sekarang 10)
  let totalPages = 1;
  const allRooms = [];

  while (currentPage <= totalPages) {
    const res = await apiHttp.get("/api/v1/rooms", {
      params: { page: currentPage, limit: pageSize },
    });

    const root = res.data || {};
    const dataPart = Array.isArray(root.data)
      ? root.data
      : Array.isArray(root.rooms)
      ? root.rooms
      : Array.isArray(root)
      ? root
      : [];

    allRooms.push(...dataPart);

    const pag = root.pagination || root.data?.pagination || {};
    totalPages = pag.totalPages || pag.total_pages || totalPages;
    if (!totalPages) totalPages = 1;

    currentPage += 1;
  }

  return allRooms;
};


/**
 * Dashboard summary + per-room stats (name, percentage, omzet).
 */
export const fetchDashboardData = async (startDate = null, endDate = null) => {
  // --- DASHBOARD SUMMARY ---
  const dashParams = {};
  if (startDate) dashParams.startDate = startDate;
  if (endDate) dashParams.endDate = endDate;

  const dashboardRes = await apiHttp.get("/api/v1/dashboard", {
    params: dashParams,
  });

  const dashRoot = dashboardRes.data || {};
  const dashData = dashRoot.data || dashRoot || {};

  const summary = {
    totalMoney: Number(dashData.totalMoney || dashData.total_money || 0),
    totalReservations: Number(
      dashData.totalReservations || dashData.total_reservations || 0
    ),
    totalVisitors: Number(
      dashData.totalVisitors || dashData.total_visitors || 0
    ),
    totalRooms: Number(dashData.totalRooms || dashData.total_rooms || 0),
  };

  // --- reservations (semua page) ---
  const reservations = await fetchAllReservations(startDate, endDate);

  const perRoom = new Map();

  reservations.forEach((item) => {
    const roomId =
      item.room_id ||
      item.roomId ||
      item.id_room ||
      item.rooms?.id;

    const roomName =
      item.rooms?.room_name ||
      item.room_name ||
      item.room ||
      "-";

    if (!roomId) return;

    const pricePerHour = Number(
      item.rooms?.price ||
        item.price_hour ||
        item.price ||
        0
    );

    const startTime = item.start_time || "";
    const endTime = item.end_time || "";

    let durationHours = 1;
    if (
      startTime &&
      endTime &&
      startTime.includes(":") &&
      endTime.includes(":")
    ) {
      const [sh, sm] = startTime.split(":").map(Number);
      const [eh, em] = endTime.split(":").map(Number);
      const start = sh + (sm || 0) / 60;
      const end = eh + (em || 0) / 60;
      const diff = end - start;
      durationHours = diff > 0 ? diff : 1;
    }

    const omzetReservation = pricePerHour * durationHours;

    if (!perRoom.has(roomId)) {
      perRoom.set(roomId, {
        id: roomId,
        name: roomName,
        totalReservation: 0,
        totalOmzet: 0,
      });
    }

    const r = perRoom.get(roomId);
    r.totalReservation += 1;
    r.totalOmzet += omzetReservation;
  });

  // --- gabung master room supaya semua room muncul ---
  const masterRooms = await fetchAllRooms();
  masterRooms.forEach((mr) => {
    const id = mr.id || mr.room_id;
    const name = mr.room_name || mr.name || mr.room || "-";
    if (!id) return;

    if (!perRoom.has(id)) {
      perRoom.set(id, {
        id,
        name,
        totalReservation: 0,
        totalOmzet: 0,
      });
    } else {
      const r = perRoom.get(id);
      if (!r.name || r.name === "-") {
        r.name = name;
      }
    }
  });

  const roomsArr = Array.from(perRoom.values());
  const maxReservation = roomsArr.reduce(
    (max, r) => Math.max(max, r.totalReservation),
    0
  );

  const rooms = roomsArr.map((r) => {
    const percentage =
      maxReservation > 0
        ? Math.round((r.totalReservation / maxReservation) * 100)
        : 0;

    return {
      id: r.id,
      name: r.name,
      percentage,
      omzet: r.totalOmzet,
    };
  });

  return {
    totalMoney: summary.totalMoney,
    totalReservations: summary.totalReservations,
    totalVisitors: summary.totalVisitors,
    totalRooms: summary.totalRooms || rooms.length,
    rooms,
    masterRooms,
  };
};
