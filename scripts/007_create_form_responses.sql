-- Create form_responses table to store custom form submissions
CREATE TABLE IF NOT EXISTS form_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  response_data JSONB NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_form_responses_event_id ON form_responses(event_id);
CREATE INDEX IF NOT EXISTS idx_form_responses_user_id ON form_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_form_responses_submitted_at ON form_responses(submitted_at);

-- Enable RLS
ALTER TABLE form_responses ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can submit a form response
CREATE POLICY "Anyone can submit form responses"
  ON form_responses
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Policy: Event organizers can view responses for their events
CREATE POLICY "Organizers can view their event responses"
  ON form_responses
  FOR SELECT
  TO authenticated
  USING (
    event_id IN (
      SELECT id FROM events WHERE organizer_id = auth.uid()
    )
  );

-- Policy: Users can view their own responses
CREATE POLICY "Users can view their own responses"
  ON form_responses
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Add comment
COMMENT ON TABLE form_responses IS 'Stores custom form responses for events';
