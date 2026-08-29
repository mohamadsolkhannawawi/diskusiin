import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Avatar from '../components/Avatar';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import {asyncFetchLeaderboards} from '../states/leaderboards/leaderboardsSlice';

const MEDALS = ['🥇', '🥈', '🥉'];

/**
 * Displays the top contributors ranked by score.
 * @return {JSX.Element} Leaderboard page element.
 */
export default function LeaderboardPage() {
  const dispatch = useDispatch();
  const {items, status, error} = useSelector((state) => state.leaderboards);

  useEffect(() => {
    dispatch(asyncFetchLeaderboards());
  }, [dispatch]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Papan peringkat</h1>
        <p className="page-subtitle">Kontributor paling aktif di Diskusiin.</p>
      </div>

      {status === 'loading' && <Loading label="Memuat papan peringkat..." />}

      {status === 'failed' && (
        <EmptyState title="Gagal memuat papan peringkat" description={error} />
      )}

      {status === 'succeeded' && items.length === 0 && (
        <EmptyState title="Belum ada data" description="Papan peringkat masih kosong." />
      )}

      {status === 'succeeded' && items.length > 0 && (
        <ol className="leaderboard-list">
          {items.map((entry, index) => (
            <li key={entry.user.id} className="leaderboard-item">
              <span className="leaderboard-rank">
                {MEDALS[index] || `#${index + 1}`}
              </span>
              <Avatar name={entry.user.name} image={entry.user.avatar} size={42} tail={false} />
              <div className="leaderboard-meta">
                <span className="leaderboard-name">{entry.user.name}</span>
                <span className="leaderboard-email">{entry.user.email}</span>
              </div>
              <span className="leaderboard-score">{entry.score} pts</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
