import { CommunityTopic, CommunityPost, CommunityCategory } from "../../core/types";
import fakeData from "../../data/fake/community.json";

export interface CreatePostPayload {
  topic: string;
  categories: CommunityCategory[];
  content: string;
  image?: string | null;
}

// Future: GET /community/topics, GET /community/feed, POST /community/posts,
//         POST /community/posts/:id/like, POST /community/posts/:id/comment

class CommunityServiceImpl {
  private posts: CommunityPost[] = (fakeData.posts as CommunityPost[]).map((p) => ({ ...p }));

  async getPopularTopics(): Promise<CommunityTopic[]> {
    await new Promise((r) => setTimeout(r, 250));
    return fakeData.topics as CommunityTopic[];
  }

  async getFeedPosts(): Promise<CommunityPost[]> {
    await new Promise((r) => setTimeout(r, 400));
    return [...this.posts];
  }

  async createPost(payload: CreatePostPayload, userName: string): Promise<CommunityPost> {
    await new Promise((r) => setTimeout(r, 600));
    const post: CommunityPost = {
      id: `new_${Date.now()}`,
      user: { id: "me", name: userName },
      topic: payload.topic,
      categories: payload.categories,
      content: payload.content,
      image: payload.image ?? undefined,
      likes: 0,
      comments: 0,
      liked: false,
      createdAt: new Date().toISOString(),
    };
    this.posts.unshift(post);
    return post;
  }

  async likePost(postId: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 150));
    const post = this.posts.find((p) => p.id === postId);
    if (post) {
      post.liked = !post.liked;
      post.likes += post.liked ? 1 : -1;
    }
  }
}

export const CommunityService = new CommunityServiceImpl();
