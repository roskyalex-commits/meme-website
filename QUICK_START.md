# 🚀 Quick Start Guide - MemeVote

Having trouble with "vercel not recognized"? Here are multiple ways to get started:

## ✅ Method 1: Try the Fixed Version

```bash
npm install
npm run dev
```

If this works, open `http://localhost:3000` in your browser.

## ✅ Method 2: Simple HTTP Server (No API)

If Vercel doesn't work, try the simple version:

```bash
npm run dev:simple
```

**Note**: This serves the HTML but APIs won't work (no meme posting/voting).

## ✅ Method 3: Install Vercel Globally

```bash
npm install -g vercel
npm run dev
```

## ✅ Method 4: Use Different Port

If port 3000 is busy:

```bash
npx http-server . -p 8080 -c-1 --cors
```

Then open `http://localhost:8080`

## ✅ Method 5: Python Server (If you have Python)

**Python 3:**
```bash
python -m http.server 3000
```

**Python 2:**
```bash
python -m SimpleHTTPServer 3000
```

## ✅ Method 6: Live Server (VS Code Extension)

1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

## 🔍 Troubleshooting

### Error: "vercel not recognized"
- **Solution**: Run `npm install` first, then try again

### Error: "Port 3000 already in use"
- **Solution**: Use a different port like 8080 or 8000

### Error: "npm not recognized"
- **Solution**: Install Node.js from [nodejs.org](https://nodejs.org)

### API not working (memes won't post/vote)
- **Cause**: Using simple HTTP server instead of Vercel
- **Solution**: Use `npm run dev` with Vercel, not `npm run dev:simple`

## 🎯 What Should Work

1. **Full functionality**: `npm run dev` (with Vercel)
2. **Static only**: `npm run dev:simple` (no database features)

## 🌐 Expected URLs

- **Local development**: `http://localhost:3000`
- **NOT this**: `file:///C:/Users/.../index.html` ❌

## 📞 Still Having Issues?

1. Make sure you have Node.js installed
2. Run `npm install` in the project folder
3. Try each method above in order
4. Open the correct URL in your browser (not the file directly)

The website will show a helpful error message if you open the HTML file directly! 🎉

