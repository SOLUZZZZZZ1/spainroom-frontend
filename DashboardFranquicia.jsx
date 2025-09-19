// src/pages/admin/DashboardFranquicia.jsx
import React, { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost, ADMIN_KEY } from "../../lib/api";

export default function DashboardFranquicia() {
  const [provincia, setProvincia] = useState("Madrid");
  const [estado, setEstado] = useState("todas");
  const [summary, setSummary] = useState(null);
  const [rows, setRows] = useState([]);
  const [sel, setSel] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function reload() {
    setLoading(true); setErr("");
    try {
      const [s, r] = await Promise.all([
        apiGet("/api/admin/franquicia/summary"),
        api
