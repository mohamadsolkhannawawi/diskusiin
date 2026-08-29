/**
 * Given the current user's existing vote state (1, -1, or 0/undefined)
 * and the button that was clicked ('up' | 'down'), figure out which
 * vote type should be sent next. Clicking the same vote again neutralizes it.
 * @param {number} currentVote - 1 (up), -1 (down), or 0 (neutral).
 * @param {'up'|'down'} clicked - Which vote button was pressed.
 * @return {1|-1|0} The vote type to apply.
 */
export function nextVoteType(currentVote, clicked) {
  const clickedValue = clicked === 'up' ? 1 : -1;
  return currentVote === clickedValue ? 0 : clickedValue;
}

/**
 * Compute a user's current vote (1, -1, or 0) for a votable entity
 * given its upVotesBy/downVotesBy arrays.
 * @param {{upVotesBy: string[], downVotesBy: string[]}} entity - Thread or comment.
 * @param {string} userId - The current user's id.
 * @return {1|-1|0} The user's current vote.
 */
export function getUserVote(entity, userId) {
  if (!entity || !userId) return 0;
  if (entity.upVotesBy?.includes(userId)) return 1;
  if (entity.downVotesBy?.includes(userId)) return -1;
  return 0;
}

/**
 * Return new upVotesBy/downVotesBy arrays after optimistically applying
 * a vote change, so the UI can update instantly before the API responds.
 * @param {{upVotesBy: string[], downVotesBy: string[]}} entity - Thread or comment.
 * @param {string} userId - The current user's id.
 * @param {1|-1|0} voteType - The new vote type to apply.
 * @return {{upVotesBy: string[], downVotesBy: string[]}} Updated vote arrays.
 */
export function applyVote(entity, userId, voteType) {
  const upVotesBy = (entity.upVotesBy || []).filter((id) => id !== userId);
  const downVotesBy = (entity.downVotesBy || []).filter((id) => id !== userId);

  if (voteType === 1) upVotesBy.push(userId);
  if (voteType === -1) downVotesBy.push(userId);

  return {upVotesBy, downVotesBy};
}
