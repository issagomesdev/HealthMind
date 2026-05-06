import { useState, useCallback } from "react";
import { CommunityTopic, CommunityPost } from "../../core/types";
import { CommunityService } from "../../services/community/CommunityService";

interface UseCommunityController {
  topics: CommunityTopic[];
  posts: CommunityPost[];
  loading: boolean;
  refreshing: boolean;
  loadData: () => Promise<void>;
  refresh: () => Promise<void>;
  likePost: (postId: string) => void;
  prependPost: (post: CommunityPost) => void;
}

export function useCommunityController(): UseCommunityController {
  const [topics, setTopics] = useState<CommunityTopic[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [t, p] = await Promise.all([
        CommunityService.getPopularTopics(),
        CommunityService.getFeedPosts(),
      ]);
      setTopics(t);
      setPosts(p);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const [t, p] = await Promise.all([
        CommunityService.getPopularTopics(),
        CommunityService.getFeedPosts(),
      ]);
      setTopics(t);
      setPosts(p);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const likePost = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) }
          : p
      )
    );
    CommunityService.likePost(postId);
  }, []);

  const prependPost = useCallback((post: CommunityPost) => {
    setPosts((prev) => [post, ...prev]);
  }, []);

  return { topics, posts, loading, refreshing, loadData, refresh, likePost, prependPost };
}
