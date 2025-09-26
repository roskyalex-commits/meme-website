import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Helper function to get client IP
export function getClientIP(req) {
  return req.headers['x-forwarded-for'] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress ||
         (req.connection?.socket ? req.connection.socket.remoteAddress : null) ||
         '127.0.0.1';
}

// Helper function to check if IP has voted today (any meme)
export async function hasVotedToday(ip, memeId = null) {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('votes')
    .select('id')
    .eq('ip_address', ip)
    .gte('created_at', `${today}T00:00:00.000Z`)
    .lt('created_at', `${today}T23:59:59.999Z`)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return !!data;
}

// Helper function to validate image data
export function validateImageData(imageData) {
  if (!imageData || typeof imageData !== 'string') {
    return { valid: false, error: 'Image data is missing or invalid' };
  }

  if (!imageData.startsWith('data:image/')) {
    return { valid: false, error: 'Invalid image format' };
  }

  // Check file size (base64 is ~1.37x larger than original)
  const sizeInBytes = (imageData.length * 3) / 4;
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (sizeInBytes > maxSize) {
    return { valid: false, error: 'Image is too large (max 5MB)' };
  }

  return { valid: true };
}
