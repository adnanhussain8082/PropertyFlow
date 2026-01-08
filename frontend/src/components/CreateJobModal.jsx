import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { ENDPOINTS } from '../config';

export default function CreateJobModal({ isOpen, onClose, onSuccess, userId }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'General',
    description: '',
    budget: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const jobTypes = ['General', 'Plumbing', 'Electrical', 'HVAC', 'Carpentry'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(ENDPOINTS.jobs, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          budget: parseInt(formData.budget),
          created_by: userId
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create job');
      }

      // Reset form and close
      setFormData({ title: '', type: 'General', description: '', budget: '' });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-propertyflow-dark/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold text-propertyflow-dark">Post New Maintenance Job</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-propertyflow-dark mb-2">
              Job Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Fix leaking faucet in kitchen"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-propertyflow-gold focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-propertyflow-dark mb-2">
              Job Category *
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-propertyflow-gold focus:border-transparent"
            >
              {jobTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-propertyflow-dark mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the maintenance work needed, location in property, any special requirements..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-propertyflow-gold focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-propertyflow-dark mb-2">
              Budget ($) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              placeholder="e.g., 150"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-propertyflow-gold focus:border-transparent"
            />
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
              className="px-6 py-2 bg-propertyflow-gold text-white rounded-lg hover:bg-propertyflow-gold/90 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                'Creating...'
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Post Job
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
