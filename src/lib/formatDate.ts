export function formatDate(isoDate: string, upcoming?: boolean): string {
  const date = new Date(`${isoDate}T00:00:00`);
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return upcoming ? `${formatted} (scheduled)` : formatted;
}
