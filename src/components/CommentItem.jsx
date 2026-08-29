import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import Avatar from './Avatar';
import VoteControl from './VoteControl';
import {postedAt} from '../utils';
import {getUserVote} from '../states/shared/voteHelper';
import {voteComment} from '../states/threadDetail/threadDetailSlice';
import {showAlert} from '../states/shared/alertSlice';

/**
 * A single comment on a thread's detail page, with its own vote control.
 * @param {object} props - Component props.
 * @return {JSX.Element} Comment item element.
 */
export default function CommentItem({comment, threadId}) {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.authUser.value);
  const myVote = getUserVote(comment, authUser?.id);

  function guardedVote(clicked) {
    if (!authUser) {
      dispatch(showAlert('Masuk dulu untuk memberi suara pada komentar.'));
      return;
    }
    dispatch(voteComment(threadId, comment.id, clicked));
  }

  return (
    <li className="comment-item">
      <Avatar name={comment.owner?.name || 'Pengguna'} image={comment.owner?.avatar} size={38} />
      <div className="comment-body">
        <div className="comment-head">
          <span className="comment-author">{comment.owner?.name || 'Pengguna'}</span>
          <span className="comment-time">{postedAt(comment.createdAt)}</span>
        </div>
        <div
          className="comment-content"
          dangerouslySetInnerHTML={{__html: comment.content || ''}}
        />
        <VoteControl
          upCount={comment.upVotesBy.length}
          downCount={comment.downVotesBy.length}
          myVote={myVote}
          disabled={!authUser}
          onUpVote={() => guardedVote('up')}
          onDownVote={() => guardedVote('down')}
        />
      </div>
    </li>
  );
}

CommentItem.propTypes = {
  threadId: PropTypes.string.isRequired,
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    owner: PropTypes.shape({
      name: PropTypes.string,
      avatar: PropTypes.string,
    }),
    upVotesBy: PropTypes.array.isRequired,
    downVotesBy: PropTypes.array.isRequired,
  }).isRequired,
};
