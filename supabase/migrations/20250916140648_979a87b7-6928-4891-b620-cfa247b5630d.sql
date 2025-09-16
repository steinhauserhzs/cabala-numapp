-- Create table for numerology contents
CREATE TABLE public.conteudos_numerologia (
  id BIGSERIAL PRIMARY KEY,
  topico TEXT NOT NULL,
  conteudo JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.conteudos_numerologia ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (since these are reference data)
CREATE POLICY "Allow public read access to numerology contents"
ON public.conteudos_numerologia
FOR SELECT
USING (true);

-- Create index for better performance on topico queries
CREATE INDEX idx_conteudos_numerologia_topico ON public.conteudos_numerologia(topico);