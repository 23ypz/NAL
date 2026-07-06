# Vercel Backend Deployment Notes

This package includes Vercel serverless adaptation for the Express backend.

Added files:
- `backend/api/index.js`: exports the Express app to Vercel Functions.
- `backend/vercel.json`: rewrites all backend requests to the Express function.

Deploy backend on Vercel:
- Import the GitHub repository.
- Root Directory: `backend`
- Framework Preset: Other
- Build Command: leave empty or use the detected default
- Output Directory: leave empty
- Environment Variables: copy your TiDB/JWT settings from `backend/.env`, but do not upload `.env`.

After backend is deployed, open:
`https://YOUR-BACKEND.vercel.app/health`

Then update `frontend/vercel.json`:
`https://YOUR_VERCEL_BACKEND_URL.vercel.app/api/:path*`

Deploy frontend on Vercel:
- Import the same GitHub repository as a new Vercel project.
- Root Directory: `frontend`
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
