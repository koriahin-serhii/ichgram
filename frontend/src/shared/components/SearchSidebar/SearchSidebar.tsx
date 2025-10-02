import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchUsers } from '@shared/api/search';
import useAuth from '@app/providers/useAuth';
import UserSearchResult from '../UsesrSearchResult/UserSearchResult';
import styles from './SearchSidebar.module.css';

interface SearchSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchSidebar({ isOpen, onClose }: SearchSidebarProps) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const { data: searchResults = [], isLoading } = useSearchUsers(query);

  // Filter out current user from search results
  const filteredResults = useMemo(() => {
    if (!user) return searchResults;
    return searchResults.filter((searchUser) => searchUser._id !== user.id);
  }, [searchResults, user]);

  // Focus input when sidebar opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const addToRecentSearches = (searchQuery: string) => {
    const updated = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleUserClick = () => {
    if (query.trim()) {
      addToRecentSearches(query.trim());
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <h2 className={styles.title}>Search</h2>
        </div>

        <div className={styles.searchBox}>
          <div className={styles.searchInput}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={styles.searchIcon}
            >
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search"
              value={query}
              onChange={handleSearch}
              className={styles.input}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className={styles.clearButton}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className={styles.content}>
          {query.trim() ? (
            <div className={styles.results}>
              {isLoading ? (
                <div className={styles.loading}>Searching...</div>
              ) : filteredResults.length > 0 ? (
                filteredResults.map((user) => (
                  <UserSearchResult
                    key={user._id}
                    user={user}
                    onClick={handleUserClick}
                  />
                ))
              ) : (
                <div className={styles.noResults}>No users found</div>
              )}
            </div>
          ) : (
            <div className={styles.recent}>
              <div className={styles.recentHeader}>
                <h3 className={styles.recentTitle}>Recent</h3>
                {recentSearches.length > 0 && (
                  <button
                    onClick={clearRecentSearches}
                    className={styles.clearAllButton}
                  >
                    Clear all
                  </button>
                )}
              </div>

              {recentSearches.length > 0 ? (
                <div className={styles.recentList}>
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className={styles.recentItem}
                      onClick={() => setQuery(search)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={styles.recentIcon}
                      >
                        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
                      </svg>
                      <span>{search}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noRecent}>No recent searches</div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
