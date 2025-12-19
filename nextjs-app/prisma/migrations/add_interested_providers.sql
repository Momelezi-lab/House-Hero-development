-- Migration: Add interested_providers column to service_requests table
-- This column stores a JSON array of providers who have shown interest in a service request

ALTER TABLE service_requests 
ADD COLUMN IF NOT EXISTS interested_providers TEXT;

-- Add comment to document the column
COMMENT ON COLUMN service_requests.interested_providers IS 'JSON array: [{providerId, providerName, acceptedAt, rating}]';

