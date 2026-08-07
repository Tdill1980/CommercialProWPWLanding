DROP POLICY IF EXISTS "Anon can view leads" ON public.leads_inbox;

REVOKE SELECT ON public.leads_inbox FROM anon;
GRANT INSERT ON public.leads_inbox TO anon;

DROP POLICY IF EXISTS "Anon can insert leads" ON public.leads_inbox;
CREATE POLICY "Anon can insert leads"
ON public.leads_inbox
FOR INSERT
TO anon
WITH CHECK (true);