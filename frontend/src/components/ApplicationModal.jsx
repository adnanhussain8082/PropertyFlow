import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { ENDPOINTS } from '../config';

export default function ApplicationModal({ isOpen, onClose, job, contractor, onSuccess }) {
  const [formData, setFormData] = useState({
    bid: job?.budget || '',
    proposal: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(ENDPOINTS.apply(job.id), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractor_id: contractor.id,
          name: contractor.name,
          bid: parseInt(formData.bid),
          proposal: formData.proposal
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit application');
      }

      // Reset form and close
      setFormData({ bid: '', proposal: '' });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-propertyflow-dark/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-propertyflow-dark">Apply for Job</h3>
            <p className="text-gray-600 mt-1">{job.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Job Details */}
        <div className="bg-propertyflow-light p-4 rounded-lg mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Category:</span>
              <span className="ml-2 font-semibold text-propertyflow-dark">{job.type}</span>
            </div>
            <div>
              <span className="text-gray-500">Budget:</span>
              <span className="ml-2 font-semibold text-propertyflow-gold">${job.budget}</span>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-gray-500 text-sm">Description:</span>
            <p className="text-sm text-gray-700 mt-1">{job.description}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-propertyflow-dark mb-2">
              Your Bid Amount ($) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.bid}
              onChange={(e) => setFormData({ ...formData, bid: e.target.value })}
              placeholder="Enter your proposed price"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-propertyflow-gold focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Suggested budget: ${job.budget}
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-propertyflow-dark mb-2">
              Proposal / Why you're the best fit *
            </label>
            <textarea
              required
              value={formData.proposal}
              onChange={(e) => setFormData({ ...formData, proposal: e.target.value })}
              placeholder="Explain your experience, approach, timeline, and why the agent should hire you for this job..."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-propertyflow-gold focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Tip: Mention relevant experience and estimated completion time
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-propertyflow-dark text-white rounded-lg hover:bg-propertyflow-dark/90 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
