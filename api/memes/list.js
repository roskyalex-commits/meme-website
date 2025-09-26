import { supabase, getClientIP } from '../lib/supabase.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const clientIP = getClientIP(req);
    const { sortBy = 'votes', limit = 50 } = req.query;

    // Get memes with vote information
    let query = supabase
      .from('memes')
      .select(`
        id,
        image_url,
        vote_count,
        created_at,
        updated_at
      `);

    // Apply sorting
    if (sortBy === 'recent') {
      query = query.order('created_at', { ascending: false });
    } else {
      query = query.order('vote_count', { ascending: false })
                  .order('created_at', { ascending: false });
    }

    // Apply limit
    if (limit && !isNaN(parseInt(limit))) {
      query = query.limit(parseInt(limit));
    }

    const { data: memes, error: memesError } = await query;

    if (memesError) {
      console.error('Memes fetch error:', memesError);
      return res.status(500).json({ error: 'Error loading memes' });
    }

    if (!memes || memes.length === 0) {
      return res.status(200).json({
        memes: [],
        stats: {
          totalMemes: 0,
          totalVotes: 0,
          todaySubmissions: 0
        },
        userVotes: {}
      });
    }

    // Check if user has voted today (any meme)
    const today = new Date().toISOString().split('T')[0];
    const { data: userVotes, error: votesError } = await supabase
      .from('votes')
      .select('meme_id')
      .eq('ip_address', clientIP)
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`);

    if (votesError) {
      console.error('User votes fetch error:', votesError);
    }

    // Check if user has voted at all today (global rate limit)
    const hasVotedToday = userVotes && userVotes.length > 0;
    
    // Create a map of user votes
    const userVotesMap = {};
    if (userVotes) {
      userVotes.forEach(vote => {
        userVotesMap[vote.meme_id] = true;
      });
    }

    // Calculate statistics
    const totalMemes = memes.length;
    const totalVotes = memes.reduce((sum, meme) => sum + meme.vote_count, 0);
    const todaySubmissions = memes.filter(meme => {
      const memeDate = new Date(meme.created_at).toISOString().split('T')[0];
      return memeDate === today;
    }).length;

    // Add canVote property to each meme (global rate limit: one vote per day total)
    const memesWithVoteStatus = memes.map(meme => ({
      ...meme,
      canVote: !hasVotedToday
    }));

    res.status(200).json({
      memes: memesWithVoteStatus,
      stats: {
        totalMemes,
        totalVotes,
        todaySubmissions
      },
      userVotes: userVotesMap
    });

  } catch (error) {
    console.error('Error in list memes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
