import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CategoryPoint {
  category: string;
  count: number;
}

const COLORS = ['#3654E0', '#F0803C', '#2CA58D', '#D6446D', '#8890A0'];

function CategoryChart({ data }: { data: CategoryPoint[] }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm p-5 shadow-sm">
      <p className="font-display font-semibold text-sm mb-1">Category Distribution</p>
      <p className="text-xs text-[var(--text-secondary)] mb-4">All time</p>
      {data.length === 0 ? (
        <div className="h-[180px] flex items-center justify-center text-sm text-[var(--text-secondary)]">
          No feedback yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="category"
              tick={{ fontSize: 12, fill: 'var(--ink)' }}
              axisLine={false}
              tickLine={false}
              width={100}
            />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }} />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={22}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default CategoryChart;