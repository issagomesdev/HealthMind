interface PendingCalendarFocus {
  date: string;
  appointmentId: string;
}

let pending: PendingCalendarFocus | null = null;

/** Remembers which date/appointment the calendar screen should scroll to once it regains focus. */
export function setPendingCalendarFocus(date: string, appointmentId: string): void {
  pending = { date, appointmentId };
}

/** Reads and clears the pending focus target, if any. */
export function consumePendingCalendarFocus(): PendingCalendarFocus | null {
  const current = pending;
  pending = null;
  return current;
}
