import { Routes, Route } from 'react-router-dom';
import Home from '@pages/Home/Home';
import Explore from '@pages/Explore/Explore';
import Messages from '@pages/Messages/Messages';
import Notifications from '@pages/Notifications/Notifications';
import MyProfile from '@pages/Profile/MyProfile/MyProfile';
import UserProfile from '@pages/Profile/UserProfile/UserProfile';
import EditProfile from '@pages/Profile/EditProfile/EditProfile';
import PostDetail from '@pages/Post/PostDetail/PostDetail';
import AddPost from '@pages/Post/AddPost/AddPost';
import EditPost from '@pages/Post/EditPost/EditPost';
import Login from '@pages/Auth/Login/Login';
import SignUp from '@pages/Auth/SignUp/SignUp';
import Reset from '@pages/Auth/Reset/Reset';
import NotFound from '@pages/NotFound/NotFound';
import { RequireAuth, RedirectIfAuthed } from './RouteGuards';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public/Auth (blocked for authed users) */}
      <Route element={<RedirectIfAuthed />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset" element={<Reset />} />
      </Route>

      {/* Protected */}
      <Route element={<RequireAuth />}>
        {/* Main */}
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* Profile */}
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/u/:username" element={<UserProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />

        {/* Posts */}
        <Route path="/post/new" element={<AddPost />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/post/:id/edit" element={<EditPost />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
