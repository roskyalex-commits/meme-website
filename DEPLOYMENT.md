# Deployment Guide - MemeVote

This guide will help you deploy MemeVote on Vercel with Supabase in just a few simple steps.

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Supabase account (free)

## 🗄️ Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project:
   - **Name**: `meme-vote-db`
   - **Database Password**: Generate a secure password
   - **Region**: Choose the closest region

### 2. Configure Database

1. In the Supabase dashboard, go to **SQL Editor**
2. Create a "New query"
3. Copy and run the content from the `supabase-setup.sql` file
4. Click "Run" to execute the script

### 3. Configure Storage

1. Go to **Storage** in the sidebar
2. The `memes` bucket should already be created by the script
3. Verify that policies are active in **Policies**

### 4. Get API Keys

1. Go to **Settings** > **API**
2. Copy the following values:
   - **Project URL**
   - **anon public key**
   - **service_role key** (secret!)

## 🚀 Vercel Deployment

### 1. Prepare Repository

```bash
# Clone or download the project
git clone <your-repo-url>
cd meme-website

# Initialize Git if needed
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import the GitHub repository
4. Configure the project:
   - **Project Name**: `meme-vote`
   - **Framework Preset**: Other
   - **Root Directory**: ./

### 3. Add Environment Variables

In Vercel Dashboard:

1. Go to **Settings** > **Environment Variables**
2. Add the following variables:

```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

⚠️ **Important**: `SUPABASE_SERVICE_ROLE_KEY` is secret and should not be exposed in the frontend!

### 4. Deploy

1. Click **Deploy**
2. Wait for the build to complete
3. Test the application at the generated URL

## ✅ Post-Deployment Verification

### 1. Test Functionality

1. **Homepage**: Verify it loads correctly
2. **Post Meme**: Try posting a test meme
3. **Voting**: Try voting for a meme
4. **IP Limiting**: Try voting again (should be blocked)

### 2. Check Supabase

1. **Database**: Go to **Table Editor** > `memes` and `votes`
2. **Storage**: Go to **Storage** > `memes` for images
3. **Logs**: Check **Logs** for errors

### 3. Check Vercel

1. **Functions**: Go to **Functions** for API logs
2. **Analytics**: Check traffic in **Analytics**
3. **Domains**: Configure custom domain if desired

## 🔧 Advanced Configuration

### Custom Domain

1. In Vercel Dashboard > **Settings** > **Domains**
2. Add your domain
3. Configure DNS records according to instructions

### Advanced Rate Limiting

Add to environment variables:

```
RATE_LIMIT_WINDOW_MS=86400000  # 24 hours in milliseconds
RATE_LIMIT_MAX_VOTES=1         # maximum 1 vote per day
```

### Monitoring and Alerts

1. **Vercel**: Configure notifications in **Settings** > **Notifications**
2. **Supabase**: Configure alerts in **Settings** > **Billing & Usage**

## 🐛 Troubleshooting

### Common Issues

#### 1. API Functions not working
```
Error: Module not found
```
**Solution**: Check that `package.json` has correct dependencies and functions are in the `api/` directory

#### 2. Supabase connection errors
```
Error: Invalid API key
```
**Solution**: 
- Check environment variables in Vercel
- Make sure you're using the correct key for each environment

#### 3. Images not loading
```
Error: Storage bucket not found
```
**Solution**:
- Check that the `memes` bucket exists in Supabase Storage
- Verify access policies in Storage > Policies

#### 4. Voting not working
```
Error: Row Level Security policy violation
```
**Solution**:
- Check that RLS policies are configured correctly
- Re-run the `supabase-setup.sql` script

### Production Debugging

1. **Vercel Logs**:
   ```bash
   vercel logs
   ```

2. **Supabase Logs**:
   - Go to Dashboard > Logs
   - Filter by time and level

3. **Browser Console**:
   - Open Developer Tools
   - Check errors in Console and Network tabs

## 📊 Monitoring

### Important Metrics

1. **Vercel Analytics**:
   - Page views
   - Unique visitors
   - Function invocations
   - Response times

2. **Supabase Metrics**:
   - Database connections
   - Storage usage
   - API requests
   - Auth users (if implemented)

### Free Tier Limits

#### Vercel (Hobby Plan)
- 100GB bandwidth/month
- 100 deployments/day
- Serverless function executions: 100GB-Hrs

#### Supabase (Free Tier)
- 500MB database
- 1GB storage
- 50MB file uploads
- 2 million edge function invocations

## 🔄 Updates and Maintenance

### Automatic Updates

- Connect repository to Vercel for automatic deployment
- Each push to `main` will trigger a new deployment

### Backups

1. **Database**: Supabase automatically backs up
2. **Storage**: Consider external backup for important images
3. **Code**: GitHub repository serves as backup

### Scaling

When the application grows:

1. **Vercel**: Upgrade to Pro plan for more resources
2. **Supabase**: Upgrade to Pro plan for more storage and bandwidth
3. **CDN**: Consider Cloudflare for image optimization

---

🎉 **Congratulations!** MemeVote should now be working perfectly. Users can post and vote on memes, and you have a fully functional website with minimalist design!