import diariesData from "../../data/fake/patientDiaries.json";
import { DiaryRecord } from "../../types/patient";

const delay = (ms = 350) => new Promise<void>((r) => setTimeout(r, ms));

let diaries: DiaryRecord[] = diariesData.diaries as DiaryRecord[];

export type DiaryPeriodFilter = "7d" | "30d" | "month" | "all";
export type DiaryMoodFilter = "all" | "Estável" | "Ansioso" | "Triste" | "Irritado" | "Cansado";

class PatientDiaryService {
  async getPatientDiaries(patientId: string): Promise<DiaryRecord[]> {
    await delay(300);
    return diaries
      .filter((d) => d.patientId === patientId)
      .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  }

  async getDiaryById(id: string): Promise<DiaryRecord | null> {
    await delay(200);
    return diaries.find((d) => d.id === id) ?? null;
  }

  async filterDiaries(
    patientId: string,
    period: DiaryPeriodFilter,
    mood: DiaryMoodFilter,
    keyword: string
  ): Promise<DiaryRecord[]> {
    await delay(250);
    const now = new Date();
    let result = diaries.filter((d) => d.patientId === patientId);

    if (period !== "all") {
      const cutoff = new Date(now);
      if (period === "7d") cutoff.setDate(now.getDate() - 7);
      else if (period === "30d") cutoff.setDate(now.getDate() - 30);
      else if (period === "month") cutoff.setDate(1);
      result = result.filter((d) => new Date(d.recordedAt) >= cutoff);
    }

    if (mood !== "all") {
      result = result.filter((d) => d.moodLabel === mood);
    }

    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      result = result.filter(
        (d) =>
          d.summary.toLowerCase().includes(q) ||
          d.fullText.toLowerCase().includes(q) ||
          d.emotionTags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  }

  async addProfessionalObservation(diaryId: string, observation: string): Promise<DiaryRecord> {
    await delay(400);
    const idx = diaries.findIndex((d) => d.id === diaryId);
    if (idx === -1) throw new Error("Registro não encontrado");
    diaries = diaries.map((d, i) =>
      i === idx ? { ...d, professionalObservation: observation } : d
    );
    return diaries[idx];
  }
}

export const patientDiaryService = new PatientDiaryService();
