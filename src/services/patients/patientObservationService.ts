import observationsData from "../../data/fake/patientObservations.json";
import {
  PatientObservation,
  ObservationCategory,
  ObservationPriority,
} from "../../types/patient";

const delay = (ms = 350) => new Promise<void>((r) => setTimeout(r, ms));

let observations: PatientObservation[] = observationsData.observations as PatientObservation[];

class PatientObservationService {
  async getPatientObservations(patientId: string): Promise<PatientObservation[]> {
    await delay(300);
    return observations
      .filter((o) => o.patientId === patientId)
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async getObservationById(id: string): Promise<PatientObservation | null> {
    await delay(200);
    return observations.find((o) => o.id === id) ?? null;
  }

  async filterObservations(
    patientId: string,
    category: ObservationCategory | "Todas",
    priority: ObservationPriority | "Todas",
    keyword: string
  ): Promise<PatientObservation[]> {
    await delay(250);
    let result = observations.filter((o) => o.patientId === patientId);

    if (category !== "Todas") result = result.filter((o) => o.category === category);
    if (priority !== "Todas") result = result.filter((o) => o.priority === priority);

    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      result = result.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.fullText.toLowerCase().includes(q) ||
          o.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async createObservation(
    patientId: string,
    patientName: string,
    data: {
      title: string;
      category: ObservationCategory;
      priority: ObservationPriority;
      fullText: string;
      tags: string[];
      isPrivate: boolean;
      isImportant: boolean;
    }
  ): Promise<PatientObservation> {
    await delay(500);
    const newObs: PatientObservation = {
      id: `obs${Date.now()}`,
      patientId,
      patientName,
      title: data.title,
      createdAt: new Date().toISOString(),
      category: data.category,
      priority: data.priority,
      summary: data.fullText.slice(0, 120) + (data.fullText.length > 120 ? "..." : ""),
      fullText: data.fullText,
      tags: data.tags,
      isPrivate: data.isPrivate,
      isPinned: false,
      isImportant: data.isImportant,
      authorName: "Dra. Paula Rocha",
    };
    observations = [newObs, ...observations];
    return newObs;
  }

  async updateObservation(
    id: string,
    data: Partial<Pick<PatientObservation, "title" | "category" | "priority" | "fullText" | "tags" | "isPrivate" | "isImportant" | "isPinned">>
  ): Promise<PatientObservation> {
    await delay(400);
    observations = observations.map((o) =>
      o.id === id
        ? {
            ...o,
            ...data,
            summary: data.fullText
              ? data.fullText.slice(0, 120) + (data.fullText.length > 120 ? "..." : "")
              : o.summary,
          }
        : o
    );
    return observations.find((o) => o.id === id)!;
  }

  async deleteObservation(id: string): Promise<void> {
    await delay(300);
    observations = observations.filter((o) => o.id !== id);
  }

  async togglePin(id: string): Promise<void> {
    await delay(200);
    observations = observations.map((o) =>
      o.id === id ? { ...o, isPinned: !o.isPinned } : o
    );
  }
}

export const patientObservationService = new PatientObservationService();
