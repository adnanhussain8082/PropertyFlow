import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState(null);

  const handleLogin = (role) => {
    login(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-propertyflow-dark via-propertyflow-dark to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full animate-fade-in">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Property<span className="text-propertyflow-gold">Flow</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Streamlining Property Maintenance & Contractor Management
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Connect Property Agents with Skilled Contractors
          </p>
        </div>

        {/* Login Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Agent Login */}
          <div
            className={`bg-white rounded-2xl p-8 shadow-2xl transform transition-all duration-300 ${
              hoveredRole === 'agent' ? 'scale-105 shadow-propertyflow-gold/50' : ''
            }`}
            onMouseEnter={() => setHoveredRole('agent')}
            onMouseLeave={() => setHoveredRole(null)}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-propertyflow-gold/10 p-6 rounded-full">
                <Briefcase className="w-16 h-16 text-propertyflow-gold" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-propertyflow-dark text-center mb-3">
              Property Agent
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Manage properties, post maintenance jobs, and hire contractors
            </p>
            <ul className="text-sm text-gray-700 space-y-2 mb-8">
              <li className="flex items-start">
                <span className="text-propertyflow-gold mr-2">✓</span>
                Post maintenance jobs for rental properties
              </li>
              <li className="flex items-start">
                <span className="text-propertyflow-gold mr-2">✓</span>
                Review contractor proposals and bids
              </li>
              <li className="flex items-start">
                <span className="text-propertyflow-gold mr-2">✓</span>
                Assign jobs and track work progress
              </li>
              <li className="flex items-start">
                <span className="text-propertyflow-gold mr-2">✓</span>
                Process payments and manage budgets
              </li>
            </ul>
            <button
              onClick={() => handleLogin('agent')}
              className="w-full bg-propertyflow-gold text-white py-3 rounded-lg font-semibold hover:bg-propertyflow-gold/90 transition-colors flex items-center justify-center gap-2 group"
            >
              Login as Agent
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Contractor Login */}
          <div
            className={`bg-white rounded-2xl p-8 shadow-2xl transform transition-all duration-300 ${
              hoveredRole === 'contractor' ? 'scale-105 shadow-propertyflow-gold/50' : ''
            }`}
            onMouseEnter={() => setHoveredRole('contractor')}
            onMouseLeave={() => setHoveredRole(null)}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-propertyflow-dark/10 p-6 rounded-full">
                <User className="w-16 h-16 text-propertyflow-dark" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-propertyflow-dark text-center mb-3">
              Contractor
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Find jobs, submit proposals, and grow your business
            </p>
            <ul className="text-sm text-gray-700 space-y-2 mb-8">
              <li className="flex items-start">
                <span className="text-propertyflow-gold mr-2">✓</span>
                Browse available maintenance jobs
              </li>
              <li className="flex items-start">
                <span className="text-propertyflow-gold mr-2">✓</span>
                Submit competitive bids with proposals
              </li>
              <li className="flex items-start">
                <span className="text-propertyflow-gold mr-2">✓</span>
                Update work status and communicate progress
              </li>
              <li className="flex items-start">
                <span className="text-propertyflow-gold mr-2">✓</span>
                Get paid for completed work
              </li>
            </ul>
            <button
              onClick={() => handleLogin('contractor')}
              className="w-full bg-propertyflow-dark text-white py-3 rounded-lg font-semibold hover:bg-propertyflow-dark/90 transition-colors flex items-center justify-center gap-2 group"
            >
              Login as Contractor
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400 text-sm">
          <p>Demo Mode - No Password Required</p>
          <p className="mt-2">
            Built for Rentr Placement Assignment | January 2026
          </p>
        </div>
      </div>
    </div>
  );
}
