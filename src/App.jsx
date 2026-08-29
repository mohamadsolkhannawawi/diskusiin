import {useEffect} from 'react';
import {Routes, Route} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import Navbar from './components/Navbar';
import AlertStack from './components/AlertStack';
import LoadingSplash from './components/LoadingSplash';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import CreateThreadPage from './pages/CreateThreadPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LeaderboardPage from './pages/LeaderboardPage';
import NotFoundPage from './pages/NotFoundPage';
import {asyncPreloadAuthUser} from './states/authUser/authUserSlice';

/**
 * Root application component: restores the session on first load, then
 * renders the navbar, global alerts, and the router's active page.
 * @return {JSX.Element} App element.
 */
export default function App() {
  const dispatch = useDispatch();
  const isPreload = useSelector((state) => state.isPreload);

  useEffect(() => {
    dispatch(asyncPreloadAuthUser());
  }, [dispatch]);

  if (isPreload) {
    return <LoadingSplash />;
  }

  return (
    <>
      <Navbar />
      <AlertStack />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/threads/:threadId" element={<ThreadDetailPage />} />
        <Route path="/leaderboards" element={<LeaderboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/new"
          element={
            <ProtectedRoute>
              <CreateThreadPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
