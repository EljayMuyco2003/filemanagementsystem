# 🚂 Railway Deployment Guide

## Prerequisites
- GitHub account
- Railway account (sign up at railway.app)
- Push your code to GitHub repository

## Step-by-Step Deployment

### 1. Create New Project sa Railway

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Select the `server` folder as root directory

### 2. Add PostgreSQL Database

1. Sa imong Railway project, click **"New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically:
   - Create a PostgreSQL instance
   - Generate `DATABASE_URL` environment variable
   - Link it to your backend service

### 3. Run Database Schema

After PostgreSQL is added:

```bash
# Option 1: Use Railway CLI
railway run psql $DATABASE_URL < ../database/schema.sql

# Option 2: Use Railway's PostgreSQL Data tab
# Copy-paste the contents of database/schema.sql
```

### 4. Configure Environment Variables

Sa Railway dashboard, go to **Variables** tab and add:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# JWT Configuration (Generate secure secret!)
JWT_SECRET=<generate-with-openssl-rand-base64-32>
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=https://your-app.vercel.app

# File Upload Configuration
MAX_FILE_SIZE=33554432
UPLOAD_DIR=uploads/
```

**Note:** `DATABASE_URL` is automatically provided by Railway PostgreSQL service.

### 5. Configure Build Settings

Railway should auto-detect, but verify:

- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Root Directory:** `/server` (if monorepo)

### 6. Deploy!

1. Click **"Deploy"**
2. Wait for build to complete
3. Railway will provide a public URL like: `https://your-app.up.railway.app`

### 7. Verify Deployment

Test your endpoints:

```bash
# Health check
curl https://your-app.up.railway.app/health

# API documentation
https://your-app.up.railway.app/api-docs
```

## Important Notes

### 🔒 Security Checklist

- [ ] Change `JWT_SECRET` to a secure random string
- [ ] Update `FRONTEND_URL` to your actual Vercel domain
- [ ] Never commit `.env` files to GitHub
- [ ] Enable Railway's automatic HTTPS

### 📁 File Uploads

**Current Setup:** Files are stored in `uploads/` folder

**⚠️ Warning:** Railway's filesystem is ephemeral (resets on redeploy)

**Recommended Solutions:**
1. **Railway Volumes** (Persistent storage)
   - Add a volume in Railway dashboard
   - Mount to `/app/uploads`

2. **Cloud Storage** (Better for production)
   - AWS S3
   - Cloudinary
   - UploadThing
   - Supabase Storage

### 🔄 Automatic Deployments

Railway automatically deploys when you push to your GitHub branch:

```bash
git add .
git commit -m "Update backend"
git push origin main
# Railway will auto-deploy! 🚀
```

### 📊 Monitoring

Railway provides:
- Real-time logs
- Metrics (CPU, Memory, Network)
- Deployment history
- Rollback capability

## Troubleshooting

### Build Fails

```bash
# Check Railway logs
railway logs

# Common issues:
# 1. Missing dependencies - check package.json
# 2. TypeScript errors - run npm run build locally first
# 3. Node version mismatch - specify in package.json
```

### Database Connection Issues

```bash
# Verify DATABASE_URL is set
railway variables

# Test database connection
railway run node test-db.js
```

### CORS Errors

Update `FRONTEND_URL` in Railway environment variables to match your Vercel domain.

## Railway CLI (Optional)

Install for easier management:

```bash
# Install
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# View logs
railway logs

# Run commands
railway run npm run build
```

## Cost Estimate

Railway Free Tier:
- $5 free credit per month
- Enough for small projects
- Upgrade to Pro for production apps

## Next Steps

After backend is deployed:
1. ✅ Copy your Railway URL
2. ✅ Update frontend API endpoint
3. ✅ Deploy frontend to Vercel
4. ✅ Update CORS settings with Vercel URL
5. ✅ Test end-to-end functionality

---

**Need help?** Check Railway docs: https://docs.railway.app
