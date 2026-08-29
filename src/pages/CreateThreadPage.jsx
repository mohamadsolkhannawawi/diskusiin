import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import ThreadForm from '../components/ThreadForm';
import {asyncCreateThread} from '../states/threads/threadsSlice';
import {showAlert} from '../states/shared/alertSlice';

/**
 * Page for composing and publishing a new thread. Only reachable by
 * authenticated users via ProtectedRoute.
 * @return {JSX.Element} Create thread page element.
 */
export default function CreateThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit({title, body, category}) {
    setSubmitting(true);
    try {
      const result = await dispatch(asyncCreateThread({title, body, category})).unwrap();
      dispatch(showAlert('Thread berhasil dipublikasikan!', 'success'));
      navigate(`/threads/${result.id}`);
    } catch (error) {
      dispatch(showAlert(error.message || 'Gagal membuat thread.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Buka diskusi baru</h1>
        <p className="page-subtitle">Tuliskan topikmu sejelas mungkin agar mudah ditanggapi.</p>
      </div>

      <div className="compose-card">
        <ThreadForm onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  );
}
