-- Adicionar políticas RLS para permitir que administradores gerenciem conteúdos
CREATE POLICY "Admins can insert content" 
ON public.conteudos_numerologia 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update content" 
ON public.conteudos_numerologia 
FOR UPDATE 
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete content" 
ON public.conteudos_numerologia 
FOR DELETE 
USING (public.is_admin(auth.uid()));