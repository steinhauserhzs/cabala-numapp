-- First, let's remove duplicates keeping the most recent one for each topic
WITH duplicates AS (
  SELECT id, topico, 
         ROW_NUMBER() OVER (PARTITION BY topico ORDER BY created_at DESC) as rn
  FROM conteudos_numerologia
)
DELETE FROM conteudos_numerologia 
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- Now add unique constraint to prevent future duplicates
ALTER TABLE conteudos_numerologia 
ADD CONSTRAINT conteudos_numerologia_topico_unique UNIQUE (topico);

-- Add index for better performance on topic searches
CREATE INDEX IF NOT EXISTS idx_conteudos_numerologia_topico 
ON conteudos_numerologia(topico);