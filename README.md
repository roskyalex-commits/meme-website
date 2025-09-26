# MemeVote - Daily Meme Democracy

A minimalist website for voting on memes with black and white design and subtle retro animations. Users can post memes and vote for the meme of the day without needing to register.

## 🎨 Features

- **Minimalist design**: Black and white style with subtle retro animations
- **No registration required**: Users can post and vote without creating an account
- **IP-based limiting**: One vote per day per IP for each meme
- **Responsive**: Works perfectly on mobile and desktop
- **Real-time**: Live updates of vote counts
- **Cloud storage**: Images stored in Supabase Storage

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Backend**: Vercel Serverless Functions
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Deployment**: Vercel (free tier)

## 🚀 Quick Setup

### 1. Clone the project
```bash
git clone <repository-url>
cd meme-website
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Copy the URL and keys from Settings > API
3. Run the SQL script from `supabase-setup.sql` in the SQL Editor
4. Create a `.env.local` file:

```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 4. Local development

**Option 1 - Easy start (Windows):**
```bash
# Double-click start.bat or run:
start.bat
```

**Option 2 - Easy start (Mac/Linux):**
```bash
# Run:
./start.sh
```

**Option 3 - Manual:**
```bash
npm run dev
```

**Important**: Open `http://localhost:3000` in your browser, NOT the HTML file directly!

### 5. Deploy to Vercel

1. Connect the repository to [Vercel](https://vercel.com)
2. Add environment variables in Vercel Dashboard
3. Automatic deployment on every push

## 📁 Project Structure

```
meme-website/
├── index.html              # Main frontend
├── package.json            # Node.js dependencies
├── vercel.json             # Vercel configuration
├── supabase-setup.sql      # Database setup script
├── env.example             # Environment variables template
├── api/
│   ├── lib/
│   │   └── supabase.js     # Supabase configuration
│   └── memes/
│       ├── post.js         # Post meme API
│       ├── vote.js         # Vote meme API
│       ├── list.js         # List memes API
│       └── champion.js     # Current champion API
└── README.md               # Documentation
```

## 🎯 API Endpoints

### POST /api/memes/post
Post a new meme.

**Request Body:**
```json
{
  "imageData": "data:image/jpeg;base64,...",
  "captchaAnswer": 7,
  "captchaQuestion": "3 + 4"
}
```

### POST /api/memes/vote
Vote for a meme.

**Request Body:**
```json
{
  "memeId": "uuid-here"
}
```

### GET /api/memes/list
Get list of memes with voting status.

**Query Parameters:**
- `sortBy`: "votes" (default) or "recent"
- `limit`: maximum number of results (default: 50)

### GET /api/memes/champion
Get the meme with the most votes (current champion).

## 🔒 Security

- **Captcha**: Protection against spam
- **Rate limiting**: One vote per day per IP per meme
- **Image validation**: Checks file type and size
- **IP tracking**: Tracks votes based on IP address
- **Row Level Security**: Security policies in Supabase

## 🎨 Design Customization

Main CSS variables are defined in `:root`:

```css
:root {
    --primary-bg: #ffffff;
    --secondary-bg: #f8f8f8;
    --accent-bg: #000000;
    --text-primary: #000000;
    --text-secondary: #666666;
    --border-color: #e0e0e0;
    --hover-bg: #f0f0f0;
    --shadow: rgba(0, 0, 0, 0.05);
}
```

## 📱 Responsive Design

- Main breakpoint: 768px
- Adaptive grid for memes
- Mobile-optimized buttons and navigation
- Reduced animations on low-performance devices

## 🐛 Debugging

### Local development:
```bash
vercel dev --debug
```

### Production logs:
Check logs in Vercel Dashboard > Functions

### Common issues:
1. **Images not loading**: Check Supabase Storage configuration
2. **Voting not working**: Check RLS policies in Supabase
3. **API errors**: Check environment variables

## 📄 License

MIT License - See LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues or questions, please open an issue on GitHub.