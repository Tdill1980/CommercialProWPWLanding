-- Create leads_inbox table to store all incoming leads from phone + chat
CREATE TABLE public.leads_inbox (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL CHECK (source IN ('phone', 'chat', 'web')),
  external_id TEXT,
  intent TEXT NOT NULL CHECK (intent IN ('quote_request', 'reorder', 'pricing_question', 'info_only', 'unknown')),
  confidence NUMERIC DEFAULT 0,
  caller_name TEXT,
  caller_phone TEXT,
  caller_email TEXT,
  caller_company TEXT,
  summary TEXT,
  raw JSONB,
  next_action TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'followup_sent', 'human_review', 'converted', 'closed')),
  followup_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads_inbox ENABLE ROW LEVEL SECURITY;

-- Create policy for service role to insert (edge functions)
CREATE POLICY "Service role can insert leads"
ON public.leads_inbox
FOR INSERT
TO service_role
WITH CHECK (true);

-- Create policy for service role to select
CREATE POLICY "Service role can select leads"
ON public.leads_inbox
FOR SELECT
TO service_role
USING (true);

-- Create policy for service role to update
CREATE POLICY "Service role can update leads"
ON public.leads_inbox
FOR UPDATE
TO service_role
USING (true);

-- Create policy for anon to select (for Command Center - public for now, can restrict later)
CREATE POLICY "Anon can view leads"
ON public.leads_inbox
FOR SELECT
TO anon
USING (true);

-- Create index for common queries
CREATE INDEX idx_leads_inbox_source ON public.leads_inbox(source);
CREATE INDEX idx_leads_inbox_status ON public.leads_inbox(status);
CREATE INDEX idx_leads_inbox_created_at ON public.leads_inbox(created_at DESC);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_leads_inbox_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_leads_inbox_updated_at
BEFORE UPDATE ON public.leads_inbox
FOR EACH ROW
EXECUTE FUNCTION public.update_leads_inbox_updated_at();