import { useNavigate } from 'react-router-dom';

function Sidebar({ active }: { active: 'overview' | 'feedback' }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <aside className="w-56 shrink-0 bg-[var(--ink)] text-white min-h-screen flex flex-col p-5">
      <div className="font-display font-bold text-lg mb-10">
        Acowale <span className="text-[var(--amber)]">CRM</span>
      </div>

      <nav className="flex-1 space-y-1">
        <div
            onClick={() => navigate('/admin/dashboard')}
            className={`px-3 py-2 rounded-lg text-sm font-medium cursor-pointer ${
                active === 'overview' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'
            }`}
        >
            Overview
        </div>
        <div
        onClick={() => navigate('/admin/feedback')}
        className={`px-3 py-2 rounded-lg text-sm font-medium cursor-pointer ${
            active === 'feedback' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'
        }`}
        >
            Feedback
        </div>
        <div className="px-3 py-2 rounded-lg text-sm font-medium text-white/30 cursor-not-allowed">
          Settings
        </div>
      </nav>

      <button
        onClick={handleLogout}
        className="text-sm text-white/50 hover:text-white text-left px-3 py-2"
      >
        Log out
      </button>
    </aside>
  );
}

export default Sidebar;