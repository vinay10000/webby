-- Create snippets table for HTML Playground
-- This migration creates the core table for storing code snippets with size constraints

CREATE TABLE snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  html TEXT NOT NULL,
  css TEXT NOT NULL DEFAULT '',
  javascript TEXT NOT NULL DEFAULT '',
  mode VARCHAR(10) NOT NULL CHECK (mode IN ('single', 'multi')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Enforce 500KB (512000 bytes) maximum payload size
  CONSTRAINT payload_size_check CHECK (
    octet_length(html) + octet_length(css) + octet_length(javascript) <= 512000
  )
);

-- Create index on created_at for efficient queries
CREATE INDEX idx_snippets_created_at ON snippets(created_at DESC);

-- Enable Row Level Security
ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anyone can view snippets)
CREATE POLICY "Allow public read access"
  ON snippets FOR SELECT
  USING (true);

-- Allow public insert access (anyone can create snippets)
CREATE POLICY "Allow public insert access"
  ON snippets FOR INSERT
  WITH CHECK (true);

-- No UPDATE or DELETE policies - snippets are immutable once created
