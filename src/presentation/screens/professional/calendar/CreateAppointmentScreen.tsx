import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../../../components/ui/AppText";
import { AppButton } from "../../../components/ui/AppButton";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ConfirmActionModal } from "../../../components/ui/ConfirmActionModal";
import { SuccessModal } from "../../../components/ui/SuccessModal";
import { useModal } from "../../../../hooks/useModal";
import { TopBar } from "../../../components/navigation/TopBar";
import { useTheme } from "../../../../core/theme";
import { patientsService } from "../../../../services/patients/PatientsService";
import { professionalCalendarService } from "../../../../services/professionalCalendarService";
import {
  AppointmentType,
  AppointmentFormat,
  RecurrenceType,
  ReminderBefore,
  ProfessionalAppointment,
} from "../../../../types/professionalCalendar";

// ─── Types ──────────────────────────────────────────────────────────────────

interface PatientOption {
  id: string;
  name: string;
  riskLevel: "stable" | "attention" | "high_risk" | "critical";
}

// ─── Mask helpers ────────────────────────────────────────────────────────────

function applyDateMask(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function applyTimeMask(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

// DD/MM/AAAA → YYYY-MM-DD (for service)
function parseDateBR(display: string): string {
  const [dd, mm, yyyy] = display.split("/");
  return `${yyyy}-${mm}-${dd}`;
}

function applyMoneyMask(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  const num = parseInt(digits, 10);
  if (!num) return "";
  return "R$ " + (num / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseMoneyValue(masked: string): number | null {
  if (!masked) return null;
  const cleaned = parseFloat(masked.replace("R$ ", "").replace(/\./g, "").replace(",", "."));
  return isNaN(cleaned) || cleaned === 0 ? null : cleaned;
}

// ─── Chip helpers ──────────────────────────────────────────────────────────

interface ChipOption<T> {
  value: T;
  label: string;
}

const DURATION_OPTIONS: ChipOption<number>[] = [
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 50, label: "50 min" },
  { value: 60, label: "60 min" },
  { value: 90, label: "90 min" },
];

const FORMAT_OPTIONS: ChipOption<AppointmentFormat>[] = [
  { value: "online", label: "Online" },
  { value: "in_person", label: "Presencial" },
  { value: "hybrid", label: "Híbrido" },
];

const FORMAT_LABELS: Record<AppointmentFormat, string> = {
  online: "Online",
  in_person: "Presencial",
  hybrid: "Híbrido",
};

const TYPE_OPTIONS: ChipOption<AppointmentType>[] = [
  { value: "initial_assessment", label: "Avaliação inicial" },
  { value: "follow_up", label: "Acompanhamento" },
  { value: "return", label: "Retorno" },
  { value: "emergency", label: "Emergência" },
  { value: "review", label: "Revisão" },
];

const TYPE_LABELS: Record<AppointmentType, string> = {
  initial_assessment: "Avaliação inicial",
  follow_up: "Acompanhamento",
  return: "Retorno",
  emergency: "Emergência",
  review: "Revisão",
};

const RECURRENCE_OPTIONS: ChipOption<RecurrenceType>[] = [
  { value: "none", label: "Não repetir" },
  { value: "weekly", label: "Semanal" },
  { value: "biweekly", label: "Quinzenal" },
  { value: "monthly", label: "Mensal" },
];

const REMINDER_OPTIONS: ChipOption<ReminderBefore>[] = [
  { value: "10min", label: "10 min" },
  { value: "30min", label: "30 min" },
  { value: "1hour", label: "1 hora" },
  { value: "1day", label: "1 dia" },
];

function ChipGroup<T extends string | number>({
  options,
  selected,
  onSelect,
  colors,
}: {
  options: ChipOption<T>[];
  selected: T;
  onSelect: (v: T) => void;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
      {options.map((opt) => {
        const isSelected = opt.value === selected;
        return (
          <TouchableOpacity
            key={String(opt.value)}
            onPress={() => onSelect(opt.value)}
            activeOpacity={0.7}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 99,
              backgroundColor: isSelected ? colors.secondary : colors.muted,
              borderWidth: isSelected ? 0 : 1,
              borderColor: colors.border,
            }}
          >
            <AppText
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: isSelected ? "#fff" : colors.subtle,
              }}
            >
              {opt.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function SectionLabel({ label, colors }: { label: string; colors: ReturnType<typeof useTheme>["colors"] }) {
  return (
    <AppText
      style={{
        fontSize: 12,
        fontWeight: "700",
        color: colors.subtle,
        textTransform: "uppercase",
        letterSpacing: 0.6,
        marginBottom: 6,
        marginTop: 20,
      }}
    >
      {label}
    </AppText>
  );
}

// ─── Patient Select Modal ────────────────────────────────────────────────────

function PatientSelectModal({
  visible,
  patients,
  onSelect,
  onClose,
  colors,
}: {
  visible: boolean;
  patients: PatientOption[];
  onSelect: (p: PatientOption) => void;
  onClose: () => void;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  const [search, setSearch] = useState("");
  const searchRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      setSearch("");
      setTimeout(() => searchRef.current?.focus(), 120);
    }
  }, [visible]);

  const filtered = search.trim()
    ? patients.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : patients;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      {/* Full-screen container */}
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        {/* Backdrop — absolute, tapping closes modal */}
        <TouchableOpacity
          style={{ ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" }}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Bottom sheet */}
        <View
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: "78%",
            paddingBottom: insets.bottom || 16,
          }}
        >
          {/* Handle */}
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: colors.border,
              alignSelf: "center",
              marginTop: 12,
              marginBottom: 16,
            }}
          />

          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              marginBottom: 14,
            }}
          >
            <AppText style={{ fontSize: 17, fontWeight: "700", color: colors.content }}>
              Selecionar paciente
            </AppText>
            <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
              <Ionicons name="close" size={22} color={colors.subtle} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              marginHorizontal: 20,
              paddingHorizontal: 14,
              marginBottom: 8,
              minHeight: 48,
              gap: 10,
            }}
          >
            <Ionicons name="search-outline" size={18} color={colors.subtle} />
            <TextInput
              ref={searchRef}
              style={{ flex: 1, fontSize: 15, color: colors.content, paddingVertical: 10 }}
              placeholder="Buscar por nome..."
              placeholderTextColor={colors.subtle}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")} style={{ padding: 2 }}>
                <Ionicons name="close-circle" size={18} color={colors.subtle} />
              </TouchableOpacity>
            )}
          </View>

          {/* List */}
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            {filtered.length === 0 ? (
              <View style={{ alignItems: "center", paddingVertical: 32 }}>
                <Ionicons name="person-outline" size={36} color={colors.border} />
                <AppText style={{ fontSize: 14, color: colors.subtle, marginTop: 10 }}>
                  Nenhum paciente encontrado
                </AppText>
              </View>
            ) : (
              filtered.map((p, idx) => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => { onSelect(p); onClose(); }}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 20,
                    paddingVertical: 14,
                    borderBottomWidth: idx < filtered.length - 1 ? 1 : 0,
                    borderBottomColor: colors.border,
                    gap: 14,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: colors.secondary + "25",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AppText style={{ fontSize: 15, fontWeight: "700", color: colors.secondary }}>
                      {p.name.trim().split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                    </AppText>
                  </View>

                  <View style={{ flex: 1 }}>
                    <AppText style={{ fontSize: 15, fontWeight: "600", color: colors.content }}>
                      {p.name}
                    </AppText>
                  </View>

                  <Ionicons name="chevron-forward" size={16} color={colors.border} />
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── Date Picker Modal ───────────────────────────────────────────────────────

const PT_MONTHS_FULL = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];
const WEEK_LABELS = ["D","S","T","Q","Q","S","S"];

function DatePickerModal({
  visible,
  selectedDisplay,
  onSelect,
  onClose,
  colors,
}: {
  visible: boolean;
  selectedDisplay: string;
  onSelect: (display: string) => void;
  onClose: () => void;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  const today = new Date();
  const todayDisplay = [
    String(today.getDate()).padStart(2, "0"),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getFullYear()),
  ].join("/");

  const parseInitial = () => {
    const m = selectedDisplay.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (m) return { year: parseInt(m[3]), month: parseInt(m[2]) };
    return { year: today.getFullYear(), month: today.getMonth() + 1 };
  };

  const [pickerYear, setPickerYear] = useState(parseInitial().year);
  const [pickerMonth, setPickerMonth] = useState(parseInitial().month);

  useEffect(() => {
    if (visible) {
      const { year, month } = parseInitial();
      setPickerYear(year);
      setPickerMonth(month);
    }
  }, [visible]);

  const daysInMonth = new Date(pickerYear, pickerMonth, 0).getDate();
  const firstDow = new Date(pickerYear, pickerMonth - 1, 1).getDay();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  const prevMonth = () => {
    if (pickerMonth === 1) { setPickerYear((y) => y - 1); setPickerMonth(12); }
    else setPickerMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (pickerMonth === 12) { setPickerYear((y) => y + 1); setPickerMonth(1); }
    else setPickerMonth((m) => m + 1);
  };

  const handleDay = (day: number) => {
    const dd = String(day).padStart(2, "0");
    const mm = String(pickerMonth).padStart(2, "0");
    onSelect(`${dd}/${mm}/${pickerYear}`);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View
            style={{
              width: 320,
              backgroundColor: colors.surface,
              borderRadius: 20,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.18,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            {/* Month nav */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <TouchableOpacity onPress={prevMonth} style={{ padding: 8 }}>
                <Ionicons name="chevron-back" size={20} color={colors.content} />
              </TouchableOpacity>
              <AppText style={{ fontSize: 16, fontWeight: "700", color: colors.content }}>
                {PT_MONTHS_FULL[pickerMonth - 1]} {pickerYear}
              </AppText>
              <TouchableOpacity onPress={nextMonth} style={{ padding: 8 }}>
                <Ionicons name="chevron-forward" size={20} color={colors.content} />
              </TouchableOpacity>
            </View>

            {/* Weekday headers */}
            <View style={{ flexDirection: "row", marginBottom: 6 }}>
              {WEEK_LABELS.map((d, i) => (
                <View key={i} style={{ flex: 1, alignItems: "center" }}>
                  <AppText style={{ fontSize: 11, fontWeight: "600", color: colors.subtle }}>{d}</AppText>
                </View>
              ))}
            </View>

            {/* Day grid */}
            {rows.map((row, ri) => (
              <View key={ri} style={{ flexDirection: "row", marginBottom: 2 }}>
                {row.map((day, ci) => {
                  if (!day) return <View key={`e-${ri}-${ci}`} style={{ flex: 1, height: 38 }} />;
                  const dd = String(day).padStart(2, "0");
                  const mm = String(pickerMonth).padStart(2, "0");
                  const thisDisplay = `${dd}/${mm}/${pickerYear}`;
                  const isSelected = thisDisplay === selectedDisplay;
                  const isToday = thisDisplay === todayDisplay;
                  return (
                    <TouchableOpacity
                      key={day}
                      onPress={() => handleDay(day)}
                      activeOpacity={0.7}
                      style={{ flex: 1, height: 38, alignItems: "center", justifyContent: "center" }}
                    >
                      <View
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 17,
                          backgroundColor: isSelected ? colors.secondary : "transparent",
                          borderWidth: isToday && !isSelected ? 1.5 : 0,
                          borderColor: colors.secondary,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <AppText
                          style={{
                            fontSize: 14,
                            fontWeight: isSelected || isToday ? "700" : "400",
                            color: isSelected ? "#fff" : isToday ? colors.secondary : colors.content,
                          }}
                        >
                          {day}
                        </AppText>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}

            <TouchableOpacity
              onPress={onClose}
              style={{
                marginTop: 14,
                alignItems: "center",
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: colors.muted,
              }}
            >
              <AppText style={{ fontSize: 14, fontWeight: "600", color: colors.subtle }}>Fechar</AppText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── Time Picker Modal ───────────────────────────────────────────────────────

const HOURS_LIST = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINS_LIST = ["00","05","10","15","20","25","30","35","40","45","50","55"];
const ITEM_H = 48;
const VISIBLE_ITEMS = 5;
const COL_PADDING = ITEM_H * 2;

function TimePickerModal({
  visible,
  value,
  onConfirm,
  onClose,
  colors,
}: {
  visible: boolean;
  value: string;
  onConfirm: (time: string) => void;
  onClose: () => void;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  const getInitial = (v: string) => {
    const m = v.match(/^(\d{2}):(\d{2})$/);
    if (m) {
      const hIdx = HOURS_LIST.indexOf(m[1]);
      const rawMin = parseInt(m[2]);
      const minIdx = MINS_LIST.findIndex((min) => parseInt(min) >= rawMin);
      return { hIdx: hIdx >= 0 ? hIdx : 9, minIdx: minIdx >= 0 ? minIdx : 0 };
    }
    return { hIdx: 9, minIdx: 0 };
  };

  const [selectedH, setSelectedH] = useState(() => getInitial(value).hIdx);
  const [selectedMin, setSelectedMin] = useState(() => getInitial(value).minIdx);
  const hourRef = useRef<ScrollView>(null);
  const minRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible) {
      const { hIdx, minIdx } = getInitial(value);
      setSelectedH(hIdx);
      setSelectedMin(minIdx);
      setTimeout(() => {
        hourRef.current?.scrollTo({ y: hIdx * ITEM_H, animated: false });
        minRef.current?.scrollTo({ y: minIdx * ITEM_H, animated: false });
      }, 80);
    }
  }, [visible]);

  const PickerColumn = ({
    items,
    selectedIdx,
    onSelect,
    scrollRef,
  }: {
    items: string[];
    selectedIdx: number;
    onSelect: (i: number) => void;
    scrollRef: React.RefObject<ScrollView>;
  }) => (
    <View style={{ width: 72, height: ITEM_H * VISIBLE_ITEMS, overflow: "hidden" }}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: COL_PADDING }}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
          onSelect(Math.max(0, Math.min(idx, items.length - 1)));
        }}
        onScrollEndDrag={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
          onSelect(Math.max(0, Math.min(idx, items.length - 1)));
        }}
      >
        {items.map((item, i) => {
          const isSel = i === selectedIdx;
          return (
            <TouchableOpacity
              key={item}
              onPress={() => {
                onSelect(i);
                scrollRef.current?.scrollTo({ y: i * ITEM_H, animated: true });
              }}
              style={{ height: ITEM_H, alignItems: "center", justifyContent: "center" }}
            >
              <AppText
                style={{
                  fontSize: isSel ? 24 : 17,
                  fontWeight: isSel ? "800" : "400",
                  color: isSel ? colors.secondary : colors.subtle,
                }}
              >
                {item}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View
            style={{
              width: 260,
              backgroundColor: colors.surface,
              borderRadius: 24,
              padding: 24,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.18,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <AppText style={{ fontSize: 16, fontWeight: "700", color: colors.content, marginBottom: 16 }}>
              Selecionar horário
            </AppText>

            {/* Columns + highlight band */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              {/* Highlight overlay — positioned relative to column height */}
              <View
                pointerEvents="none"
                style={{
                  position: "absolute",
                  top: ITEM_H * 2,
                  left: 0,
                  right: 0,
                  height: ITEM_H,
                  backgroundColor: colors.secondary + "18",
                  borderRadius: 10,
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: colors.secondary + "40",
                }}
              />
              <PickerColumn items={HOURS_LIST} selectedIdx={selectedH} onSelect={setSelectedH} scrollRef={hourRef} />
              <AppText style={{ fontSize: 26, fontWeight: "800", color: colors.content }}>:</AppText>
              <PickerColumn items={MINS_LIST} selectedIdx={selectedMin} onSelect={setSelectedMin} scrollRef={minRef} />
            </View>

            {/* Preview */}
            <AppText style={{ fontSize: 22, fontWeight: "800", color: colors.content, marginTop: 14 }}>
              {HOURS_LIST[selectedH]}:{MINS_LIST[selectedMin]}
            </AppText>

            {/* Action buttons */}
            <View style={{ flexDirection: "row", gap: 10, marginTop: 16, width: "100%" }}>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 12,
                  backgroundColor: colors.muted,
                  alignItems: "center",
                }}
              >
                <AppText style={{ fontSize: 14, fontWeight: "600", color: colors.subtle }}>Cancelar</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onConfirm(`${HOURS_LIST[selectedH]}:${MINS_LIST[selectedMin]}`)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 12,
                  backgroundColor: colors.secondary,
                  alignItems: "center",
                }}
              >
                <AppText style={{ fontSize: 14, fontWeight: "700", color: "#fff" }}>OK</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── Main Screen ────────────────────────────────────────────────────────────

export function CreateAppointmentScreen() {
  const { colors } = useTheme();
  const { selectedPatientId, selectedPatientName } = useLocalSearchParams<{
    selectedPatientId?: string;
    selectedPatientName?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { show: showModal, modalProps } = useModal();

  // Data
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [showPatientModal, setShowPatientModal] = useState(false);

  // Form state
  const [selectedPatient, setSelectedPatient] = useState<PatientOption | null>(null);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [dateInput, setDateInput] = useState(""); // DD/MM/AAAA
  const [time, setTime] = useState(""); // HH:MM
  const [duration, setDuration] = useState<number>(50);
  const [format, setFormat] = useState<AppointmentFormat>("online");
  const [callLink, setCallLink] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState<AppointmentType>("follow_up");
  const [recurrence, setRecurrence] = useState<RecurrenceType>("none");
  const [reminderBefore, setReminderBefore] = useState<ReminderBefore>("30min");
  const [value, setValue] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [notifyPatient, setNotifyPatient] = useState(true);

  // Pickers
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Modal
  const [confirmModal, setConfirmModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    patientsService
      .getProfessionalPatients()
      .then((list) => {
        const active = list
          .filter((p) => p.status !== "pending")
          .map((p) => ({
            id: p.id,
            name: p.name,
            riskLevel: (p.riskLevel || "stable") as PatientOption["riskLevel"],
          }));
        setPatients(active);
        setPatientsLoading(false);

        if (selectedPatientId) {
          const found = active.find((p) => p.id === selectedPatientId);
          if (found) {
            setSelectedPatient(found);
          } else if (selectedPatientName) {
            setSelectedPatient({
              id: selectedPatientId,
              name: decodeURIComponent(selectedPatientName),
              riskLevel: "stable",
            });
          }
        }
      })
      .catch(() => setPatientsLoading(false));
  }, [selectedPatientId, selectedPatientName]);

  const handlePatientSelect = (p: PatientOption) => {
    setSelectedPatient(p);
  };

  const validate = (): string | null => {
    if (!selectedPatient) return "Selecione um paciente.";
    if (!dateInput.match(/^\d{2}\/\d{2}\/\d{4}$/)) return "Data inválida. Use o formato DD/MM/AAAA.";
    if (!time.match(/^\d{2}:\d{2}$/)) return "Horário inválido. Use o formato HH:MM.";
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      showModal({ type: "error", title: "Atenção", message: err });
      return;
    }
    setConfirmModal(true);
  };

  const handleConfirm = async () => {
    setSaving(true);
    try {
      const numericValue = parseMoneyValue(value);

      const payload: Omit<ProfessionalAppointment, "id"> = {
        patientId: selectedPatient!.id,
        patientName: selectedPatient!.name,
        patientAvatarUrl: null,
        patientRiskLevel: selectedPatient!.riskLevel,
        date: parseDateBR(dateInput),
        time,
        durationMinutes: duration,
        type,
        typeLabel: TYPE_LABELS[type],
        format,
        formatLabel: FORMAT_LABELS[format],
        status: "scheduled",
        statusLabel: "Agendada",
        subject,
        description,
        callLink: format !== "in_person" ? callLink || null : null,
        address: format !== "online" ? address || null : null,
        value: numericValue,
        reminderBefore,
        internalNotes,
        recurrence,
        notifyPatient,
      };

      await professionalCalendarService.createAppointment(payload);
      setConfirmModal(false);
      router.back();
    } catch {
      setSaving(false);
      setConfirmModal(false);
      showModal({ type: "error", title: "Erro", message: "Não foi possível salvar a consulta. Tente novamente." });
    }
  };

  if (patientsLoading) {
    return <LoadingState message="Carregando pacientes..." />;
  }

  const showCallLink = format === "online" || format === "hybrid";
  const showAddress = format === "in_person" || format === "hybrid";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TopBar
        title="Nova Consulta"
        onBackPress={() => router.back()}
        showNotifications={false}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Patient selector */}
        <SectionLabel label="Paciente" colors={colors} />
        <TouchableOpacity
          onPress={() => setShowPatientModal(true)}
          activeOpacity={0.75}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: selectedPatient ? colors.secondary + "70" : colors.border,
            paddingHorizontal: 14,
            minHeight: 52,
            gap: 10,
          }}
        >
          {selectedPatient ? (
            <>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: colors.secondary + "25",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppText style={{ fontSize: 11, fontWeight: "700", color: colors.secondary }}>
                  {selectedPatient.name.trim().split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                </AppText>
              </View>
              <AppText style={{ flex: 1, fontSize: 15, fontWeight: "600", color: colors.content }}>
                {selectedPatient.name}
              </AppText>
              <Ionicons name="checkmark-circle" size={20} color={colors.secondary} />
            </>
          ) : (
            <>
              <Ionicons name="person-outline" size={18} color={colors.subtle} />
              <AppText style={{ flex: 1, fontSize: 15, color: colors.subtle }}>
                Selecionar paciente...
              </AppText>
              <Ionicons name="chevron-down" size={18} color={colors.subtle} />
            </>
          )}
        </TouchableOpacity>

        {/* Subject */}
        <SectionLabel label="Assunto (opcional)" colors={colors} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: 14,
            minHeight: 52,
            gap: 10,
          }}
        >
          <Ionicons name="document-outline" size={18} color={colors.subtle} />
          <TextInput
            style={{ flex: 1, fontSize: 15, color: colors.content, paddingVertical: 12 }}
            placeholder="Ex: Acompanhamento — técnicas de regulação emocional"
            placeholderTextColor={colors.subtle}
            value={subject}
            onChangeText={setSubject}
          />
        </View>

        {/* Description */}
        <SectionLabel label="Descrição (opcional)" colors={colors} />
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 14,
            minHeight: 100,
          }}
        >
          <TextInput
            multiline
            placeholder="Objetivos e pontos a trabalhar nesta sessão..."
            placeholderTextColor={colors.subtle}
            value={description}
            onChangeText={setDescription}
            style={{
              fontSize: 15,
              color: colors.content,
              textAlignVertical: "top",
              lineHeight: 22,
            }}
          />
        </View>

        {/* Date */}
        <SectionLabel label="Data" colors={colors} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: dateInput.length > 0 ? colors.secondary + "60" : colors.border,
            paddingHorizontal: 14,
            minHeight: 52,
            gap: 10,
          }}
        >
          <Ionicons name="calendar-outline" size={18} color={colors.subtle} />
          <TextInput
            style={{ flex: 1, fontSize: 15, color: colors.content, paddingVertical: 12 }}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={colors.subtle}
            value={dateInput}
            onChangeText={(raw) => setDateInput(applyDateMask(raw))}
            keyboardType="numeric"
            maxLength={10}
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ padding: 6 }}>
            <Ionicons name="calendar" size={20} color={colors.secondary} />
          </TouchableOpacity>
        </View>

        {/* Time */}
        <SectionLabel label="Horário" colors={colors} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: time.length > 0 ? colors.secondary + "60" : colors.border,
            paddingHorizontal: 14,
            minHeight: 52,
            gap: 10,
          }}
        >
          <Ionicons name="time-outline" size={18} color={colors.subtle} />
          <TextInput
            style={{ flex: 1, fontSize: 15, color: colors.content, paddingVertical: 12 }}
            placeholder="HH:MM"
            placeholderTextColor={colors.subtle}
            value={time}
            onChangeText={(raw) => setTime(applyTimeMask(raw))}
            keyboardType="numeric"
            maxLength={5}
          />
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={{ padding: 6 }}>
            <Ionicons name="time" size={20} color={colors.secondary} />
          </TouchableOpacity>
        </View>

        {/* Duration */}
        <SectionLabel label="Duração" colors={colors} />
        <ChipGroup
          options={DURATION_OPTIONS}
          selected={duration}
          onSelect={setDuration}
          colors={colors}
        />

        {/* Format */}
        <SectionLabel label="Formato" colors={colors} />
        <ChipGroup
          options={FORMAT_OPTIONS}
          selected={format}
          onSelect={setFormat}
          colors={colors}
        />

        {/* Conditional: call link or address */}
        {showCallLink && (
          <>
            <SectionLabel label="Link da chamada" colors={colors} />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: 14,
                minHeight: 52,
                gap: 10,
              }}
            >
              <Ionicons name="videocam-outline" size={18} color={colors.subtle} />
              <TextInput
                style={{ flex: 1, fontSize: 15, color: colors.content, paddingVertical: 12 }}
                placeholder="https://meet.google.com/..."
                placeholderTextColor={colors.subtle}
                value={callLink}
                onChangeText={setCallLink}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>
          </>
        )}

        {showAddress && (
          <>
            <SectionLabel label="Endereço" colors={colors} />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: 14,
                minHeight: 52,
                gap: 10,
              }}
            >
              <Ionicons name="location-outline" size={18} color={colors.subtle} />
              <TextInput
                style={{ flex: 1, fontSize: 15, color: colors.content, paddingVertical: 12 }}
                placeholder="Rua, número, sala, cidade/UF"
                placeholderTextColor={colors.subtle}
                value={address}
                onChangeText={setAddress}
              />
            </View>
          </>
        )}

        {/* Type */}
        <SectionLabel label="Tipo de sessão" colors={colors} />
        <ChipGroup
          options={TYPE_OPTIONS}
          selected={type}
          onSelect={setType}
          colors={colors}
        />

        {/* Recurrence */}
        <SectionLabel label="Recorrência" colors={colors} />
        <ChipGroup
          options={RECURRENCE_OPTIONS}
          selected={recurrence}
          onSelect={setRecurrence}
          colors={colors}
        />

        {/* Reminder before */}
        <SectionLabel label="Lembrete antes" colors={colors} />
        <ChipGroup
          options={REMINDER_OPTIONS}
          selected={reminderBefore}
          onSelect={setReminderBefore}
          colors={colors}
        />

        {/* Value */}
        <SectionLabel label="Valor (opcional)" colors={colors} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: 14,
            minHeight: 52,
            gap: 10,
          }}
        >
          <Ionicons name="cash-outline" size={18} color={colors.subtle} />
          <TextInput
            style={{ flex: 1, fontSize: 15, color: colors.content, paddingVertical: 12 }}
            placeholder="R$ 0,00"
            placeholderTextColor={colors.subtle}
            value={value}
            onChangeText={(raw) => setValue(applyMoneyMask(raw))}
            keyboardType="numeric"
          />
        </View>

        {/* Internal notes */}
        <SectionLabel label="Notas internas (privadas)" colors={colors} />
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 14,
            minHeight: 90,
          }}
        >
          <TextInput
            multiline
            placeholder="Observações clínicas privadas — não visíveis ao paciente..."
            placeholderTextColor={colors.subtle}
            value={internalNotes}
            onChangeText={setInternalNotes}
            style={{
              fontSize: 15,
              color: colors.content,
              textAlignVertical: "top",
              lineHeight: 22,
            }}
          />
        </View>

        {/* Notify patient switch */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: colors.surface,
            borderRadius: 14,
            padding: 16,
            marginTop: 20,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View style={{ flex: 1, marginRight: 12 }}>
            <AppText style={{ fontSize: 15, fontWeight: "600", color: colors.content }}>
              Notificar paciente
            </AppText>
            <AppText style={{ fontSize: 12, color: colors.subtle, marginTop: 2 }}>
              Enviar confirmação da consulta ao paciente
            </AppText>
          </View>
          <Switch
            value={notifyPatient}
            onValueChange={setNotifyPatient}
            trackColor={{ false: colors.border, true: colors.secondary }}
            thumbColor="#fff"
          />
        </View>

        {/* Save button */}
        <View style={{ marginTop: 28 }}>
          <AppButton
            label="Salvar consulta"
            onPress={handleSave}
            variant="primary"
          />
        </View>
      </ScrollView>

      {/* Confirm modal */}
      <ConfirmActionModal
        visible={confirmModal}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmModal(false)}
        isLoading={saving}
        icon="calendar-outline"
        iconColor={colors.secondary}
        title="Confirmar agendamento"
        description={
          selectedPatient
            ? `Deseja agendar a consulta com ${selectedPatient.name} para ${dateInput} às ${time}?`
            : "Confirmar novo agendamento?"
        }
        confirmLabel="Agendar"
        cancelLabel="Revisar"
      />

      {/* Patient select */}
      <PatientSelectModal
        visible={showPatientModal}
        patients={patients}
        onSelect={handlePatientSelect}
        onClose={() => setShowPatientModal(false)}
        colors={colors}
      />

      {/* Date picker */}
      <DatePickerModal
        visible={showDatePicker}
        selectedDisplay={dateInput}
        onSelect={(d) => { setDateInput(d); setShowDatePicker(false); }}
        onClose={() => setShowDatePicker(false)}
        colors={colors}
      />

      {/* Time picker */}
      <TimePickerModal
        visible={showTimePicker}
        value={time || "09:00"}
        onConfirm={(t) => { setTime(t); setShowTimePicker(false); }}
        onClose={() => setShowTimePicker(false)}
        colors={colors}
      />

      <SuccessModal {...modalProps} />
    </KeyboardAvoidingView>
  );
}
