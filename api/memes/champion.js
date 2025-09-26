import { supabase } from '../lib/supabase.js';

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
    // Get the meme with the highest vote count
    const { data: championMeme, error: championError } = await supabase
      .from('memes')
      .select(`
        id,
        image_url,
        vote_count,
        created_at,
        updated_at
      `)
      .gt('vote_count', 0)
      .order('vote_count', { ascending: false })
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (championError && championError.code !== 'PGRST116') {
      console.error('Champion fetch error:', championError);
      return res.status(500).json({ error: 'Error loading champion' });
    }

    if (!championMeme) {
      return res.status(200).json({
        champion: null,
        message: 'No champion yet'
      });
    }

    res.status(200).json({
      champion: championMeme,
      message: `Current champion with ${championMeme.vote_count} votes!`
    });

  } catch (error) {
    console.error('Error in get champion:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
