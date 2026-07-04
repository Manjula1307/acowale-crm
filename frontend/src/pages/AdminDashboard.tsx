import { useEffect, useState, useCallback } from 'react';
import apiClient from '../api/client';
import Sidebar from '../components/Sidebar';
import TrendChart from '../components/TrendChart';
import CategoryChart from '../components/CategoryChart';
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

interface Summary {
  total: number;
  byCategory: { category: string; count: number }[];
  byStatus: { status: string; count: number }[];
  recent: Feedback[];
  trend: { date: string; count: number }[];
}

function AdminDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const params: any = {};
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;

      const [summaryRes, feedbackRes] = await Promise.all([
        apiClient.get('/feedback/summary'),
        apiClient.get('/feedback', { params }),
      ]);

      setSummary(summaryRes.data);
      setFeedback(feedbackRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (id: number, status: string) => {
    // optimistic update — reflect the change immediately, revert if the API call fails
    setFeedback((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));
    try {
      await apiClient.patch(`/feedback/${id}/status`, { status });
      fetchData(); // re-sync stat cards / byStatus counts
    } catch (err) {
      console.error('Failed to update status', err);
      fetchData(); // revert to server truth
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-mono text-sm">Loading dashboard…</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar active="overview" />
    <main className="flex-1 p-8 max-w-6xl">
    <div className="flex items-center justify-between mb-6">
        <div>
        <h1 className="font-display text-2xl font-semibold mb-1">Overview</h1>
        <p className="text-sm text-[var(--text-secondary)]">Real-time summary of customer feedback</p>
        </div>
        <div className="font-mono text-xs text-[var(--text-secondary)] bg-[var(--cobalt-light)] text-[var(--cobalt)] px-3 py-1.5 rounded-full">
        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
     </div>
       {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-[var(--surface)] border border-[var(--border)] border-l-4 border-l-[var(--cobalt)] rounded-xl p-5 shadow-sm">
                <p className="text-xs text-[var(--text-secondary)] mb-1 uppercase tracking-wide">Total Feedback</p>
                <p className="font-mono text-3xl font-medium text-[var(--cobalt)]">{summary?.total ?? 0}</p>
            </div>
            <div className="bg-[var(--surface)] border border-[var(--border)] border-l-4 border-l-[var(--amber)] rounded-xl p-5 shadow-sm">
                <p className="text-xs text-[var(--text-secondary)] mb-1 uppercase tracking-wide">In Progress</p>
                <p className="font-mono text-3xl font-medium text-[var(--amber)]">
                {summary?.byStatus.find((s) => s.status === 'in_progress')?.count ?? 0}
                </p>
            </div>
            <div className="bg-[var(--surface)] border border-[var(--border)] border-l-4 border-l-emerald-500 rounded-xl p-5 shadow-sm">
                <p className="text-xs text-[var(--text-secondary)] mb-1 uppercase tracking-wide">Resolved</p>
                <p className="font-mono text-3xl font-medium text-emerald-600">
                {summary?.byStatus.find((s) => s.status === 'resolved')?.count ?? 0}
                </p>
            </div>  
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <TrendChart data={summary?.trend ?? []} />
          <CategoryChart data={summary?.byCategory ?? []} />
        </div>

        {/* Filters */}
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

        {/* Recent submissions table */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm overflow-visible">
          <div className="px-5 py-3 border-b border-[var(--border)] rounded-t-xl">
            <p className="font-display font-semibold text-sm">Recent Submissions</p>
          </div>
          <div className="overflow-x-auto rounded-b-xl">
            <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--text-secondary)] border-b border-[var(--border)]">
                <th className="p-3 font-medium">Feedback</th>
                <th className="p-3 font-medium">Category</th>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {feedback.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[var(--text-secondary)] text-sm">
                    No feedback matches your filters yet.
                  </td>
                </tr>
              ) : (
                feedback.map((f) => (
                  <tr key={f.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="p-3 max-w-xs truncate">{f.comment}</td>
                    <td className="p-3 text-[var(--text-secondary)]">{f.category}</td>
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
      </main>
    </div>
  );
}

export default AdminDashboard;