import {NavLink, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {unsetAuthUser} from '../states/authUser/authUserSlice';
import Avatar from './Avatar';

/**
 * Sticky, pill-shaped top navigation bar. Adapts its call-to-action based
 * on whether a user is currently authenticated.
 * @return {JSX.Element} Navbar element.
 */
export default function Navbar() {
  const authUser = useSelector((state) => state.authUser.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(unsetAuthUser());
    navigate('/');
  }

  return (
    <header className="navbar-wrap">
      <nav className="navbar">
        <NavLink to="/" className="navbar-brand">
          <img src="/favicon.svg" alt="" className="navbar-brand-mark" />
          Diskusiin
        </NavLink>

        <div className="navbar-links">
          <NavLink to="/" end className={({isActive}) => isActive ? 'is-active' : ''}>
            Thread
          </NavLink>
          <NavLink to="/leaderboards" className={({isActive}) => isActive ? 'is-active' : ''}>
            Leaderboard
          </NavLink>
        </div>

        <div className="navbar-cta">
          {authUser ? (
            <>
              <NavLink to="/new" className="btn btn-primary btn-sm">
                + Thread Baru
              </NavLink>
              <div className="navbar-user">
                <Avatar name={authUser.name} image={authUser.avatar} size={36} tail={false} />
                <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
                  Keluar
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-ghost btn-sm">
                Masuk
              </NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm">
                Daftar
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
