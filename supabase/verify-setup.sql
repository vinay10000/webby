-- Verification script for Supabase database setup
-- Run this script to verify that the snippets table and RLS policies are correctly configured

-- 1. Check if snippets table exists
SELECT 
  'Table exists: ' || CASE WHEN EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'snippets'
  ) THEN 'YES ✓' ELSE 'NO ✗' END AS table_check;

-- 2. Verify table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_name = 'snippets'
ORDER BY ordinal_position;

-- 3. Check constraints
SELECT 
  constraint_name, 
  constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'snippets';

-- 4. Verify RLS is enabled
SELECT 
  tablename,
  'RLS enabled: ' || CASE WHEN rowsecurity THEN 'YES ✓' ELSE 'NO ✗' END AS rls_status
FROM pg_tables 
WHERE tablename = 'snippets';

-- 5. List all policies
SELECT 
  policyname,
  cmd AS command,
  qual AS using_expression,
  with_check AS with_check_expression
FROM pg_policies 
WHERE tablename = 'snippets';

-- 6. Verify index exists
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'snippets';

-- 7. Test insert (should succeed)
DO $$
BEGIN
  INSERT INTO snippets (html, css, javascript, mode)
  VALUES ('<h1>Verification Test</h1>', 'body { margin: 0; }', 'console.log("test");', 'multi');
  
  RAISE NOTICE 'Insert test: SUCCESS ✓';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Insert test: FAILED ✗ - %', SQLERRM;
END $$;

-- 8. Test size constraint (should fail)
DO $$
BEGIN
  INSERT INTO snippets (html, css, javascript, mode)
  VALUES (repeat('x', 600000), '', '', 'single');
  
  RAISE NOTICE 'Size constraint test: FAILED ✗ (constraint not enforced)';
EXCEPTION
  WHEN check_violation THEN
    RAISE NOTICE 'Size constraint test: SUCCESS ✓ (constraint properly enforced)';
  WHEN OTHERS THEN
    RAISE NOTICE 'Size constraint test: UNEXPECTED ERROR - %', SQLERRM;
END $$;

-- 9. Test mode constraint (should fail)
DO $$
BEGIN
  INSERT INTO snippets (html, css, javascript, mode)
  VALUES ('<h1>Test</h1>', '', '', 'invalid');
  
  RAISE NOTICE 'Mode constraint test: FAILED ✗ (constraint not enforced)';
EXCEPTION
  WHEN check_violation THEN
    RAISE NOTICE 'Mode constraint test: SUCCESS ✓ (constraint properly enforced)';
  WHEN OTHERS THEN
    RAISE NOTICE 'Mode constraint test: UNEXPECTED ERROR - %', SQLERRM;
END $$;

-- 10. Count snippets
SELECT 
  'Total snippets: ' || COUNT(*) AS snippet_count
FROM snippets;

-- Clean up test data
DELETE FROM snippets WHERE html = '<h1>Verification Test</h1>';
