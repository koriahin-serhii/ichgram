import { Link } from 'react-router-dom';
import Logo from '@assets/logos/logo.svg?react';
import useAuth from '@app/providers/useAuth';
import styles from './Header.module.css';

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <nav className={styles.nav}>
      <Logo style={{ width: 96, height: 24 }} />
      <Link to="/">Home</Link>
      <Link to="/explore">Explore</Link>
      <Link to="/messages">Messages</Link>
      <Link to="/notifications">Notifications</Link>
      <Link to="/search">Search</Link>
      <Link to="/me">My Profile</Link>
      <Link to="/u/john">Other Profile</Link>
      <Link to="/settings/profile">Edit Profile</Link>
      <Link to="/post/new">Add Post</Link>
      <span className={styles.spacer} />
      {user ? (
        <>
          <span>Hi, {user.name || user.email || user.id}</span>
          <button onClick={() => logout()}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign up</Link>
        </>
      )}
    </nav>
  );
}
