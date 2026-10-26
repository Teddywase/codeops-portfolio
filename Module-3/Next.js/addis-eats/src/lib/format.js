export const etb = new Intl.NumberFormat("en-ET", {
  style: "currency",
  currency: "ETB",
  maximumFractionDigits: 0,
});

export const when = new Intl.DateTimeFormat("en-ET", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Addis_Ababa",
});

export const relative = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

const relativeUnits = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
  ["second", 1],
];

export function formatEtb(value) {
  return etb.format(value);
}

export function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return when.format(date);
}

export function formatRelative(value, now = Date.now()) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  const differenceInSeconds = (date.getTime() - now) / 1_000;
  const [unit, secondsPerUnit] = relativeUnits.find(
    ([, seconds]) => Math.abs(differenceInSeconds) >= seconds,
  ) ?? relativeUnits.at(-1);

  return relative.format(
    Math.round(differenceInSeconds / secondsPerUnit),
    unit,
  );
}
