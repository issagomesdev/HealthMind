import { useState, useEffect, useCallback } from "react";
import { professionalAvailabilityService } from "../services/professionalAvailabilityService";
import type {
  ProfessionalAvailability,
  WeeklyAvailability,
  BreakConfig,
  FormatConfig,
  AppointmentRule,
  AppointmentTypeConfig,
  UnavailablePeriod,
  AvailableSlot,
} from "../types/professionalAvailability";

export function useProfessionalAvailability() {
  const [availability, setAvailability] =
    useState<ProfessionalAvailability | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [data, slots] = await Promise.all([
        professionalAvailabilityService.getProfessionalAvailability(),
        professionalAvailabilityService.getAvailableTimeSlots(),
      ]);
      setAvailability(data);
      setAvailableSlots(slots);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleGeneralAvailability = useCallback(() => {
    setAvailability((prev) =>
      prev ? { ...prev, isGenerallyAvailable: !prev.isGenerallyAvailable } : prev
    );
  }, []);

  const updateDefaultDuration = useCallback((durationMinutes: number) => {
    setAvailability((prev) =>
      prev ? { ...prev, defaultDurationMinutes: durationMinutes } : prev
    );
  }, []);

  const updateWeeklySchedule = useCallback(
    (schedule: Partial<WeeklyAvailability>) => {
      setAvailability((prev) =>
        prev
          ? {
              ...prev,
              weeklySchedule: { ...prev.weeklySchedule, ...schedule },
            }
          : prev
      );
    },
    []
  );

  const updateBreakConfig = useCallback((config: Partial<BreakConfig>) => {
    setAvailability((prev) =>
      prev
        ? { ...prev, breakConfig: { ...prev.breakConfig, ...config } }
        : prev
    );
  }, []);

  const updateFormatConfig = useCallback((config: Partial<FormatConfig>) => {
    setAvailability((prev) =>
      prev
        ? { ...prev, formatConfig: { ...prev.formatConfig, ...config } }
        : prev
    );
  }, []);

  const updateBookingRules = useCallback((rules: Partial<AppointmentRule>) => {
    setAvailability((prev) =>
      prev
        ? { ...prev, bookingRules: { ...prev.bookingRules, ...rules } }
        : prev
    );
  }, []);

  const updateAppointmentTypes = useCallback(
    (types: AppointmentTypeConfig[]) => {
      setAvailability((prev) =>
        prev ? { ...prev, appointmentTypes: types } : prev
      );
    },
    []
  );

  const addUnavailablePeriod = useCallback(
    async (period: Omit<UnavailablePeriod, "id">) => {
      const newPeriod =
        await professionalAvailabilityService.addUnavailablePeriod(period);
      setAvailability((prev) =>
        prev
          ? {
              ...prev,
              unavailablePeriods: [...prev.unavailablePeriods, newPeriod],
            }
          : prev
      );
    },
    []
  );

  const removeUnavailablePeriod = useCallback(async (id: string) => {
    await professionalAvailabilityService.removeUnavailablePeriod(id);
    setAvailability((prev) =>
      prev
        ? {
            ...prev,
            unavailablePeriods: prev.unavailablePeriods.filter(
              (p) => p.id !== id
            ),
          }
        : prev
    );
  }, []);

  const save = useCallback(async (): Promise<boolean> => {
    if (!availability) return false;
    setIsSaving(true);
    try {
      const updated =
        await professionalAvailabilityService.updateProfessionalAvailability(
          availability
        );
      setAvailability(updated);
      // Refresh slots after save
      const slots =
        await professionalAvailabilityService.getAvailableTimeSlots();
      setAvailableSlots(slots);
      return true;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [availability]);

  const reset = useCallback(async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      const data =
        await professionalAvailabilityService.resetAvailabilityToDefault();
      setAvailability(data);
      const slots =
        await professionalAvailabilityService.getAvailableTimeSlots();
      setAvailableSlots(slots);
      return true;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    availability,
    availableSlots,
    isLoading,
    isSaving,
    toggleGeneralAvailability,
    updateDefaultDuration,
    updateWeeklySchedule,
    updateBreakConfig,
    updateFormatConfig,
    updateBookingRules,
    updateAppointmentTypes,
    addUnavailablePeriod,
    removeUnavailablePeriod,
    save,
    reset,
  };
}
