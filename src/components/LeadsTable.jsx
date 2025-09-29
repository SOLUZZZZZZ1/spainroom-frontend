// src/components/LeadsTable.jsx
import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env?.VITE_API_BASE || "https://backend-spainroom.onrender.com";

export default function LeadsTable({ assignedTo }) {
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = use
