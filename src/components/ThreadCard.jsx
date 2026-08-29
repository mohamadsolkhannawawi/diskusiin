import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import Avatar from './Avatar';
import VoteControl from './VoteControl';
import {postedAt} from '../utils';
import {getUserVote} from '../states/shared/voteHelper';
import {voteThread} from '../states/threads/threadsSlice';
import {showAlert} from '../states/shared/alertSlice';

/**
 * A single thread preview card shown on the thread list page.
 * @param {object} props - Component props.
 * @return {JSX.Element} Thread card element.
 */
export default function ThreadCard({thread}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.authUser.value);
  const myVote = getUserVote(thread, authUser?.id);

  function guardedVote(clicked) {
    if (!authUser) {
      dispatch(showAlert('Masuk dulu untuk memberi suara pada thread.'));
      return;
    }
    dispatch(voteThread(thread.id, clicked));
  }

  return (
    <article className="thread-card">
      <button
        type="button"
        className="thread-card-main"
        onClick={() => navigate(`/threads/${thread.id}`)}
      >
        <div className="thread-card-head">
          <Avatar name={thread.ownerName || 'Pengguna'} image={thread.ownerAvatar} size={40} />
          <div className="thread-card-meta">
            <span className="thread-card-author">{thread.ownerName || 'Pengguna'}</span>
            <span className="thread-card-time">{postedAt(thread.createdAt)}</span>
          </div>
          {thread.category && <span className="chip">{thread.category}</span>}
        </div>

        <h3 className="thread-card-title">{thread.title}</h3>
        <div
          className="thread-card-body"
          dangerouslySetInnerHTML={{__html: thread.body || ''}}
        />
      </button>

      <div className="thread-card-footer">
        <VoteControl
          upCount={thread.upVotesBy.length}
          downCount={thread.downVotesBy.length}
          myVote={myVote}
          disabled={!authUser}
          onUpVote={() => guardedVote('up')}
          onDownVote={() => guardedVote('down')}
        />
        <span className="thread-card-comments">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 5h16v11H8l-4 4V5z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
          {thread.totalComments} komentar
        </span>
      </div>
    </article>
  );
}

ThreadCard.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    category: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    ownerName: PropTypes.string,
    ownerAvatar: PropTypes.string,
    upVotesBy: PropTypes.array.isRequired,
    downVotesBy: PropTypes.array.isRequired,
    totalComments: PropTypes.number.isRequired,
  }).isRequired,
};
