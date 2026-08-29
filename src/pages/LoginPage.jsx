import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {Eye, EyeOff} from 'lucide-react';
import {asyncLoginUser} from '../states/authUser/authUserSlice';
import {showAlert} from '../states/shared/alertSlice';

/**
 * Login page with a controlled email/password form.
 * @return {JSX.Element} Login page element.
 */
export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      await dispatch(asyncLoginUser({email, password})).unwrap();
      dispatch(showAlert('Berhasil masuk. Selamat berdiskusi!', 'success'));
      navigate('/');
    } catch (error) {
      dispatch(showAlert(error.message || 'Email atau kata sandi salah.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell grid-texture">
      <div className="blob" style={{width: 240, height: 240, bottom: -60, left: -60, background: '#2f6fed'}} />
      <div className="auth-card">
        <div className="auth-card-mark">
          <img src="/favicon.svg" alt="" />
        </div>
        <h1>Selamat datang kembali</h1>
        <p className="auth-card-subtitle">Masuk untuk melanjutkan diskusi.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              required
              placeholder="nama@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="login-password">Kata sandi</label>
            <div className="password-field">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="auth-card-footer">
          Belum punya akun? <Link to="/register">Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
}
