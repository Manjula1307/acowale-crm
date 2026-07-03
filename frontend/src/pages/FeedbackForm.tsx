import { useState } from 'react';
import apiClient from '../api/client';

const CATEGORIES = ['Product', 'Support', 'Billing', 'Feature Request', 'Other'];

function FeedbackForm() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      await apiClient.post('/feedback', { category, comment, email: email || undefined });
      setStatus('success');
      setComment('');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md">
          <h2 className="text-2xl font-bold text-purple-600 mb-2">Thank you!</h2>
          <p className="text-gray-600 mb-6">Your feedback helps us improve.</p>
          <button
            onClick={() => setStatus('idle')}
            className="text-purple-600 font-medium hover:underline"
          >
            Submit another response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md">
        <h1 className="text-2xl font-bold mb-1">We value your feedback</h1>
        <p className="text-gray-500 mb-6 text-sm">Help us improve by sharing your experience.</p>

        <label className="block text-sm font-medium mb-1">Category *</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label className="block text-sm font-medium mb-1">Your feedback *</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={4}
          placeholder="Share your thoughts, suggestions, or issues..."
          className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <label className="block text-sm font-medium mb-1">Your email (optional)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full border rounded-lg px-3 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <p className="text-xs text-gray-400 mb-4">We'll never share your email.</p>

        {status === 'error' && (
          <p className="text-red-600 text-sm mb-4">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-purple-600 text-white font-medium py-2.5 rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {status === 'submitting' ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}

export default FeedbackForm;