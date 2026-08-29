import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {Eye, EyeOff} from 'lucide-react';
import {asyncRegisterUser} from '../states/authUser/authUserSlice';
import {showAlert} from '../states/shared/alertSlice';

/**
 * Registration page with a controlled name/email/password form.
 * @return {JSX.Element} Register page element.
 */
export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');

    if (password.length < 6) {
      setFormError('Kata sandi minimal 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(asyncRegisterUser({name, email, password})).unwrap();
      dispatch(showAlert('Akun berhasil dibuat. Silakan masuk.', 'success'));
      navigate('/login');
    } catch (error) {
      dispatch(showAlert(error.message || 'Gagal membuat akun.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell grid-texture">
      <div className="blob" style={{width: 240, height: 240, top: -60, right: -60, background: '#f4b740'}} />
      <div className="auth-card">
        <div className="auth-card-mark">
          <img src="/favicon.svg" alt="" />
        </div>
        <h1>Buat akun baru</h1>
        <p className="auth-card-subtitle">Gabung dan mulai diskusi dengan komunitas.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="register-name">Nama</label>
            <input
              id="register-name"
              type="text"
              required
              placeholder="Nama lengkap"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              required
              placeholder="nama@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="register-password">Kata sandi</label>
            <div className="password-field">
              <input
                id="register-password"
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

          <div className="field">
            <label htmlFor="register-confirm">Konfirmasi kata sandi</label>
            <div className="password-field">
              <input
                id="register-confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="Ulangi kata sandi"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi kata sandi' : 'Tampilkan konfirmasi kata sandi'}
                onClick={() => setShowConfirmPassword((value) => !value)}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {formError && <p className="field-error">{formError}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="auth-card-footer">
          Sudah punya akun? <Link to="/login">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}
