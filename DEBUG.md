# Debugging "Failed to Fetch" Error

If you're getting a "failed to fetch" error when trying to upload memes, here's how to debug and fix it:

## 🔍 Step 1: Check Your Setup

### Are you running the project locally?
If yes, make sure you have:

1. **Installed dependencies**:
   ```bash
   npm install
   ```

2. **Started the development server**:
   ```bash
   npm run dev
   # or
   vercel dev
   ```

3. **Check the server is running** at `http://localhost:3000`

### Are you testing on a deployed version?
If yes, make sure:

1. **Environment variables are set** in Vercel Dashboard
2. **Functions are deployed** correctly
3. **Supabase is configured** properly

## 🧪 Step 2: Use the Test Button

1. Go to the "Post Your Meme" page
2. Click the **🔧 Test API** button
3. Check the console (F12 → Console) for detailed logs

### Expected Results:
- ✅ **Success**: "API Working! Environment: {...}"
- ❌ **Failure**: Check the error message for clues

## 🔧 Step 3: Common Issues & Solutions

### Issue 1: "Cannot connect to server"
**Cause**: Development server not running
**Solution**: 
```bash
npm run dev
```

### Issue 2: "Network error" 
**Cause**: CORS or network connectivity
**Solution**: 
- Check internet connection
- If local: restart `vercel dev`
- If deployed: check Vercel function logs

### Issue 3: "Module not found" (in server logs)
**Cause**: Missing dependencies or import issues
**Solution**:
```bash
npm install @supabase/supabase-js @vercel/node
```

### Issue 4: "Invalid API key" (in server logs)
**Cause**: Missing environment variables
**Solution**: 
- Local: Create `.env.local` with Supabase keys
- Deployed: Add env vars in Vercel Dashboard

## 📝 Step 4: Check Browser Console

Open Developer Tools (F12) and look for:

1. **Network tab**: Check if the request is being made
2. **Console tab**: Look for error messages
3. **Application tab**: Check if you're on the right URL

## 🔍 Step 5: Temporary Test Mode

I've added a simplified test endpoint. The upload now uses `/api/memes/post-simple` which:
- ✅ Tests basic API connectivity
- ✅ Validates captcha
- ✅ Checks image data
- ❌ Doesn't save to database (test mode)

If this works, the issue is with Supabase configuration.
If this fails, the issue is with basic API setup.

## 🏥 Step 6: Specific Error Messages

### "Failed to fetch"
- **Local**: Server not running → `npm run dev`
- **Deployed**: Function not deployed → Check Vercel dashboard

### "CORS error"
- Headers are set correctly in the API
- Check if you're accessing the right domain

### "500 Internal Server Error"
- Check server logs in Vercel Dashboard → Functions
- Look for import errors or missing env variables

## 📋 Step 7: Checklist

- [ ] Node.js installed (v18+)
- [ ] Dependencies installed (`npm install`)
- [ ] Development server running (`npm run dev`)
- [ ] Environment variables set (if using Supabase)
- [ ] Browser console shows no CORS errors
- [ ] Test API button works
- [ ] Network tab shows request being made

## 🚀 Step 8: Switch Back to Full API

Once the simple test works, change this line in `index.html`:

```javascript
// Change from:
const response = await fetch(`${API_BASE}/api/memes/post-simple`, {

// Back to:
const response = await fetch(`${API_BASE}/api/memes/post`, {
```

## 📞 Still Having Issues?

1. **Check the console logs** (most important!)
2. **Try the test API button**
3. **Check if you're running `npm run dev`**
4. **Verify your environment variables**

The improved error messages will now tell you exactly what's wrong! 🎯
