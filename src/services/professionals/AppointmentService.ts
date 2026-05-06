import fakeAppointments from "../../data/fake/appointments.json";

interface SlotRecord {
  professionalId: string;
  date: string;
  times: string[];
}

// Future: GET /appointments/available-dates, GET /appointments/available-times, POST /appointments

class AppointmentServiceImpl {
  private slots: SlotRecord[] = fakeAppointments.availableSlots;

  async getAvailableDates(professionalId: string): Promise<string[]> {
    await new Promise((r) => setTimeout(r, 250));
    return this.slots
      .filter((s) => s.professionalId === professionalId)
      .map((s) => s.date)
      .sort();
  }

  async getAvailableTimes(professionalId: string, date: string): Promise<string[]> {
    await new Promise((r) => setTimeout(r, 200));
    const slot = this.slots.find(
      (s) => s.professionalId === professionalId && s.date === date
    );
    return slot?.times.sort() ?? [];
  }

  async createAppointment(
    professionalId: string,
    date: string,
    time: string
  ): Promise<{ id: string }> {
    await new Promise((r) => setTimeout(r, 700));
    // Remove the booked time from mock
    const slot = this.slots.find(
      (s) => s.professionalId === professionalId && s.date === date
    );
    if (slot) {
      slot.times = slot.times.filter((t) => t !== time);
    }
    return { id: `appt_${Date.now()}` };
  }
}

export const AppointmentService = new AppointmentServiceImpl();
