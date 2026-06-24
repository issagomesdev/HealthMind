import { getMockTimesForDate } from "../../data/fake/mockAvailability";

// Future: GET /appointments/available-dates, GET /appointments/available-times, POST /appointments

class AppointmentServiceImpl {
  // professionalId is accepted for API shape compatibility but ignored: mock
  // availability is the same for every professional and is generated
  // dynamically per month by AppointmentCalendar (see mockAvailability.ts).
  async getAvailableDates(_professionalId: string): Promise<string[]> {
    await new Promise((r) => setTimeout(r, 250));
    return [];
  }

  async getAvailableTimes(_professionalId: string, date: string): Promise<string[]> {
    await new Promise((r) => setTimeout(r, 200));
    return getMockTimesForDate(date);
  }

  async createAppointment(
    _professionalId: string,
    date: string,
    time: string
  ): Promise<{ id: string }> {
    await new Promise((r) => setTimeout(r, 700));
    return { id: `appt_${Date.now()}` };
  }
}

export const AppointmentService = new AppointmentServiceImpl();
