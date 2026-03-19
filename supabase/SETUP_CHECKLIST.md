# Supabase Setup Checklist

Use this checklist to ensure your Supabase database is properly configured for the HTML Playground application.

## Task 2.1: Create Supabase Table with Schema

- [ ] **Create snippets table** with the following columns:
  - [ ] `id` (UUID, PRIMARY KEY, auto-generated with `gen_random_uuid()`)
  - [ ] `html` (TEXT, NOT NULL)
  - [ ] `css` (TEXT, NOT NULL, DEFAULT '')
  - [ ] `javascript` (TEXT, NOT NULL, DEFAULT '')
  - [ ] `mode` (VARCHAR(10), NOT NULL, CHECK constraint for 'single' or 'multi')
  - [ ] `created_at` (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())

- [ ] **Add payload_size_check constraint**
  - [ ] Constraint ensures: `octet_length(html) + octet_length(css) + octet_length(javascript) <= 512000`
  - [ ] This enforces a 500KB (512,000 bytes) maximum payload size

- [ ] **Create index on created_at column**
  - [ ] Index name: `idx_snippets_created_at`
  - [ ] Index type: DESC (for efficient recent snippet queries)

**Requirements Validated:** 4.1, 4.2, 4.3, 4.4

## Task 2.2: Configure Row Level Security Policies

- [ ] **Enable RLS on snippets table**
  - [ ] Run: `ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;`

- [ ] **Create policy for public SELECT access**
  - [ ] Policy name: "Allow public read access"
  - [ ] Operation: SELECT
  - [ ] Rule: `USING (true)`

- [ ] **Create policy for public INSERT access**
  - [ ] Policy name: "Allow public insert access"
  - [ ] Operation: INSERT
  - [ ] Rule: `WITH CHECK (true)`

- [ ] **Verify no UPDATE or DELETE policies exist**
  - [ ] Confirm no UPDATE policy is defined
  - [ ] Confirm no DELETE policy is defined
  - [ ] This ensures snippets are immutable

**Requirements Validated:** 5.6

## Quick Setup Steps

1. **Navigate to Supabase Dashboard**
   - Go to https://supabase.com
   - Open your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run Migration**
   - Copy contents of `migrations/001_create_snippets_table.sql`
   - Paste into SQL Editor
   - Click "Run"

4. **Verify Setup**
   - Copy contents of `verify-setup.sql`
   - Paste into SQL Editor
   - Click "Run"
   - Check output for all ✓ marks

5. **Update Environment Variables**
   - Copy your Supabase URL and anon key from project settings
   - Add to `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_url_here
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
     ```

## Verification Commands

After setup, run these SQL commands to verify:

```sql
-- Check table exists
SELECT tablename FROM pg_tables WHERE tablename = 'snippets';

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'snippets';

-- List policies
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'snippets';

-- Test insert
INSERT INTO snippets (html, css, javascript, mode)
VALUES ('<h1>Test</h1>', '', '', 'single')
RETURNING id;

-- Test size constraint (should fail)
INSERT INTO snippets (html, css, javascript, mode)
VALUES (repeat('x', 600000), '', '', 'single');
```

## Troubleshooting

### Issue: "relation already exists"
**Solution:** Table already created. Either drop it first or skip migration.

### Issue: RLS policies not working
**Solution:** Ensure RLS is enabled with `ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;`

### Issue: Size constraint not enforced
**Solution:** Verify constraint exists with:
```sql
SELECT constraint_name FROM information_schema.table_constraints 
WHERE table_name = 'snippets' AND constraint_type = 'CHECK';
```

### Issue: Can update/delete snippets
**Solution:** Verify no UPDATE/DELETE policies exist:
```sql
SELECT * FROM pg_policies WHERE tablename = 'snippets' AND cmd IN ('UPDATE', 'DELETE');
```
Should return 0 rows.

## Next Steps

After completing this setup:

1. ✅ Task 2.1 and 2.2 are complete
2. ➡️ Proceed to Task 3: Configure environment variables and Supabase client
3. ➡️ Create `lib/supabase/client.ts` with Supabase client configuration

## Files Created

- `migrations/001_create_snippets_table.sql` - Main migration file
- `verify-setup.sql` - Verification script
- `RLS_POLICIES.md` - Detailed RLS documentation
- `README.md` - Setup instructions
- `SETUP_CHECKLIST.md` - This file
