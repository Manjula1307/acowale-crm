import { useEffect, useState, useCallback } from 'react';
import apiClient from '../api/client';
import Sidebar from '../components/Sidebar';
import StatusDropdown from '../components/StatusDropdown';
import CategoryDropdown from '../components/CategoryDropdown';

interface Feedback {
  id: number;
  category: string;
  comment: string;
  email: string | null;
  status: string;
  created_at: string;
}

const PAGE_SIZE = 10;

function FeedbackList() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: PAGE_SIZE };
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;
      const res = await apiClient.get('/feedback', { params });
      setFeedback(res.data);
    } catch (err) {
      console.error('Failed to load feedback', err);
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1); // reset to page 1 whenever filters change
  }, [search, categoryFilter]);

  const handleStatusChange = async (id: number, status: string) => {
    setFeedback((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));
    try {
      await apiClient.patch(`/feedback/${id}/status`, { status });
    } catch (err) {
      console.error('Failed to update status', err);
      fetchData();
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar active="feedback" />

      <main className="flex-1 p-8 max-w-6xl">
        <h1 className="font-display text-2xl font-semibold mb-1">Feedback</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          All submissions, searchable and filterable
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Search comments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-[var(--border)] rounded-lg px-3 py-2 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cobalt)]"
          />
          <CategoryDropdown value={categoryFilter} onChange={setCategoryFilter} />
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm overflow-visible">
          <div className="overflow-x-auto rounded-b-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--text-secondary)] border-b border-[var(--border)]">
                  <th className="p-3 font-medium">Feedback</th>
                  <th className="p-3 font-medium">Category</th>
                  <th className="p-3 font-medium">Email</th>
                  <th className="p-3 font-medium">Date</th>
                  <th className="p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-sm text-[var(--text-secondary)]">Loading…</td></tr>
                ) : feedback.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-sm text-[var(--text-secondary)]">No feedback matches your filters.</td></tr>
                ) : (
                  feedback.map((f) => (
                    <tr key={f.id} className="border-b border-[var(--border)] last:border-0">
                      <td className="p-3 max-w-sm truncate">{f.comment}</td>
                      <td className="p-3 text-[var(--text-secondary)]">{f.category}</td>
                      <td className="p-3 text-[var(--text-secondary)]">{f.email || '—'}</td>
                      <td className="p-3 font-mono text-xs text-[var(--text-secondary)]">
                        {new Date(f.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <StatusDropdown value={f.status} onChange={(status) => handleStatusChange(f.id, status)} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-sm px-3 py-1.5 rounded-lg border border-[var(--border)] disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs font-mono text-[var(--text-secondary)]">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={feedback.length < PAGE_SIZE}
            className="text-sm px-3 py-1.5 rounded-lg border border-[var(--border)] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

export default FeedbackList;