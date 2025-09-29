import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 1,
      staleTime: 1000 * 30, // 30s
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;
