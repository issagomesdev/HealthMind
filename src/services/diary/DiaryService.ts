import { DiaryEntry, FeelingTag } from "../../core/types";

export interface CreateDiaryEntryPayload {
  content: string;
  feelings: FeelingTag[];
  imageUri?: string | null;
}

class DiaryServiceImpl {
  private entries: DiaryEntry[] = [];
  private nextId = 1;

  async getEntries(): Promise<DiaryEntry[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return [...this.entries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createEntry(payload: CreateDiaryEntryPayload): Promise<DiaryEntry> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const entry: DiaryEntry = {
      id: String(this.nextId++),
      content: payload.content,
      feelings: payload.feelings,
      imageUri: payload.imageUri ?? null,
      createdAt: new Date().toISOString(),
    };
    this.entries.unshift(entry);
    return entry;
  }

  async deleteEntry(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.entries = this.entries.filter((e) => e.id !== id);
  }

  async updateEntry(
    id: string,
    payload: Partial<CreateDiaryEntryPayload>
  ): Promise<DiaryEntry> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const idx = this.entries.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error("Entry not found");
    this.entries[idx] = { ...this.entries[idx], ...payload };
    return this.entries[idx];
  }
}

export const DiaryService = new DiaryServiceImpl();
