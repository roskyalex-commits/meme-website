import { supabase, getClientIP, validateImageData } from '../lib/supabase.js';

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
    const { imageData, captchaAnswer, captchaQuestion } = req.body;

    // Validate captcha
    if (!captchaAnswer || !captchaQuestion) {
      return res.status(400).json({ error: 'Captcha is missing' });
    }

    // Simple captcha validation (you might want to make this more secure)
    const [num1, operator, num2] = captchaQuestion.split(' ');
    const expectedAnswer = parseInt(num1) + parseInt(num2);
    
    if (parseInt(captchaAnswer) !== expectedAnswer) {
      return res.status(400).json({ error: 'Incorrect captcha' });
    }

    // Validate image data
    const imageValidation = validateImageData(imageData);
    if (!imageValidation.valid) {
      return res.status(400).json({ error: imageValidation.error });
    }

    // Extract image type and data
    const matches = imageData.match(/^data:image\/([a-zA-Z]*);base64,(.*)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid image format' });
    }

    const imageType = matches[1];
    const imageBuffer = Buffer.from(matches[2], 'base64');
    const fileName = `meme_${Date.now()}.${imageType}`;

    // Upload image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('memes')
      .upload(fileName, imageBuffer, {
        contentType: `image/${imageType}`,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return res.status(500).json({ error: 'Error uploading image' });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('memes')
      .getPublicUrl(fileName);

    if (!urlData?.publicUrl) {
      return res.status(500).json({ error: 'Error generating public URL' });
    }

    // Save meme to database
    const { data: memeData, error: dbError } = await supabase
      .from('memes')
      .insert([
        {
          image_url: urlData.publicUrl,
          vote_count: 0
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Try to cleanup uploaded file
      await supabase.storage.from('memes').remove([fileName]);
      return res.status(500).json({ error: 'Error saving to database' });
    }

    res.status(201).json({
      success: true,
      message: 'Meme posted successfully!',
      meme: {
        id: memeData.id,
        image_url: memeData.image_url,
        vote_count: memeData.vote_count,
        created_at: memeData.created_at
      }
    });

  } catch (error) {
    console.error('Error in post meme:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
