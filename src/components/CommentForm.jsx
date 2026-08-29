import {useState} from 'react';
import PropTypes from 'prop-types';

/**
 * Controlled textarea + submit button for posting a new comment.
 * Its input state is local, per the project's rule that controlled
 * form components may manage their own state.
 * @param {object} props - Component props.
 * @return {JSX.Element} Comment form element.
 */
export default function CommentForm({onSubmit, submitting}) {
  const [content, setContent] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim());
    setContent('');
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="comment-content">Tambahkan komentar</label>
        <textarea
          id="comment-content"
          rows={3}
          placeholder="Tulis pendapatmu di sini..."
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={submitting || !content.trim()}>
        {submitting ? 'Mengirim...' : 'Kirim komentar'}
      </button>
    </form>
  );
}

CommentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
};
