import styles from './Home.module.css';
import { useFeed } from '@shared/api/posts';
import PostList from '@components/PostList/PostList';
import type { Paginated } from '@shared/api/types';

function isPaginated<T>(v: unknown): v is Paginated<T> {
  return !!v && typeof v === 'object' && 'items' in (v as Record<string, unknown>);
}

export default function Home() {
  const { data, isLoading, error } = useFeed();
  const list = isPaginated<Record<string, unknown>>(data)
    ? data.items
    : Array.isArray(data)
    ? data
    : [];

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Home</h1>
      {isLoading && <div className={styles.card}>Loading feed…</div>}
      {error && (
        <div className={styles.card} role="alert">
          {String(error.message || 'Failed to load')}
        </div>
      )}
      {!isLoading && !error && (
        <div className={styles.card}>
          <PostList items={list} />
        </div>
      )}
    </div>
  );
}
