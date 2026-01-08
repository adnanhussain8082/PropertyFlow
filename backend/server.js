require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ==================== UTILITY FUNCTIONS ====================

// Helper to get jobs with applicants and invoices
function getJobsWithRelations(callback) {
  const query = `
    SELECT 
      j.*,
      u.name as created_by_name,
      u.email as created_by_email
    FROM jobs j
    LEFT JOIN users u ON j.created_by = u.id
    ORDER BY j.created_at DESC
  `;

  db.all(query, [], (err, jobs) => {
    if (err) return callback(err);

    // Fetch applicants for each job
    const jobsWithRelations = [];
    let processed = 0;

    if (jobs.length === 0) return callback(null, []);

    jobs.forEach(job => {
      // Get applicants
      db.all('SELECT * FROM applicants WHERE job_id = ?', [job.id], (err, applicants) => {
        if (err) return callback(err);

        // Get invoice
        db.get('SELECT * FROM invoices WHERE job_id = ?', [job.id], (err, invoice) => {
          if (err) return callback(err);

          jobsWithRelations.push({
            ...job,
            applicants: applicants || [],
            invoice: invoice || null
          });

          processed++;
          if (processed === jobs.length) {
            callback(null, jobsWithRelations);
          }
        });
      });
    });
  });
}

// ==================== API ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PropertyFlow API is running' });
});

// Get all jobs with applicants and invoices
// Optional query params: ?category=Plumbing&search=leak&status=Open
app.get('/api/jobs', (req, res) => {
  const { category, search, status } = req.query;
  
  getJobsWithRelations((err, jobs) => {
    if (err) {
      console.error('Error fetching jobs:', err);
      return res.status(500).json({ error: 'Failed to fetch jobs' });
    }
    
    // Apply filters if provided
    let filteredJobs = jobs;
    
    if (category && category !== 'All') {
      filteredJobs = filteredJobs.filter(j => j.type === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredJobs = filteredJobs.filter(j => 
        j.title.toLowerCase().includes(searchLower) ||
        j.description.toLowerCase().includes(searchLower) ||
        j.type.toLowerCase().includes(searchLower)
      );
    }
    
    if (status) {
      filteredJobs = filteredJobs.filter(j => j.status === status);
    }
    
    res.json(filteredJobs);
  });
});

// Create new job (Agent only)
app.post('/api/jobs', [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('type').isIn(['General', 'Plumbing', 'Electrical', 'HVAC', 'Carpentry']).withMessage('Invalid job type'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('budget').isInt({ min: 0 }).withMessage('Budget must be a positive number'),
  body('created_by').isInt().withMessage('Created by user ID is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, type, description, budget, created_by } = req.body;

  db.run(
    'INSERT INTO jobs (title, type, description, budget, created_by) VALUES (?, ?, ?, ?, ?)',
    [title, type, description, budget, created_by],
    function(err) {
      if (err) {
        console.error('Error creating job:', err);
        return res.status(500).json({ error: 'Failed to create job' });
      }

      // Return the created job
      db.get('SELECT * FROM jobs WHERE id = ?', [this.lastID], (err, job) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to fetch created job' });
        }
        res.status(201).json({ success: true, job });
      });
    }
  );
});

// Update job (Agent only - for Open status jobs)
app.put('/api/jobs/:id', [
  body('title').optional().trim().isLength({ min: 3 }),
  body('type').optional().isIn(['General', 'Plumbing', 'Electrical', 'HVAC', 'Carpentry']),
  body('description').optional().trim().isLength({ min: 10 }),
  body('budget').optional().isInt({ min: 0 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const jobId = req.params.id;
  const { title, type, description, budget } = req.body;

  // Check if job is in Open status
  db.get('SELECT status FROM jobs WHERE id = ?', [jobId], (err, job) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch job' });
    }
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    if (job.status !== 'Open') {
      return res.status(400).json({ error: 'Can only edit jobs in Open status' });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (type !== undefined) { updates.push('type = ?'); values.push(type); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (budget !== undefined) { updates.push('budget = ?'); values.push(budget); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(jobId);

    db.run(
      `UPDATE jobs SET ${updates.join(', ')} WHERE id = ?`,
      values,
      function(err) {
        if (err) {
          console.error('Error updating job:', err);
          return res.status(500).json({ error: 'Failed to update job' });
        }
        res.json({ success: true, message: 'Job updated successfully' });
      }
    );
  });
});

// Delete job (Agent only)
app.delete('/api/jobs/:id', (req, res) => {
  const jobId = req.params.id;

  // Check job status
  db.get('SELECT status FROM jobs WHERE id = ?', [jobId], (err, job) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch job' });
    }
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    if (!['Open', 'Assigned'].includes(job.status)) {
      return res.status(400).json({ error: 'Cannot delete jobs beyond Assigned status' });
    }

    db.run('DELETE FROM jobs WHERE id = ?', [jobId], function(err) {
      if (err) {
        console.error('Error deleting job:', err);
        return res.status(500).json({ error: 'Failed to delete job' });
      }
      res.json({ success: true, message: 'Job deleted successfully' });
    });
  });
});

// Apply for job (Contractor only)
app.post('/api/jobs/:id/apply', [
  body('contractor_id').isInt().withMessage('Contractor ID is required'),
  body('name').trim().notEmpty().withMessage('Contractor name is required'),
  body('bid').isInt({ min: 0 }).withMessage('Bid must be a positive number'),
  body('proposal').trim().isLength({ min: 10 }).withMessage('Proposal must be at least 10 characters')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const jobId = req.params.id;
  const { contractor_id, name, bid, proposal } = req.body;

  // Check if job is in Open status
  db.get('SELECT status FROM jobs WHERE id = ?', [jobId], (err, job) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch job' });
    }
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    if (job.status !== 'Open') {
      return res.status(400).json({ error: 'Can only apply to jobs in Open status' });
    }

    // Check if contractor already applied
    db.get(
      'SELECT id FROM applicants WHERE job_id = ? AND contractor_id = ?',
      [jobId, contractor_id],
      (err, existing) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        if (existing) {
          return res.status(400).json({ error: 'You have already applied to this job' });
        }

        // Insert application
        db.run(
          'INSERT INTO applicants (job_id, contractor_id, name, bid, proposal) VALUES (?, ?, ?, ?, ?)',
          [jobId, contractor_id, name, bid, proposal],
          function(err) {
            if (err) {
              console.error('Error applying to job:', err);
              return res.status(500).json({ error: 'Failed to apply to job' });
            }
            res.status(201).json({ success: true, message: 'Application submitted successfully' });
          }
        );
      }
    );
  });
});

// Assign job to contractor (Agent only)
app.post('/api/jobs/:id/assign', [
  body('applicantId').isInt().withMessage('Applicant ID is required'),
  body('contractorName').trim().notEmpty().withMessage('Contractor name is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const jobId = req.params.id;
  const { applicantId, contractorName } = req.body;

  // Get applicant details
  db.get('SELECT contractor_id FROM applicants WHERE id = ?', [applicantId], (err, applicant) => {
    if (err || !applicant) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    // Update job
    db.run(
      `UPDATE jobs 
       SET status = 'Assigned', assigned_to = ?, assigned_to_id = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [contractorName, applicant.contractor_id, jobId],
      function(err) {
        if (err) {
          console.error('Error assigning job:', err);
          return res.status(500).json({ error: 'Failed to assign job' });
        }
        res.json({ success: true, message: 'Job assigned successfully' });
      }
    );
  });
});

// Update job status (Contractor only)
app.post('/api/jobs/:id/status', [
  body('status').isIn(['In Progress', 'Completed']).withMessage('Invalid status'),
  body('contractor_id').isInt().withMessage('Contractor ID is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const jobId = req.params.id;
  const { status, contractor_id } = req.body;

  // Verify contractor is assigned to this job
  db.get('SELECT assigned_to_id, status FROM jobs WHERE id = ?', [jobId], (err, job) => {
    if (err || !job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    if (job.assigned_to_id !== contractor_id) {
      return res.status(403).json({ error: 'You are not assigned to this job' });
    }

    // Validate state transition
    if (job.status === 'Assigned' && status !== 'In Progress') {
      return res.status(400).json({ error: 'Can only start work from Assigned status' });
    }
    if (job.status === 'In Progress' && status !== 'Completed') {
      return res.status(400).json({ error: 'Can only mark as completed from In Progress status' });
    }

    db.run(
      'UPDATE jobs SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, jobId],
      function(err) {
        if (err) {
          console.error('Error updating job status:', err);
          return res.status(500).json({ error: 'Failed to update status' });
        }
        res.json({ success: true, message: 'Status updated successfully' });
      }
    );
  });
});

// Mark job as paid (Agent only - simplified payment)
app.post('/api/jobs/:id/pay', (req, res) => {
  const jobId = req.params.id;

  db.get('SELECT status FROM jobs WHERE id = ?', [jobId], (err, job) => {
    if (err || !job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    if (job.status !== 'Completed') {
      return res.status(400).json({ error: 'Can only pay completed jobs' });
    }

    db.run(
      'UPDATE jobs SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['Paid', jobId],
      function(err) {
        if (err) {
          console.error('Error marking job as paid:', err);
          return res.status(500).json({ error: 'Failed to process payment' });
        }
        res.json({ success: true, message: 'Payment processed successfully' });
      }
    );
  });
});

// Get contractor profile
app.get('/api/contractors/:id', (req, res) => {
  const contractorId = req.params.id;

  db.get('SELECT * FROM users WHERE id = ? AND role = ?', [contractorId, 'contractor'], (err, contractor) => {
    if (err) {
      console.error('Error fetching contractor:', err);
      return res.status(500).json({ error: 'Failed to fetch contractor' });
    }
    if (!contractor) {
      return res.status(404).json({ error: 'Contractor not found' });
    }

    // Parse skills JSON
    if (contractor.skills) {
      try {
        contractor.skills = JSON.parse(contractor.skills);
      } catch (e) {
        contractor.skills = [];
      }
    }

    res.json(contractor);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PropertyFlow API server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${process.env.DATABASE_PATH || 'propertyflow.db'}`);
});
