-- Supabase SQL setup for MemeVote
-- Run these commands in your Supabase SQL editor

-- Create memes table
CREATE TABLE IF NOT EXISTS public.memes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    vote_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create votes table for tracking IP-based voting
CREATE TABLE IF NOT EXISTS public.votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meme_id UUID REFERENCES public.memes(id) ON DELETE CASCADE,
    ip_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_memes_created_at ON public.memes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memes_vote_count ON public.memes(vote_count DESC);
CREATE INDEX IF NOT EXISTS idx_votes_ip_date ON public.votes(ip_address, created_at);
CREATE INDEX IF NOT EXISTS idx_votes_meme_ip ON public.votes(meme_id, ip_address);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_memes_updated_at 
    BEFORE UPDATE ON public.memes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.memes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON public.memes
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.votes
    FOR SELECT USING (true);

-- Create policies for service role (API functions)
CREATE POLICY "Enable insert for service role" ON public.memes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for service role" ON public.memes
    FOR UPDATE USING (true);

CREATE POLICY "Enable insert for service role" ON public.votes
    FOR INSERT WITH CHECK (true);

-- Create storage bucket for meme images
INSERT INTO storage.buckets (id, name, public)
VALUES ('memes', 'memes', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for public read access
CREATE POLICY "Public read access" ON storage.objects
    FOR SELECT USING (bucket_id = 'memes');

-- Create storage policy for service role uploads
CREATE POLICY "Service role upload access" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'memes');

-- Create a view for getting memes with today's vote counts
CREATE OR REPLACE VIEW public.memes_with_today_votes AS
SELECT 
    m.id,
    m.image_url,
    m.vote_count,
    m.created_at,
    m.updated_at,
    COALESCE(today_votes.count, 0) as today_vote_count
FROM public.memes m
LEFT JOIN (
    SELECT 
        meme_id, 
        COUNT(*) as count
    FROM public.votes 
    WHERE created_at >= CURRENT_DATE
    GROUP BY meme_id
) today_votes ON m.id = today_votes.meme_id
ORDER BY m.vote_count DESC, m.created_at DESC;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.memes TO anon, authenticated;
GRANT ALL ON public.votes TO anon, authenticated;
GRANT SELECT ON public.memes_with_today_votes TO anon, authenticated;
