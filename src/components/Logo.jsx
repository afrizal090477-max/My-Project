import React from "react";

export default function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
      <div
        style={{
          width: 48,
          height: 48,
          backgroundColor: "#FF9800",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          color: "white",
          marginBottom: 8,
          fontWeight: 700
        }}
      >
        E
      </div>
      <div style={{ color: "#FF9800", fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
        E-Meeting
      </div>
    </div>
  );
}
