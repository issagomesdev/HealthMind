import { useState, useCallback } from "react";
import { ContentItem, ContentCategory } from "../../core/types";
import { ContentsService } from "../../services/contents/ContentsService";

interface UseContentsController {
  contents: ContentItem[];
  recommended: ContentItem[];
  loading: boolean;
  searchQuery: string;
  activeCategory: ContentCategory;
  setSearchQuery: (q: string) => void;
  setActiveCategory: (c: ContentCategory) => void;
  loadContents: () => Promise<void>;
}

export function useContentsController(): UseContentsController {
  const [allContents, setAllContents] = useState<ContentItem[]>([]);
  const [recommended, setRecommended] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQueryState] = useState("");
  const [activeCategory, setActiveCategoryState] = useState<ContentCategory>("todos");

  const loadContents = useCallback(async () => {
    setLoading(true);
    try {
      const [all, rec] = await Promise.all([
        ContentsService.getContents(),
        ContentsService.getRecommendedContents(),
      ]);
      setAllContents(all);
      setRecommended(rec);
    } finally {
      setLoading(false);
    }
  }, []);

  const setSearchQuery = useCallback(async (q: string) => {
    setSearchQueryState(q);
    if (q.trim()) {
      const results = await ContentsService.searchContents(q);
      setAllContents(results);
    } else {
      const all = await ContentsService.getContents();
      setAllContents(all);
    }
  }, []);

  const setActiveCategory = useCallback(async (c: ContentCategory) => {
    setActiveCategoryState(c);
    const results = await ContentsService.filterContents(c);
    setAllContents(results);
  }, []);

  const nonRecommended = allContents.filter((c) => !c.recommended);

  return {
    contents: nonRecommended,
    recommended,
    loading,
    searchQuery,
    activeCategory,
    setSearchQuery,
    setActiveCategory,
    loadContents,
  };
}
