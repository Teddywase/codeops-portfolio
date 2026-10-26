function escapeCell(value) {
  const text = String(value ?? "");

  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const records = [
    headers,
    ...rows.map((row) => headers.map((header) => row?.[header])),
  ];

  return records.map((record) => record.map(escapeCell).join(",")).join("\r\n");
}

export function downloadCsv(text, filename) {
  if (typeof document === "undefined") {
    throw new Error("CSV downloads are only available in a browser.");
  }

  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);

  try {
    link.click();
  } finally {
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}