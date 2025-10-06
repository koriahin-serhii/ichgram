import { createContext } from 'react';

interface PostDetailContextType {
  selectedPostId: string | null;
  openPostDetail: (postId: string) => void;
  closePostDetail: () => void;
}

export const PostDetailContext = createContext<PostDetailContextType>({
  selectedPostId: null,
  openPostDetail: () => {},
  closePostDetail: () => {},
});
