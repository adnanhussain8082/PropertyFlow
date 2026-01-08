// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const ENDPOINTS = {
  jobs: `${API_URL}/api/jobs`,
  apply: (jobId) => `${API_URL}/api/jobs/${jobId}/apply`,
  assign: (jobId) => `${API_URL}/api/jobs/${jobId}/assign`,
  status: (jobId) => `${API_URL}/api/jobs/${jobId}/status`,
  pay: (jobId) => `${API_URL}/api/jobs/${jobId}/pay`,
  contractor: (id) => `${API_URL}/api/contractors/${id}`,
};
