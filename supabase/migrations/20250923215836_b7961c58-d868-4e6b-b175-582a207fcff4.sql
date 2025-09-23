-- Add sharing functionality to numerology_maps table
ALTER TABLE public.numerology_maps 
ADD COLUMN slug TEXT UNIQUE,
ADD COLUMN share_token TEXT UNIQUE,
ADD COLUMN visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'public', 'shared_link')),
ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE;

-- Create index for performance
CREATE INDEX idx_numerology_maps_slug ON public.numerology_maps(slug);
CREATE INDEX idx_numerology_maps_share_token ON public.numerology_maps(share_token);

-- Create RLS policies for public access
CREATE POLICY "Allow public read access to public maps" 
ON public.numerology_maps 
FOR SELECT 
USING (visibility = 'public');

CREATE POLICY "Allow access to shared maps with token" 
ON public.numerology_maps 
FOR SELECT 
USING (visibility = 'shared_link');

-- Function to generate unique slug
CREATE OR REPLACE FUNCTION public.generate_unique_slug(base_slug TEXT)
RETURNS TEXT AS $$
DECLARE
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    final_slug := base_slug;
    
    WHILE EXISTS (SELECT 1 FROM public.numerology_maps WHERE slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;