# PropertyFlow - Contractor Job & Work Order Management System

> **Official Assignment Submission for Rentr Placement**  
> Full-Stack Property Maintenance Contractor Management Platform  
> **GitHub Repository:** https://github.com/adnanhussain8082/PropertyFlow  
> Deadline: Thursday, January 8, 2026

---

## 🏠 Project Overview

**PropertyFlow** is a comprehensive web-based workflow management system designed for the **property/letting industry**, connecting Property Agents with Maintenance Contractors to streamline the maintenance job lifecycle - from job posting to completion and payment.

### Industry Context

In the rental property management industry, agents face constant challenges:
- **Emergency repairs** (plumbing leaks, electrical issues, HVAC failures)
- **Scheduled maintenance** (painting, carpentry, general upkeep)
- **Multiple properties** requiring coordinated contractor management
- **Budget tracking** and transparent pricing
- **Tenant satisfaction** through quick turnaround times

PropertyFlow solves these problems by providing:
- ✅ Centralized job posting and contractor discovery
- ✅ Competitive bidding system for cost transparency
- ✅ Real-time work status tracking
- ✅ Simplified payment processing
- ✅ Complete audit trail for property owners

---

## 🎯 Core Features Implemented

### For Property Agents
- **Post Maintenance Jobs** - Create detailed job listings with descriptions, categories, and budgets
- **Review Applications** - See all contractor proposals and bid amounts
- **Assign Work** - Select the best contractor for each job
- **Track Progress** - Monitor job status from assignment to completion
- **Process Payments** - Mark jobs as paid once work is verified

### For Contractors
- **Browse Jobs** - View all available maintenance opportunities
- **Submit Proposals** - Apply with competitive bids and detailed proposals
- **Manage Projects** - Update work status (Start → In Progress → Complete)
- **Track Earnings** - See completed jobs and total revenue

---

## 🛠️ Tech Stack

### Frontend
- **React 19.0.0** - Modern UI library
- **Vite 6.0.11** - Lightning-fast build tool
- **React Router DOM 7.x** - Client-side routing
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 4.18.2** - Web framework
- **SQLite 5.1.7** - Lightweight database (perfect for assignment demo!)
- **Express-validator 7.0.1** - Input validation

### Design System
- **Custom color palette:**
  - `propertyflow-dark`: #0F2C32 (Deep teal)
  - `propertyflow-gold`: #A87F59 (Bronze/gold accents)
  - `propertyflow-light`: #F5F5F0 (Warm light background)
- **Responsive breakpoints:** Mobile-first design with md/lg breakpoints
- **Animations:** Smooth fade-in and slide-up transitions

---

## 📁 Project Structure

```
PropertyFlow/
├── package.json               # Root package - runs both servers
├── README.md                  # This file
├── AI_USAGE_DISCLOSURE.md     # AI transparency document
├── QUICKSTART.md              # 3-minute setup guide
├── .gitignore                 # Git exclusions
│
├── backend/
│   ├── server.js              # Express server and API routes
│   ├── database.js            # SQLite configuration & table initialization
│   ├── package.json           # Backend dependencies
│   ├── .env                   # Environment variables
│   └── .env.example           # Environment template
│
└── frontend/
    ├── src/
    │   ├── App.jsx            # Main app with routing & layout
    │   ├── main.jsx           # React entry point
    │   ├── config.js          # API configuration
    │   ├── index.css          # Global styles
    │   ├── context/
    │   │   └── AuthContext.jsx     # User authentication state
    │   ├── pages/
    │   │   ├── Login.jsx           # Dual-role login page
    │   │   ├── AgentDashboard.jsx  # Agent job management
    │   │   └── ContractorDashboard.jsx  # Contractor job discovery
    │   └── components/
    │       ├── CreateJobModal.jsx       # Job creation form
    │       ├── ApplicationModal.jsx     # Contractor bid submission
    │       └── ConfirmationModal.jsx    # Reusable confirmation dialog
    ├── package.json           # Frontend dependencies
    ├── vite.config.js         # Vite configuration
    ├── tailwind.config.js     # Tailwind CSS configuration
    └── index.html             # HTML entry point
```

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm** or **yarn**

### Quick Start (Single Command!)

#### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd PropertyFlow
```

#### 2. Install All Dependencies
```bash
npm run install:all
```

This will install dependencies for:
- Root package (concurrently)
- Backend (Express, SQLite, etc.)
- Frontend (React, Vite, Tailwind, etc.)

#### 3. Start the Application
```bash
npm run dev
```

That's it! One command starts both servers:
- ✅ **Backend API** runs on http://localhost:8000
- ✅ **Frontend UI** runs on http://localhost:5173
- ✅ SQLite database auto-created with demo users

#### 4. Access the Application

Open your browser and go to: **http://localhost:5173**

**Demo Login Credentials:**
- **Agent Login:** Click "Login as Agent" button (no password needed)
- **Contractor Login:** Click "Login as Contractor" button (no password needed)

---

## 📖 User Guide

### Complete Workflow Example

#### Scenario: Fix a Leaking Faucet

**Step 1: Agent Posts Job**
1. Login as Agent
2. Click "Post New Job"
3. Fill in:
   - Title: "Fix leaking kitchen faucet"
   - Category: Plumbing
   - Description: "Kitchen sink faucet leaking at 123 Oak Street, Unit 5B"
   - Budget: $150
4. Submit → Job appears in "Open Jobs"

**Step 2: Contractor Applies**
1. Logout and login as Contractor
2. Browse "New Opportunities"
3. Click "Apply Now" on the plumbing job
4. Enter:
   - Bid: $140
   - Proposal: "10 years plumbing experience, can complete within 24 hours..."
5. Submit → Application sent

**Step 3: Agent Reviews & Assigns**
1. Logout and login as Agent
2. Job card now shows "1 Applicant"
3. Click "Review Applications"
4. View contractor's bid and proposal
5. Click "Hire" → Job status changes to "Assigned"

**Step 4: Contractor Completes Work**
1. Logout and login as Contractor
2. Job appears in "My Active Projects"
3. Click "Start Work" → Status: "In Progress"
4. After completing work, click "Mark Complete" → Status: "Completed"

**Step 5: Agent Processes Payment**
1. Logout and login as Agent
2. Go to "All My Jobs" table
3. Find the completed job
4. Click "Mark as Paid"
5. Job status changes to "Paid" ✅

---

## 🔑 Key Features & Technical Highlights

### Role-Based Access Control
- Different dashboards for Agent vs Contractor
- Action buttons change based on user role
- Jobs filtered by user relationship (created vs assigned)

### Real-Time Updates
- Jobs refresh every 5 seconds automatically
- Instant UI updates after actions
- No page refresh needed

### State Machine Validation
- Backend enforces valid state transitions:
  - Open → Assigned (Agent assigns job)
  - Assigned → In Progress (Contractor starts)
  - In Progress → Completed (Contractor finishes)
  - Completed → Paid (Agent processes payment)
- Frontend buttons disabled for invalid actions

### Enhanced Search & Filter
- **Multi-field search**: Search across job title, description, AND category
- **Category filtering**: Filter by job type (Plumbing, Electrical, HVAC, Carpentry, General)
- **Instant results**: Real-time filtering as you type
- **Agent dashboard**: Search and filter open jobs with dropdown selector
- **Contractor dashboard**: Search all available opportunities with category filter
- **Backend API support**: Optional query parameters for programmatic filtering

### Responsive Design
- Mobile-friendly layout
- Collapsible sidebar on small screens
- Grid layouts adapt to screen size
- Touch-friendly buttons

### User Experience
- Loading states during API calls
- Confirmation modals for destructive actions (delete, assign)
- Error messages for failed operations
- Success feedback after actions
- Smooth animations (fade-in, slide-up)

---

## 🗄️ Database Schema

### Users Table
```sql
- id (Primary Key)
- name, email, role (agent/contractor)
- company, location, phone, bio
- rating, reviews, completed_jobs
- skills (JSON array)
- created_at, updated_at
```

### Jobs Table
```sql
- id (Primary Key)
- title, type, description, budget
- status (Open/Assigned/In Progress/Completed/Paid)
- assigned_to, assigned_to_id (Contractor reference)
- created_by (Agent reference)
- created_at, updated_at
```

### Applicants Table
```sql
- id (Primary Key)
- job_id (Foreign Key → jobs)
- contractor_id (Foreign Key → users)
- name, bid, proposal
- date, created_at
```

---

## 🌐 API Endpoints

### Jobs
- `GET /api/jobs` - Get all jobs with applicants (supports query params: ?category=Plumbing&search=leak&status=Open)
- `POST /api/jobs` - Create new job (Agent only)
- `PUT /api/jobs/:id` - Update job (Agent only, Open status)
- `DELETE /api/jobs/:id` - Delete job (Agent only, Open/Assigned status)

### Applications
- `POST /api/jobs/:id/apply` - Submit application (Contractor only)

### Job Management
- `POST /api/jobs/:id/assign` - Assign job to contractor (Agent only)
- `POST /api/jobs/:id/status` - Update job status (Contractor only)
- `POST /api/jobs/:id/pay` - Mark job as paid (Agent only)

### Users
- `GET /api/contractors/:id` - Get contractor profile

---

## ✅ Assignment Requirements Checklist

### Core Functionality ✅
- [x] Agent can create jobs
- [x] Contractor can view and apply to jobs
- [x] Agent can review applicants and assign jobs
- [x] Contractor can update job status
- [x] Agent can mark jobs as paid
- [x] Role-based dashboards
- [x] Complete job lifecycle workflow

### Technical Requirements ✅
- [x] React frontend with modern hooks
- [x] Node.js + Express backend
- [x] Database (SQLite) with proper schema
- [x] RESTful API design
- [x] Input validation
- [x] Error handling
- [x] Responsive design

### Property Industry Context ✅
- [x] Maintenance job categories (Plumbing, Electrical, HVAC, etc.)
- [x] Budget tracking
- [x] Contractor bidding system
- [x] Work status tracking
- [x] Payment processing

### Code Quality ✅
- [x] Clean component structure
- [x] Reusable components (modals)
- [x] Context API for state management
- [x] Consistent naming conventions
- [x] Comments on complex logic
- [x] Organized file structure

### Documentation ✅
- [x] Comprehensive README
- [x] Setup instructions
- [x] User guide with examples
- [x] API documentation
- [x] Project structure explanation

---

## 🎨 Design Decisions

### Why SQLite?
- **Zero configuration** - Database file created automatically
- **No installation needed** - Perfect for assignment demo
- **Portable** - Single `.db` file easy to share
- **Production-ready alternative noted** - Can swap to PostgreSQL easily

### Why Demo Authentication?
- **Focus on core features** - Assignment time better spent on job workflow
- **Simple role switching** - Easy to test both user perspectives
- **Professional note** - README explains this is simplified for demo

### Why No PDF Invoices?
- **Time constraint** - 2 days to complete full project
- **Core workflow priority** - Job management more important than invoice formatting
- **Extensibility note** - Documented as future enhancement

---

## 🚧 Future Enhancements

### If I Had More Time (Post-Assignment)
1. **Real Authentication** - JWT tokens, password hashing, secure sessions
2. **Invoice System** - PDF generation with html2pdf.js
3. **Contractor Profiles** - Detailed pages with ratings, reviews, portfolios
4. **File Uploads** - Before/after photos, documents
5. **Real-Time Notifications** - WebSocket for instant updates
6. **Email System** - Application confirmations, status updates
7. **Advanced Filtering** - Date range, price range, multiple categories
8. **Rating System** - Contractors and agents rate each other
9. **Property Database** - Link jobs to specific properties
10. **Calendar Integration** - Schedule jobs, track deadlines
11. **Mobile App** - React Native version
12. **Analytics Dashboard** - Job metrics, contractor performance

---

## 🧪 Testing Guide

### Manual Testing Checklist

**Agent Workflow:**
- [ ] Can create job with all fields
- [ ] Job appears in dashboard
- [ ] Can search/filter jobs
- [ ] Receives applications
- [ ] Can review applicants
- [ ] Can assign job
- [ ] Can view job progress
- [ ] Can mark as paid
- [ ] Can delete open jobs

**Contractor Workflow:**
- [ ] Can view available jobs
- [ ] Can search jobs
- [ ] Can submit application with bid
- [ ] Cannot apply twice to same job
- [ ] Assigned jobs appear in "My Projects"
- [ ] Can start work
- [ ] Can mark complete
- [ ] Sees "Awaiting Payment" status
- [ ] Sees "Paid" status after agent pays

**Edge Cases:**
- [ ] Cannot apply to assigned job
- [ ] Cannot delete job beyond "Assigned" status
- [ ] Status transitions follow state machine
- [ ] Validation errors display properly
- [ ] Loading states show during API calls

---

## 🎓 What I Learned / Technical Skills Demonstrated

### Frontend Development
- React hooks (useState, useEffect, useContext)
- React Router for navigation
- Context API for global state
- Component composition and reusability
- Tailwind CSS responsive design
- Conditional rendering based on state
- Form validation and error handling

### Backend Development
- RESTful API design
- Express middleware
- SQLite database operations
- Input validation with express-validator
- Error handling and status codes
- CORS configuration
- Environment variables

### Full-Stack Integration
- API communication (fetch)
- State synchronization
- Real-time polling
- Error propagation
- Loading states

### Software Engineering
- Project structure organization
- Separation of concerns
- DRY principles (reusable components)
- Code comments and documentation
- Git version control
- README best practices

---

## 🤝 Assignment Context

**Course:** Web Development / Full-Stack Development  
**Assignment:** Contractor Job & Work Order Management Module  
**Company:** Rentr (Property Management Platform)  
**Deadline:** Thursday, January 8, 2026  
**Development Time:** ~16 hours across 2 days

**Objective:** Demonstrate ability to build a complete full-stack application relevant to the property/letting industry, showcasing:
- Full-stack development skills (React + Node.js)
- Understanding of property management workflows
- Clean code architecture
- Professional documentation
- Honest AI usage disclosure

---

## 📧 Contact & Submission

**Submitted By:** Adnan Hussain  
**Email:** adnanhussain8082@gmail.com  
**GitHub:** https://github.com/adnanhussain8082  
**Repository:** https://github.com/adnanhussain8082/PropertyFlow

**Submission Date:** [Submission Date]

---

## 📄 License

This project was created as an assignment submission for Rentr placement. All rights reserved.

---

## 🙏 Acknowledgments

- **Rentr Team** - For the opportunity and clear assignment brief
- **React & Node.js Communities** - For excellent documentation
- **Tailwind CSS** - For making styling enjoyable
- **Lucide React** - For beautiful icons

---

## 🎯 Final Notes

This application demonstrates a **complete, working full-stack solution** for the property maintenance contractor management use case. While simplified in some areas (authentication, invoicing) to meet the assignment deadline, the core workflow is **fully functional** and showcases:

1. ✅ **Industry-relevant problem solving** - Addresses real property management pain points
2. ✅ **Technical proficiency** - Clean, organized, working code
3. ✅ **Professional delivery** - Comprehensive documentation, honest AI disclosure
4. ✅ **Attention to detail** - Responsive design, error handling, user experience

Thank you for reviewing my submission! I look forward to discussing my implementation and the property tech space. 🏠✨

---

**PropertyFlow** - Streamlining Property Maintenance, One Job at a Time.
