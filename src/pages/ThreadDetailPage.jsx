import {useEffect} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import Avatar from '../components/Avatar';
import VoteControl from '../components/VoteControl';
import CommentItem from '../components/CommentItem';
import CommentForm from '../components/CommentForm';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import {postedAt} from '../utils';
import {getUserVote} from '../states/shared/voteHelper';
import {
  asyncFetchThreadDetail,
  asyncCreateComment,
  clearThreadDetail,
  voteThreadDetail,
} from '../states/threadDetail/threadDetailSlice';
import {showAlert} from '../states/shared/alertSlice';

/**
 * Shows a single thread in full, along with its comment thread and a
 * form to add new comments.
 * @return {JSX.Element} Thread detail page element.
 */
export default function ThreadDetailPage() {
  const {threadId} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {value: thread, status, error} = useSelector((state) => state.threadDetail);
  const authUser = useSelector((state) => state.authUser.value);

  useEffect(() => {
    dispatch(asyncFetchThreadDetail(threadId));
    return () => dispatch(clearThreadDetail());
  }, [dispatch, threadId]);

  function handleVote(clicked) {
    if (!authUser) {
      dispatch(showAlert('Masuk dulu untuk memberi suara pada thread.'));
      return;
    }
    dispatch(voteThreadDetail(threadId, clicked));
  }

  function handleSubmitComment(content) {
    if (!authUser) {
      dispatch(showAlert('Masuk dulu untuk berkomentar.'));
      navigate('/login');
      return;
    }
    dispatch(asyncCreateComment({threadId, content}));
  }

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="page">
        <Loading label="Memuat thread..." />
      </div>
    );
  }

  if (status === 'failed' || !thread) {
    return (
      <div className="page">
        <EmptyState title="Thread tidak ditemukan" description={error || 'Coba kembali ke beranda.'} />
      </div>
    );
  }

  const myVote = getUserVote(thread, authUser?.id);

  return (
    <div className="page">
      <Link to="/" className="back-link">← Kembali ke daftar thread</Link>

      <article className="thread-detail-card">
        <div className="thread-card-head">
          <Avatar name={thread.owner.name} image={thread.owner.avatar} size={46} />
          <div className="thread-card-meta">
            <span className="thread-card-author">{thread.owner.name}</span>
            <span className="thread-card-time">{postedAt(thread.createdAt)}</span>
          </div>
          {thread.category && <span className="chip">{thread.category}</span>}
        </div>

        <h1 className="thread-detail-title">{thread.title}</h1>
        <div
          className="thread-detail-body"
          dangerouslySetInnerHTML={{__html: thread.body || ''}}
        />

        <VoteControl
          upCount={thread.upVotesBy.length}
          downCount={thread.downVotesBy.length}
          myVote={myVote}
          disabled={!authUser}
          onUpVote={() => handleVote('up')}
          onDownVote={() => handleVote('down')}
        />
      </article>

      <section className="comment-section">
        <h2 className="comment-section-title">
          {thread.comments.length} Komentar
        </h2>

        {thread.comments.length === 0 ? (
          <EmptyState title="Belum ada komentar" description="Jadilah yang pertama menanggapi thread ini." />
        ) : (
          <ul className="comment-list">
            {thread.comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} threadId={threadId} />
            ))}
          </ul>
        )}

        {authUser ? (
          <CommentForm onSubmit={handleSubmitComment} submitting={false} />
        ) : (
          <p className="comment-guest-hint">
            <Link to="/login">Masuk</Link> untuk ikut berkomentar di thread ini.
          </p>
        )}
      </section>
    </div>
  );
}
