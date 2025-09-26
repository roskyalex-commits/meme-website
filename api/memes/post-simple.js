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

  console.log('Simple post endpoint called');
  console.log('Request body keys:', Object.keys(req.body || {}));

  try {
    const { imageData, captchaAnswer, captchaQuestion } = req.body || {};

    // Basic validation
    if (!captchaAnswer || !captchaQuestion) {
      return res.status(400).json({ error: 'Captcha is missing' });
    }

    if (!imageData) {
      return res.status(400).json({ error: 'Image data is missing' });
    }

    // Simple captcha validation
    const [num1, operator, num2] = captchaQuestion.split(' ');
    const expectedAnswer = parseInt(num1) + parseInt(num2);
    
    if (parseInt(captchaAnswer) !== expectedAnswer) {
      return res.status(400).json({ error: 'Incorrect captcha' });
    }

    // Mock success response (without actually saving to database)
    res.status(201).json({
      success: true,
      message: 'Meme posted successfully! (Test mode - not actually saved)',
      meme: {
        id: 'test-' + Date.now(),
        image_url: 'test-url',
        vote_count: 0,
        created_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in simple post meme:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
