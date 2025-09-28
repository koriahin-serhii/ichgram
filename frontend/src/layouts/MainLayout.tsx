import type { ReactNode } from 'react';
import useTheme from '@app/providers/useTheme';
import { Link } from 'react-router-dom';

export default function MainLayout({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #eee', flexWrap: 'wrap' }}>
        <Link to="/">Home</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/messages">Messages</Link>
        <Link to="/notifications">Notifications</Link>
        <Link to="/search">Search</Link>
        <Link to="/me">My Profile</Link>
        <Link to="/u/john">Other Profile</Link>
        <Link to="/settings/profile">Edit Profile</Link>
        <Link to="/post/new">Add Post</Link>
        <span style={{ marginLeft: 'auto' }} />
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? 'Dark' : 'Light'} mode
        </button>
      </nav>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}
