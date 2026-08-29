import {useState} from 'react';
import PropTypes from 'prop-types';

/**
 * Controlled form for composing a new thread (title, body, category).
 * @param {object} props - Component props.
 * @return {JSX.Element} Thread form element.
 */
export default function ThreadForm({onSubmit, submitting}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim() || !body.trim()) {
      setError('Judul dan isi thread wajib diisi.');
      return;
    }

    setError('');
    onSubmit({title: title.trim(), body: body.trim(), category: category.trim()});
  }

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="thread-title">Judul thread</label>
        <input
          id="thread-title"
          type="text"
          placeholder="Apa yang ingin kamu diskusikan?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="thread-category">Kategori (opsional)</label>
        <input
          id="thread-category"
          type="text"
          placeholder="Misal: Redux, React, Umum"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="thread-body">Isi thread</label>
        <textarea
          id="thread-body"
          rows={7}
          placeholder="Jelaskan topik yang ingin kamu diskusikan secara lengkap..."
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />
      </div>

      {error && <p className="field-error">{error}</p>}

      <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
        {submitting ? 'Mempublikasikan...' : 'Publikasikan Thread'}
      </button>
    </form>
  );
}

ThreadForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
};
