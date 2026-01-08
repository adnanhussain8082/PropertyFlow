import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AgentDashboard from './pages/AgentDashboard';
import ContractorDashboard from './pages/ContractorDashboard';
import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { ENDPOINTS } from './config';

function Sidebar({ user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-propertyflow-dark">
          Property<span className="text-propertyflow-gold">Flow</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">Contractor Management</p>
      </div>

      <nav className="p-4 flex-1">
        <div className="flex items-center gap-3 px-4 py-3 bg-propertyflow-gold/10 rounded-lg">
          <LayoutDashboard className="w-5 h-5 text-propertyflow-gold" />
          <span className="font-semibold text-propertyflow-dark">Dashboard</span>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-propertyflow-light rounded-lg p-4 mb-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Logged in as</p>
          <p className="font-bold text-propertyflow-dark">{user?.name}</p>
          <p className="text-sm text-gray-600">{user?.role === 'agent' ? 'Property Agent' : 'Contractor'}</p>
          <p className="text-xs text-gray-500 mt-1">{user?.company}</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-propertyflow-dark text-white p-2 rounded-lg shadow-lg"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col bg-white border-r border-gray-200 fixed inset-y-0 left-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 animate-fade-in">
          <div className="fixed inset-0 bg-propertyflow-dark/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-80 bg-white flex flex-col animate-slide-up">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}

function DashboardLayout() {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const response = await fetch(ENDPOINTS.jobs);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // Refresh jobs every 5 seconds for real-time updates
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-propertyflow-light">
      <Sidebar user={user} onLogout={logout} />
      
      <main className="lg:pl-80">
        <div className="p-4 lg:p-8 pt-20 lg:pt-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-propertyflow-gold mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          ) : user.role === 'agent' ? (
            <AgentDashboard jobs={jobs} refreshJobs={fetchJobs} user={user} />
          ) : (
            <ContractorDashboard jobs={jobs} refreshJobs={fetchJobs} user={user} />
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardLayout />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
