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

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left: brand panel */}
      <div className="bg-[var(--ink)] text-white p-10 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* subtle background accent */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[var(--cobalt)] opacity-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[var(--amber)] opacity-10 blur-3xl" />

        <div className="relative">
          <div className="font-display font-bold text-lg mb-16">
            Acowale <span className="text-[var(--amber)]">CRM</span>
          </div>

          <h1 className="font-display text-4xl lg:text-5xl font-semibold leading-tight mb-6">
            Tell us what's<br />on your mind.
          </h1>
          <p className="text-white/60 text-base max-w-sm">
            Every submission goes straight to our team's dashboard — read, tracked,
            and acted on. Takes less than a minute.
          </p>
        </div>

        <div className="relative flex gap-8 mt-16 lg:mt-0">
          <div>
            <p className="font-mono text-2xl font-medium text-[var(--amber)]">01</p>
            <p className="text-xs text-white/50 mt-1">Pick a category</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-medium text-[var(--amber)]">02</p>
            <p className="text-xs text-white/50 mt-1">Share your thoughts</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-medium text-[var(--amber)]">03</p>
            <p className="text-xs text-white/50 mt-1">We take it from there</p>
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="bg-[var(--paper)] flex items-center justify-center px-6 py-12 lg:py-6">
        <div className="w-full max-w-md">
          {status === 'success' ? (
            <div className="bg-[var(--surface)] border border-[var(--border)] p-8 rounded-xl shadow-sm text-center">
              <div className="w-10 h-10 rounded-full bg-[var(--cobalt-light)] text-[var(--cobalt)] flex items-center justify-center mx-auto mb-4 font-display font-semibold">
                ✓
              </div>
              <h2 className="font-display text-xl font-semibold mb-2">Thank you</h2>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                Your feedback helps us improve.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="text-sm font-medium text-[var(--cobalt)] hover:underline"
              >
                Submit another response
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-[var(--surface)] border border-[var(--border)] p-8 rounded-xl shadow-sm"
            >
              <h2 className="font-display text-xl font-semibold mb-1">Submit feedback</h2>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                Fields marked required take a few seconds to fill in.
              </p>

              <label className="block text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cobalt)]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <label className="block text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)] mb-1">
                Your feedback
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={4}
                placeholder="Share your thoughts, suggestions, or issues..."
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cobalt)]"
              />

              <label className="block text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)] mb-1">
                Email (optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2 mb-1 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cobalt)]"
              />
              <p className="text-xs text-[var(--text-secondary)] mb-4">We'll never share your email.</p>

              {status === 'error' && (
                <p className="text-red-600 text-sm mb-4">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-[var(--cobalt)] text-white text-sm font-medium py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {status === 'submitting' ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          )}

          <p className="text-center text-xs text-[var(--text-secondary)] mt-6 font-mono">
            Acowale CRM Machine Test by Manjula Satapathi
          </p>
        </div>
      </div>
    </div>
  );
}

export default FeedbackForm;