/** Formats a Date using its local calendar fields (no UTC conversion/shift). */
export function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Today's date as "YYYY-MM-DD", in local time (not UTC). */
export function getTodayDateString(): string {
  return toDateString(new Date());
}
