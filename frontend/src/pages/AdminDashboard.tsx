import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

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
  recent: Feedback[];
}

function AdminDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, [search, categoryFilter]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Acodash</h1>
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-800">
          Log out
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Total Feedback</p>
          <p className="text-3xl font-bold text-purple-600">{summary?.total ?? 0}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm sm:col-span-2">
          <p className="text-sm text-gray-500 mb-2">Category Distribution</p>
          <div className="flex flex-wrap gap-3">
            {summary?.byCategory.map((c) => (
              <span key={c.category} className="text-sm bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                {c.category}: {c.count}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search comments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Categories</option>
          {['Product', 'Support', 'Billing', 'Feature Request', 'Other'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="p-3">Feedback</th>
              <th className="p-3">Category</th>
              <th className="p-3">Email</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {feedback.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">No feedback found</td>
              </tr>
            ) : (
              feedback.map((f) => (
                <tr key={f.id} className="border-b last:border-0">
                  <td className="p-3 max-w-xs truncate">{f.comment}</td>
                  <td className="p-3">{f.category}</td>
                  <td className="p-3 text-gray-500">{f.email || '—'}</td>
                  <td className="p-3 text-gray-500">{new Date(f.created_at).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;