import { useState, useCallback } from "react";
import { DiaryEntry } from "../../core/types";
import { DiaryService } from "../../services/diary/DiaryService";

interface UseDiaryListController {
  entries: DiaryEntry[];
  loading: boolean;
  refreshing: boolean;
  loadEntries: () => Promise<void>;
  refresh: () => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
}

export function useDiaryListController(): UseDiaryListController {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await DiaryService.getEntries();
      setEntries(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await DiaryService.getEntries();
      setEntries(data);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    await DiaryService.deleteEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { entries, loading, refreshing, loadEntries, refresh, deleteEntry };
}
