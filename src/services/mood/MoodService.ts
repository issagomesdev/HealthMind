import { MoodEntry } from "../../core/types";

// Future: replace with ApiService calls
//   POST /mood/checkin
//   GET  /mood/history

class MoodServiceImpl {
  private history: MoodEntry[] = [];

  async saveEntry(entry: MoodEntry): Promise<void> {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 600));
    this.history.push(entry);
  }

  async getHistory(): Promise<MoodEntry[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...this.history];
  }
}

export const MoodService = new MoodServiceImpl();
