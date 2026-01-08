const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize SQLite database
const dbPath = path.resolve(__dirname, process.env.DATABASE_PATH || 'propertyflow.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
    initializeDatabase();
  }
});

// Create tables if they don't exist
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('agent', 'contractor')),
        company TEXT,
        location TEXT,
        phone TEXT,
        bio TEXT,
        rating REAL DEFAULT 0,
        reviews INTEGER DEFAULT 0,
        completed_jobs INTEGER DEFAULT 0,
        skills TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Jobs table
    db.run(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        budget INTEGER NOT NULL,
        status TEXT DEFAULT 'Open' CHECK(status IN ('Open', 'Assigned', 'In Progress', 'Completed', 'Paid')),
        assigned_to TEXT,
        assigned_to_id INTEGER,
        created_by INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assigned_to_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Applicants table
    db.run(`
      CREATE TABLE IF NOT EXISTS applicants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_id INTEGER NOT NULL,
        contractor_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        bid INTEGER NOT NULL,
        proposal TEXT NOT NULL,
        date DATE DEFAULT CURRENT_DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        FOREIGN KEY (contractor_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Invoices table
    db.run(`
      CREATE TABLE IF NOT EXISTS invoices (
        id TEXT PRIMARY KEY,
        job_id INTEGER UNIQUE NOT NULL,
        amount INTEGER NOT NULL,
        notes TEXT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'paid')),
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
      )
    `);

    // Create indexes
    db.run('CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status)');
    db.run('CREATE INDEX IF NOT EXISTS idx_jobs_assigned_to_id ON jobs(assigned_to_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_applicants_job_id ON applicants(job_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_applicants_contractor_id ON applicants(contractor_id)');

    // Seed default users
    seedDefaultUsers();
  });
}

// Seed default users (Agent John and Adnan Hussain)
function seedDefaultUsers() {
  const users = [
    {
      id: 101,
      name: 'Adnan Hussain',
      email: 'adnan@propertyflow.app',
      role: 'contractor',
      company: 'Adnan Enterprises',
      location: 'Srinagar, Kashmir',
      phone: '+91-1234567890',
      bio: 'Licensed Electrician with 10+ years of experience in residential and commercial electrical work. Specialized in smart home installations and emergency repairs.',
      rating: 4.9,
      reviews: 128,
      completed_jobs: 42,
      skills: JSON.stringify(['Industrial Wiring', 'Generators', 'Smart Home', 'HVAC Repair'])
    },
    {
      id: 102,
      name: 'Agent John',
      email: 'agent@propertyflow.app',
      role: 'agent',
      company: 'Matrix Realty Group',
      location: 'New York, USA',
      phone: '+1-555-0123',
      bio: 'Senior Property Manager overseeing 50+ rental properties. Committed to maintaining high tenant satisfaction through prompt maintenance coordination.',
      rating: 5.0,
      reviews: 85,
      completed_jobs: 150,
      skills: JSON.stringify(['Property Management', 'Contract Negotiation', 'Tenant Relations'])
    }
  ];

  users.forEach(user => {
    db.run(
      `INSERT OR IGNORE INTO users (id, name, email, role, company, location, phone, bio, rating, reviews, completed_jobs, skills)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user.id, user.name, user.email, user.role, user.company, user.location, user.phone, user.bio, user.rating, user.reviews, user.completed_jobs, user.skills]
    );
  });
}

module.exports = db;
