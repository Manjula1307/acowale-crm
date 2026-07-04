import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const STATUS_OPTIONS = ['received', 'in_progress', 'resolved'];
const STATUS_STYLES: Record<string, string> = {
  received: 'bg-[var(--cobalt-light)] text-[var(--cobalt)]',
  in_progress: 'bg-amber-50 text-[var(--amber)]',
  resolved: 'bg-emerald-50 text-emerald-600',
};

function StatusDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (status: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[value]}`}
      >
        {value.replace('_', ' ')}
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-10 mt-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-md py-1 min-w-[120px]">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => {
                onChange(s);
                setOpen(false);
              }}
              className={`w-full text-left text-xs px-3 py-1.5 hover:bg-[var(--paper)] ${
                s === value ? 'font-semibold' : ''
              }`}
            >
              <span className={`inline-block px-2 py-0.5 rounded-full ${STATUS_STYLES[s]}`}>
                {s.replace('_', ' ')}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default StatusDropdown;