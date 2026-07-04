import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const CATEGORIES = ['All Categories', 'Product', 'Support', 'Billing', 'Feature Request', 'Other'];

function CategoryDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (category: string) => void;
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

  const display = value || 'All Categories';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between gap-2 border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--surface)] min-w-[160px]"
      >
        {display}
        <ChevronDown size={14} className={`text-[var(--text-secondary)] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-10 mt-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-md py-1 min-w-[160px] right-0">
          {CATEGORIES.map((c) => {
            const val = c === 'All Categories' ? '' : c;
            return (
              <button
                key={c}
                onClick={() => {
                  onChange(val);
                  setOpen(false);
                }}
                className={`w-full text-left text-sm px-3 py-1.5 hover:bg-[var(--cobalt-light)] ${
                  val === value ? 'text-[var(--cobalt)] font-medium bg-[var(--cobalt-light)]' : ''
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CategoryDropdown;