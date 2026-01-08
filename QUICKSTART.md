# PropertyFlow - Quick Start Guide

## 🚀 Get Running in 3 Minutes!

### Step 1: Install All Dependencies (One Command!)

```bash
cd PropertyFlow
npm run install:all
```

This installs everything needed for both frontend and backend.

### Step 2: Start the Application (One Command!)

```bash
npm run dev
```

✅ Backend API running on http://localhost:8000  
✅ Frontend UI running on http://localhost:5173

Both servers start simultaneously with one command!

### Step 3: Open the App

Go to: **http://localhost:5173**

### Step 4: Test the Workflow

1. **Click "Login as Agent"**
2. **Click "Post New Job"** - Create a maintenance job
3. **Logout** (bottom left sidebar)
4. **Click "Login as Contractor"**
5. **Click "Apply Now"** on the job you created
6. **Logout** and login as Agent again
7. **Click "Review X Applications"**
8. **Click "Hire"** on the contractor
9. Switch back to Contractor and update job status
10. Complete the full workflow!

## ✅ That's it!

You now have a fully functional property maintenance management system running locally.

## 🐛 Troubleshooting

**Port already in use?**
- Backend: Change PORT in `backend/.env`
- Frontend: Change port in `frontend/vite.config.js`

**Database issues?**
- Delete `backend/propertyflow.db` and restart backend (auto-recreates)

**Dependencies failing?**
- Make sure you're using Node.js v18+
- Try `npm install --legacy-peer-deps`

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Review [AI_USAGE_DISCLOSURE.md](AI_USAGE_DISCLOSURE.md) for AI transparency
- Check out the code structure in `frontend/src/` and `backend/`

**Need Help?** Open an issue at https://github.com/adnanhussain8082/PropertyFlow/issues

---

**PropertyFlow** - Built for Rentr Placement Assignment 2026  
**Repository:** https://github.com/adnanhussain8082/PropertyFlow
