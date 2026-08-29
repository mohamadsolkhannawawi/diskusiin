import {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ThreadCard from '../components/ThreadCard';
import CategoryFilterBar from '../components/CategoryFilterBar';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import {asyncFetchThreads} from '../states/threads/threadsSlice';
import {asyncFetchUsers} from '../states/users/usersSlice';

/**
 * Merge raw thread objects (which only carry an ownerId) with the
 * matching user's name/avatar, so ThreadCard can display who posted it.
 * @param {Array} threads - Raw threads from the API.
 * @param {Array} users - All registered users.
 * @return {Array} Threads enriched with ownerName/ownerAvatar.
 */
function withOwnerInfo(threads, users) {
  return threads.map((thread) => {
    const owner = users.find((user) => user.id === thread.ownerId);
    return {
      ...thread,
      ownerName: owner?.name,
      ownerAvatar: owner?.avatar,
    };
  });
}

/**
 * Landing page: lists every thread, with a category filter and an
 * entry point into each thread's detail page.
 * @return {JSX.Element} Home page element.
 */
export default function HomePage() {
  const dispatch = useDispatch();
  const {items: threads, status, error} = useSelector((state) => state.threads);
  const {items: users} = useSelector((state) => state.users);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    dispatch(asyncFetchThreads());
    dispatch(asyncFetchUsers());
  }, [dispatch]);

  const enrichedThreads = useMemo(() => withOwnerInfo(threads, users), [threads, users]);

  const categories = useMemo(() => {
    const unique = new Set(
      threads.map((thread) => thread.category).filter((category) => Boolean(category)),
    );
    return Array.from(unique);
  }, [threads]);

  const visibleThreads = useMemo(() => {
    if (activeCategory === 'all') return enrichedThreads;
    return enrichedThreads.filter((thread) => thread.category === activeCategory);
  }, [enrichedThreads, activeCategory]);

  const hasLocalThreads = Array.isArray(threads) && threads.length > 0;

  return (
    <div className="page grid-texture">
      <div className="blob" style={{width: 260, height: 260, top: -60, right: -80, background: '#2f6fed'}} />

      <div className="page-header">
        <h1>Ruang diskusi, tanpa ribet.</h1>
        <p className="page-subtitle">
          Lempar pertanyaan, bagikan ide, dan ikut ngobrol bareng developer lain.
        </p>
      </div>

      {categories.length > 0 && (
        <CategoryFilterBar
          categories={categories}
          active={activeCategory}
          onSelect={setActiveCategory}
        />
      )}

      {status === 'loading' && !hasLocalThreads && <Loading label="Memuat thread..." />}

      {status === 'failed' && !hasLocalThreads && (
        <div style={{textAlign: 'center'}}>
          <EmptyState title="Gagal memuat thread" description={error} />
          <button
            type="button"
            onClick={() => dispatch(asyncFetchThreads())}
            style={{marginTop: '1rem', padding: '0.5rem 1.5rem', borderRadius: '8px', border: 'none', background: '#2f6fed', color: '#fff', cursor: 'pointer', fontWeight: 500}}
          >
            Coba Lagi
          </button>
        </div>
      )}

      {hasLocalThreads && status === 'loading' && (
        <div style={{padding: '0.75rem', background: 'rgba(47, 111, 237, 0.1)', color: '#2f6fed', textAlign: 'center', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500}}>
          Memperbarui thread...
        </div>
      )}

      {hasLocalThreads && status === 'failed' && (
        <div style={{padding: '0.75rem', background: 'rgba(237, 71, 71, 0.1)', color: '#ed4747', textAlign: 'center', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem'}}>
          <span>Gagal memperbarui thread.</span>
          <button
            type="button"
            onClick={() => dispatch(asyncFetchThreads())}
            style={{padding: '0.25rem 0.75rem', borderRadius: '6px', border: '1px solid currentColor', background: 'transparent', color: 'inherit', cursor: 'pointer', fontSize: '0.85rem'}}
          >
            Coba lagi
          </button>
        </div>
      )}

      {(status === 'succeeded' || hasLocalThreads) && visibleThreads.length === 0 && (
        <EmptyState
          title="Belum ada thread di sini"
          description="Jadilah yang pertama membuka diskusi pada kategori ini."
        />
      )}

      {(status === 'succeeded' || hasLocalThreads) && visibleThreads.length > 0 && (
        <div className="thread-list">
          {visibleThreads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
        </div>
      )}
    </div>
  );
}
