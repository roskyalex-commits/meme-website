import { supabase, getClientIP, hasVotedToday } from '../lib/supabase.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { memeId } = req.body;
    const clientIP = getClientIP(req);

    if (!memeId) {
      return res.status(400).json({ error: 'Meme ID is missing' });
    }

    // Check if meme exists
    const { data: memeData, error: memeError } = await supabase
      .from('memes')
      .select('id, vote_count')
      .eq('id', memeId)
      .single();

    if (memeError || !memeData) {
      return res.status(404).json({ error: 'Meme not found' });
    }

    // Check if IP has already voted today (any meme)
    const alreadyVoted = await hasVotedToday(clientIP);
    
    if (alreadyVoted) {
      return res.status(400).json({ 
        error: 'You can only vote once per day. Come back tomorrow!',
        canVote: false
      });
    }

    // Start transaction-like operations
    // First, record the vote
    const { error: voteError } = await supabase
      .from('votes')
      .insert([
        {
          meme_id: memeId,
          ip_address: clientIP
        }
      ]);

    if (voteError) {
      console.error('Vote insert error:', voteError);
      return res.status(500).json({ error: 'Error recording vote' });
    }

    // Then, increment the vote count
    const { data: updatedMeme, error: updateError } = await supabase
      .from('memes')
      .update({ 
        vote_count: memeData.vote_count + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', memeId)
      .select()
      .single();

    if (updateError) {
      console.error('Vote count update error:', updateError);
      // Try to rollback the vote insert
      await supabase
        .from('votes')
        .delete()
        .eq('meme_id', memeId)
        .eq('ip_address', clientIP)
        .gte('created_at', new Date().toISOString().split('T')[0]);
      
      return res.status(500).json({ error: 'Error updating vote count' });
    }

    res.status(200).json({
      success: true,
      message: 'Vote recorded successfully!',
      meme: {
        id: updatedMeme.id,
        vote_count: updatedMeme.vote_count
      },
      canVote: false
    });

  } catch (error) {
    console.error('Error in vote meme:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
