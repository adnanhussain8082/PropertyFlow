import { useState } from 'react';
import { Plus, Users, Clock, Search, Filter, Wrench, Zap, Hammer, Wind, User } from 'lucide-react';
import CreateJobModal from '../components/CreateJobModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { ENDPOINTS } from '../config';

const typeIcons = {
  General: Wrench,
  Plumbing: Wrench,
  Electrical: Zap,
  Carpentry: Hammer,
  HVAC: Wind
};

export default function AgentDashboard({ jobs, refreshJobs, user }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [reviewingJob, setReviewingJob] = useState(null);
  const [confirmAssign, setConfirmAssign] = useState({ open: false, job: null, applicant: null });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, jobId: null });

  // Filter jobs
  const myJobs = jobs.filter(j => j.created_by === user.id);
  const openJobs = myJobs.filter(j => j.status === 'Open');
  
  const filteredJobs = openJobs
    .filter(j => {
      const searchLower = searchTerm.toLowerCase();
      return j.title.toLowerCase().includes(searchLower) || 
             j.description.toLowerCase().includes(searchLower) ||
             j.type.toLowerCase().includes(searchLower);
    })
    .filter(j => filterType === 'All' || j.type === filterType);

  // Calculate stats
  const totalApplicants = myJobs.reduce((sum, job) => sum + (job.applicants?.length || 0), 0);
  const completedJobs = myJobs.filter(j => j.status === 'Completed').length;
  const activeListings = openJobs.length;

  const handleAssignJob = async () => {
    try {
      const response = await fetch(ENDPOINTS.assign(confirmAssign.job.id), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantId: confirmAssign.applicant.id,
          contractorName: confirmAssign.applicant.name
        })
      });

      if (!response.ok) throw new Error('Failed to assign job');

      setConfirmAssign({ open: false, job: null, applicant: null });
      setReviewingJob(null);
      refreshJobs();
    } catch (err) {
      alert('Error assigning job: ' + err.message);
    }
  };

  const handleDeleteJob = async () => {
    try {
      const response = await fetch(`${ENDPOINTS.jobs}/${confirmDelete.jobId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete job');

      setConfirmDelete({ open: false, jobId: null });
      refreshJobs();
    } catch (err) {
      alert('Error deleting job: ' + err.message);
    }
  };

  const handlePayJob = async (jobId) => {
    try {
      const response = await fetch(ENDPOINTS.pay(jobId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to process payment');

      alert('Payment processed successfully!');
      refreshJobs();
    } catch (err) {
      alert('Error processing payment: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-propertyflow-dark">Agent Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your property maintenance jobs</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-propertyflow-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-propertyflow-gold/90 transition-colors flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Post New Job
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Applicants</p>
              <p className="text-3xl font-bold text-propertyflow-dark mt-2">{totalApplicants}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Completed Jobs</p>
              <p className="text-3xl font-bold text-propertyflow-dark mt-2">{completedJobs}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Listings</p>
              <p className="text-3xl font-bold text-propertyflow-dark mt-2">{activeListings}</p>
            </div>
            <div className="bg-propertyflow-gold/20 p-3 rounded-full">
              <Wrench className="w-8 h-8 text-propertyflow-gold" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
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
          <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-propertyflow-gold focus:border-transparent appearance-none bg-white"
          >
            <option value="All">All Categories</option>
            <option value="General">General</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="HVAC">HVAC</option>
            <option value="Carpentry">Carpentry</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      <div>
        <h2 className="text-xl font-bold text-propertyflow-dark mb-4">Open Jobs</h2>
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <p className="text-gray-500">No open jobs found. Post your first job to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map(job => {
              const Icon = typeIcons[job.type] || Wrench;
              return (
                <div key={job.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-propertyflow-gold/10 p-2 rounded-lg">
                      <Icon className="w-6 h-6 text-propertyflow-gold" />
                    </div>
                    <button
                      onClick={() => setConfirmDelete({ open: true, jobId: job.id })}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  
                  <h3 className="font-bold text-propertyflow-dark mb-2">{job.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-propertyflow-gold font-bold">${job.budget}</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {job.type}
                    </span>
                  </div>

                  {job.applicants && job.applicants.length > 0 ? (
                    <button
                      onClick={() => setReviewingJob(job)}
                      className="w-full bg-propertyflow-dark text-white py-2 rounded-lg hover:bg-propertyflow-dark/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Users className="w-4 h-4" />
                      Review {job.applicants.length} Application{job.applicants.length !== 1 ? 's' : ''}
                    </button>
                  ) : (
                    <div className="text-center text-gray-400 text-sm py-2">
                      No applications yet
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* All Jobs Section */}
      <div>
        <h2 className="text-xl font-bold text-propertyflow-dark mb-4">All My Jobs</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-propertyflow-light">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-propertyflow-dark uppercase">Job Title</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-propertyflow-dark uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-propertyflow-dark uppercase">Contractor</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-propertyflow-dark uppercase">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-propertyflow-dark uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {myJobs.map(job => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-propertyflow-dark">{job.title}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                        job.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                        job.status === 'Assigned' ? 'bg-purple-100 text-purple-700' :
                        job.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                        job.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {job.assigned_to || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-propertyflow-gold">
                      ${job.budget}
                    </td>
                    <td className="px-6 py-4">
                      {job.status === 'Completed' && (
                        <button
                          onClick={() => handlePayJob(job.id)}
                          className="text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Mark as Paid
                        </button>
                      )}
                      {job.status === 'Paid' && (
                        <span className="text-sm text-green-600 font-semibold">✓ Paid</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateJobModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={refreshJobs}
        userId={user.id}
      />

      {/* Review Applicants Modal */}
      {reviewingJob && (
        <div className="fixed inset-0 bg-propertyflow-dark/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-propertyflow-dark">Applications</h3>
                <p className="text-gray-600 mt-1">{reviewingJob.title}</p>
              </div>
              <button
                onClick={() => setReviewingJob(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="space-y-4">
              {reviewingJob.applicants.map(applicant => (
                <div key={applicant.id} className="border border-gray-200 rounded-lg p-4 hover:border-propertyflow-gold transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-propertyflow-dark/10 p-2 rounded-full">
                        <User className="w-5 h-5 text-propertyflow-dark" />
                      </div>
                      <div>
                        <h4 className="font-bold text-propertyflow-dark">{applicant.name}</h4>
                        <p className="text-sm text-gray-500">Applied on {new Date(applicant.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Bid Amount</p>
                      <p className="text-xl font-bold text-propertyflow-gold">${applicant.bid}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-propertyflow-dark mb-1">Proposal:</p>
                    <p className="text-sm text-gray-700">{applicant.proposal}</p>
                  </div>

                  <button
                    onClick={() => setConfirmAssign({ open: true, job: reviewingJob, applicant })}
                    className="w-full bg-propertyflow-gold text-white py-2 rounded-lg hover:bg-propertyflow-gold/90 transition-colors font-semibold"
                  >
                    Hire {applicant.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmAssign.open}
        onClose={() => setConfirmAssign({ open: false, job: null, applicant: null })}
        onConfirm={handleAssignJob}
        title="Assign Job"
        message={`Are you sure you want to assign this job to ${confirmAssign.applicant?.name} for $${confirmAssign.applicant?.bid}?`}
        confirmText="Assign Job"
      />

      <ConfirmationModal
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, jobId: null })}
        onConfirm={handleDeleteJob}
        title="Delete Job"
        message="Are you sure you want to delete this job? This action cannot be undone."
        confirmText="Delete"
        confirmColor="bg-red-600"
      />
    </div>
  );
}
