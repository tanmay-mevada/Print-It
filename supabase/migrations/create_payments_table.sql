-- Create payments tracking table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  txnid TEXT UNIQUE NOT NULL,
  upload_id UUID NOT NULL REFERENCES uploads(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, success, failed
  payment_method TEXT DEFAULT 'payu', -- payu, upi_manual, etc
  payment_gateway_response JSONB, -- Store raw response from PayU
  created_at TIMESTAMP DEFAULT NOW(),
  verified_at TIMESTAMP,
  
  CONSTRAINT valid_status CHECK (status IN ('pending', 'success', 'failed'))
);

-- Create index on upload_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_upload_id ON payments(upload_id);
CREATE INDEX IF NOT EXISTS idx_payments_txnid ON payments(txnid);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Create index on created_at for recent payments queries
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);
