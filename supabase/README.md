# Supabase Database Setup

This directory contains the database schema and migration files for the HTML Playground application.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- A Supabase project created

## Setup Instructions

### Option 1: Using Supabase Dashboard (Recommended for Quick Setup)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor (left sidebar)
3. Click "New Query"
4. Copy the contents of `migrations/001_create_snippets_table.sql`
5. Paste into the SQL Editor
6. Click "Run" to execute the migration

### Option 2: Using Supabase CLI

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. Run the migration:
   ```bash
   supabase db push
   ```

## Database Schema

### Table: `snippets`

Stores code snippets with HTML, CSS, and JavaScript content.

| Column       | Type         | Description                                    |
|--------------|--------------|------------------------------------------------|
| id           | UUID         | Primary key, auto-generated                    |
| html         | TEXT         | HTML content (required)                        |
| css          | TEXT         | CSS content (defaults to empty string)         |
| javascript   | TEXT         | JavaScript content (defaults to empty string)  |
| mode         | VARCHAR(10)  | Editor mode: 'single' or 'multi'               |
| created_at   | TIMESTAMPTZ  | Timestamp of creation (auto-generated)         |

### Constraints

- **payload_size_check**: Total size of html + css + javascript must be ≤ 512,000 bytes (500KB)
- **mode check**: Mode must be either 'single' or 'multi'

### Indexes

- **idx_snippets_created_at**: Index on created_at column for efficient queries

### Row Level Security (RLS)

RLS is enabled with the following policies:

- **Allow public read access**: Anyone can SELECT snippets (no authentication required)
- **Allow public insert access**: Anyone can INSERT snippets (no authentication required)
- **No UPDATE or DELETE policies**: Snippets are immutable once created

## Verification

After running the migration, verify the setup:

1. Check that the table exists:
   ```sql
   SELECT * FROM information_schema.tables WHERE table_name = 'snippets';
   ```

2. Verify RLS is enabled:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'snippets';
   ```

3. Check policies:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'snippets';
   ```

4. Test insert (should succeed):
   ```sql
   INSERT INTO snippets (html, css, javascript, mode)
   VALUES ('<h1>Test</h1>', 'body { margin: 0; }', 'console.log("test");', 'multi');
   ```

5. Test size constraint (should fail):
   ```sql
   INSERT INTO snippets (html, css, javascript, mode)
   VALUES (repeat('x', 600000), '', '', 'single');
   ```

## Environment Variables

After setting up the database, add these environment variables to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under "API".

## Troubleshooting

### Migration fails with "relation already exists"

The table may already exist. You can either:
- Drop the existing table: `DROP TABLE IF EXISTS snippets CASCADE;`
- Or skip this migration if the schema matches

### RLS policies not working

Ensure RLS is enabled:
```sql
ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;
```

### Size constraint not enforced

The constraint uses `octet_length()` which measures bytes, not characters. Multi-byte characters (UTF-8) will count as multiple bytes.
