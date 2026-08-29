import {Link} from 'react-router-dom';

/**
 * Fallback page for unknown routes.
 * @return {JSX.Element} Not found page element.
 */
export default function NotFoundPage() {
  return (
    <div className="page">
      <div className="empty-state" style={{paddingTop: 80}}>
        <div className="empty-state-mark"><span /></div>
        <h3>Halaman tidak ditemukan</h3>
        <p>Sepertinya kamu tersesat. Yuk kembali ke daftar thread.</p>
        <Link to="/" className="btn btn-primary" style={{marginTop: 12}}>
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
