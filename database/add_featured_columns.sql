-- Add new featured columns to products table
-- Run this SQL on your Render PostgreSQL database

ALTER TABLE "products" 
ADD COLUMN IF NOT EXISTS "showInPremium" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "showInTrending" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "showInCategories" BOOLEAN NOT NULL DEFAULT false;

-- Verify the columns were added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('showInPremium', 'showInTrending', 'showInCategories');

