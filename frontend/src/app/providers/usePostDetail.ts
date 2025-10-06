import { useContext } from 'react';
import { PostDetailContext } from './postDetailContext';

export function usePostDetail() {
  return useContext(PostDetailContext);
}
