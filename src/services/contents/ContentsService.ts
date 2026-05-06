import { ContentItem, ContentCategory } from "../../core/types";
import fakeContents from "../../data/fake/contents.json";

// Future: GET /contents, GET /contents/recommended, GET /contents?search=, GET /contents?category=

class ContentsServiceImpl {
  async getContents(): Promise<ContentItem[]> {
    await new Promise((r) => setTimeout(r, 350));
    return fakeContents as ContentItem[];
  }

  async getRecommendedContents(): Promise<ContentItem[]> {
    await new Promise((r) => setTimeout(r, 200));
    return (fakeContents as ContentItem[]).filter((c) => c.recommended);
  }

  async searchContents(query: string): Promise<ContentItem[]> {
    await new Promise((r) => setTimeout(r, 200));
    const q = query.toLowerCase();
    return (fakeContents as ContentItem[]).filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }

  async filterContents(category: ContentCategory): Promise<ContentItem[]> {
    await new Promise((r) => setTimeout(r, 200));
    if (category === "todos") return fakeContents as ContentItem[];
    return (fakeContents as ContentItem[]).filter((c) => c.category === category);
  }
}

export const ContentsService = new ContentsServiceImpl();
