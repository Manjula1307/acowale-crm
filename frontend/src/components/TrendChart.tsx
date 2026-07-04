import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface TrendPoint {
  date: string;
  count: number;
}

function TrendChart({ data }: { data: TrendPoint[] }) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm p-5">
      <p className="font-display font-semibold text-sm mb-1">Feedback Trend</p>
      <p className="text-xs text-[var(--text-secondary)] mb-4">Last 14 days</p>
      {formatted.length === 0 ? (
        <div className="h-[180px] flex items-center justify-center text-sm text-[var(--text-secondary)]">
          Not enough data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }} />
            <Line type="monotone" dataKey="count" stroke="var(--cobalt)" strokeWidth={2.5} dot={{ r: 3, fill: 'var(--cobalt)' }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default TrendChart;