import PropTypes from 'prop-types';

/**
 * Up/down vote buttons with counts. Highlights the button matching the
 * current user's vote and disables interaction for guests.
 * @param {object} props - Component props.
 * @return {JSX.Element} Vote control element.
 */
export default function VoteControl({upCount, downCount, myVote, onUpVote, onDownVote, disabled}) {
  return (
    <div className="vote-control" role="group" aria-label="Vote">
      <button
        type="button"
        className={`vote-btn vote-btn--up ${myVote === 1 ? 'is-active' : ''}`}
        onClick={onUpVote}
        disabled={disabled}
        title={disabled ? 'Masuk untuk memberi suara' : 'Upvote'}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M12 4l8 9h-5v7H9v-7H4l8-9z" fill="currentColor" />
        </svg>
        <span>{upCount}</span>
      </button>
      <button
        type="button"
        className={`vote-btn vote-btn--down ${myVote === -1 ? 'is-active' : ''}`}
        onClick={onDownVote}
        disabled={disabled}
        title={disabled ? 'Masuk untuk memberi suara' : 'Downvote'}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M12 20l-8-9h5V4h6v7h5l-8 9z" fill="currentColor" />
        </svg>
        <span>{downCount}</span>
      </button>
    </div>
  );
}

VoteControl.propTypes = {
  upCount: PropTypes.number.isRequired,
  downCount: PropTypes.number.isRequired,
  myVote: PropTypes.number,
  onUpVote: PropTypes.func.isRequired,
  onDownVote: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
