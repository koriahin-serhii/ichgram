import { useState, type ReactNode } from 'react';
import { PostDetailContext } from './postDetailContext';

export function PostDetailProvider({ children }: { children: ReactNode }) {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const openPostDetail = (postId: string) => {
    setSelectedPostId(postId);
  };

  const closePostDetail = () => {
    setSelectedPostId(null);
  };

  const value = {
    selectedPostId,
    openPostDetail,
    closePostDetail,
  };

  return (
    <PostDetailContext.Provider value={value}>
      {children}
    </PostDetailContext.Provider>
  );
}
