export function toCSV(rows) {
  if (!rows?.length) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  const head = headers.map(esc).join(",");
  const body = rows.map((r) => headers.map((h) => esc(r[h])).join(",")).join("\n");
  return head + "\n" + body;
}

export function downloadCSV(filename, rows) {
  const csv = toCSV(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
