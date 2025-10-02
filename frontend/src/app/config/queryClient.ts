import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 1,
      staleTime: 1000 * 30, // 30s - данные считаются свежими
      gcTime: 1000 * 60 * 5, // 5 минут - время хранения неиспользуемого кеша (ранее cacheTime)
      refetchOnMount: true, // Обновлять при монтировании компонента
    },
    mutations: {
      retry: 0, // Не повторять мутации автоматически
      onError: (error) => {
        // Централизованная обработка ошибок мутаций
        console.error('Mutation error:', error);
      },
    },
  },
});

export default queryClient;
