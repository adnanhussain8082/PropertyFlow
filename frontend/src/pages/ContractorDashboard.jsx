import { useState } from 'react';
import { Briefcase, Search, Play, CheckCircle, DollarSign, Clock, Wrench, Zap, Hammer, Wind, Filter } from 'lucide-react';
import ApplicationModal from '../components/ApplicationModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { ENDPOINTS } from '../config';

const typeIcons = {
  General: Wrench,
  Plumbing: Wrench,
  Electrical: Zap,
  Carpentry: Hammer,
  HVAC: Wind
};

const statusColors = {
  'Assigned': 'bg-purple-100 text-purple-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  'Completed': 'bg-green-100 text-green-700',
  'Paid': 'bg-gray-100 text-gray-700'
};

export default function ContractorDashboard({ jobs, refreshJobs, user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [applyingJob, setApplyingJob] = useState(null);
  const [confirmAction, setConfirmAction] = useState({ open: false, type: null, job: null });

  // Filter jobs
  const myActiveJobs = jobs.filter(j => j.assigned_to_id === user.id && j.status !== 'Paid');
  const availableJobs = jobs.filter(j => j.status === 'Open');
  const filteredAvailableJobs = availableJobs
    .filter(j => {
      const searchLower = searchTerm.toLowerCase();
      return j.title.toLowerCase().includes(searchLower) || 
             j.description.toLowerCase().includes(searchLower) ||
             j.type.toLowerCase().includes(searchLower);
    })
    .filter(j => filterType === 'All' || j.type === filterType);

  const handleStatusUpdate = async (jobId, newStatus) => {
    try {
      const response = await fetch(ENDPOINTS.status(jobId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          contractor_id: user.id
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update status');
      }

      setConfirmAction({ open: false, type: null, job: null });
      refreshJobs();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const getActionButton = (job) => {
    if (job.status === 'Assigned') {
      return (
        <button
          onClick={() => setConfirmAction({ open: true, type: 'start', job })}
          className="w-full bg-propertyflow-gold text-white py-2 rounded-lg hover:bg-propertyflow-gold/90 transition-colors flex items-center justify-center gap-2 font-semibold"
        >
          <Play className="w-4 h-4" />
          Start Work
        </button>
      );
    }

    if (job.status === 'In Progress') {
      return (
        <button
          onClick={() => setConfirmAction({ open: true, type: 'complete', job })}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-semibold"
        >
          <CheckCircle className="w-4 h-4" />
          Mark Complete
        </button>
      );
    }

    if (job.status === 'Completed') {
      return (
        <div className="w-full bg-yellow-100 text-yellow-700 py-2 rounded-lg text-center font-semibold flex items-center justify-center gap-2">
          <Clock className="w-4 h-4" />
          Awaiting Payment
        </div>
      );
    }

    if (job.status === 'Paid') {
      return (
        <div className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg text-center font-semibold flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4" />
          ✓ Paid
        </div>
      );
    }
  };

  const completedJobsCount = jobs.filter(j => j.assigned_to_id === user.id && j.status === 'Paid').length;
  const earnings = jobs
    .filter(j => j.assigned_to_id === user.id && j.status === 'Paid')
    .reduce((sum, job) => sum + job.budget, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-propertyflow-dark">Contractor Dashboard</h1>
        <p className="text-gray-600 mt-1">Find jobs, manage projects, and grow your business</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Projects</p>
              <p className="text-3xl font-bold text-propertyflow-dark mt-2">{myActiveJobs.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Completed Jobs</p>
              <p className="text-3xl font-bold text-propertyflow-dark mt-2">{completedJobsCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Earnings</p>
              <p className="text-3xl font-bold text-propertyflow-dark mt-2">${earnings}</p>
            </div>
            <div className="bg-propertyflow-gold/20 p-3 rounded-full">
              <DollarSign className="w-8 h-8 text-propertyflow-gold" />
            </div>
          </div>
        </div>
      </div>

      {/* My Active Projects */}
      {myActiveJobs.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-propertyflow-dark mb-4">My Active Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myActiveJobs.map(job => {
              const Icon = typeIcons[job.type] || Wrench;
              return (
                <div key={job.id} className="bg-white rounded-xl p-6 shadow-sm border-2 border-propertyflow-gold/20">
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-propertyflow-gold/10 p-2 rounded-lg">
                      <Icon className="w-6 h-6 text-propertyflow-gold" />
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColors[job.status]}`}>
                      {job.status}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-propertyflow-dark mb-2">{job.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-propertyflow-gold font-bold">${job.budget}</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {job.type}
                    </span>
                  </div>

                  {getActionButton(job)}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New Opportunities */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-propertyflow-dark mb-4">New Opportunities</h2>
          <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by title, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-propertyflow-gold focus:border-transparent"
              />
            </div>
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-propertyflow-gold focus:border-transparent appearance-none bg-white min-w-[160px]">
                <option value="All">All Categories</option>
                <option value="General">General</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="HVAC">HVAC</option>
                <option value="Carpentry">Carpentry</option>
              </select>
            </div>
          </div>
        </div>

        {filteredAvailableJobs.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <p className="text-gray-500">No jobs available at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAvailableJobs.map(job => {
              const Icon = typeIcons[job.type] || Wrench;
              const hasApplied = job.applicants?.some(a => a.contractor_id === user.id);
              
              return (
                <div key={job.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                      Open
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-propertyflow-dark mb-2">{job.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-propertyflow-gold font-bold">${job.budget}</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {job.type}
                    </span>
                  </div>

                  {hasApplied ? (
                    <div className="w-full bg-gray-100 text-gray-600 py-2 rounded-lg text-center font-semibold">
                      ✓ Applied
                    </div>
                  ) : (
                    <button
                      onClick={() => setApplyingJob(job)}
                      className="w-full bg-propertyflow-dark text-white py-2 rounded-lg hover:bg-propertyflow-dark/90 transition-colors font-semibold"
                    >
                      Apply Now
                    </button>
                  )}

                  {job.applicants && job.applicants.length > 0 && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                      {job.applicants.length} applicant{job.applicants.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <ApplicationModal
        isOpen={!!applyingJob}
        onClose={() => setApplyingJob(null)}
        job={applyingJob}
        contractor={user}
        onSuccess={refreshJobs}
      />

      <ConfirmationModal
        isOpen={confirmAction.open}
        onClose={() => setConfirmAction({ open: false, type: null, job: null })}
        onConfirm={() => handleStatusUpdate(
          confirmAction.job?.id,
          confirmAction.type === 'start' ? 'In Progress' : 'Completed'
        )}
        title={confirmAction.type === 'start' ? 'Start Work' : 'Mark as Complete'}
        message={confirmAction.type === 'start' 
          ? 'Are you ready to start working on this job?'
          : 'Have you completed all work for this job?'
        }
        confirmText={confirmAction.type === 'start' ? 'Start Work' : 'Mark Complete'}
        confirmColor={confirmAction.type === 'start' ? 'bg-propertyflow-gold' : 'bg-green-600'}
      />
    </div>
  );
}
