-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_access TIMESTAMP WITH TIME ZONE,
  professional_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create client_maps table
CREATE TABLE public.client_maps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  map_data JSONB NOT NULL,
  map_type TEXT NOT NULL DEFAULT 'pessoal',
  birth_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active'
);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_maps ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clients table
CREATE POLICY "Professionals can manage their own clients" 
ON public.clients 
FOR ALL 
USING (auth.uid() = professional_id)
WITH CHECK (auth.uid() = professional_id);

-- RLS Policies for client_maps table  
CREATE POLICY "Professionals can manage their own client maps" 
ON public.client_maps 
FOR ALL 
USING (auth.uid() = professional_id)
WITH CHECK (auth.uid() = professional_id);

-- Public access for clients to view their own data
CREATE POLICY "Clients can view their own data" 
ON public.clients 
FOR SELECT 
USING (true);

CREATE POLICY "Clients can view their own maps" 
ON public.client_maps 
FOR SELECT 
USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_maps_updated_at
  BEFORE UPDATE ON public.client_maps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate client slug
CREATE OR REPLACE FUNCTION public.generate_client_slug(client_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Generate base slug from name
    base_slug := lower(
        regexp_replace(
            unaccent(trim(client_name)), 
            '[^a-z0-9\s]', '', 'g'
        )
    );
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
    base_slug := trim(base_slug, '-');
    
    final_slug := base_slug;
    
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM public.clients WHERE slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$;