import { useState, useCallback } from "react";
import { AppointmentService } from "../../services/professionals/AppointmentService";

export function useProfessionalScheduleController(professionalId: string) {
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [booking, setBooking] = useState(false);

  const canConfirm = !!selectedDate && !!selectedTime;

  const loadDates = useCallback(async () => {
    setLoadingDates(true);
    try {
      const dates = await AppointmentService.getAvailableDates(professionalId);
      setAvailableDates(dates);
    } finally {
      setLoadingDates(false);
    }
  }, [professionalId]);

  const selectDate = useCallback(async (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setAvailableTimes([]);
    setLoadingTimes(true);
    try {
      const times = await AppointmentService.getAvailableTimes(professionalId, date);
      setAvailableTimes(times);
    } finally {
      setLoadingTimes(false);
    }
  }, [professionalId]);

  const selectTime = useCallback((time: string) => {
    setSelectedTime(time);
  }, []);

  const confirmAppointment = useCallback(async (): Promise<string> => {
    if (!selectedDate || !selectedTime) throw new Error("Missing date or time");
    setBooking(true);
    try {
      const result = await AppointmentService.createAppointment(
        professionalId,
        selectedDate,
        selectedTime
      );
      return result.id;
    } finally {
      setBooking(false);
    }
  }, [professionalId, selectedDate, selectedTime]);

  return {
    availableDates,
    availableTimes,
    selectedDate,
    selectedTime,
    loadingDates,
    loadingTimes,
    booking,
    canConfirm,
    loadDates,
    selectDate,
    selectTime,
    confirmAppointment,
  };
}
