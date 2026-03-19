# Supabase Quick Start Guide

Get your HTML Playground database up and running in 5 minutes.

## Step 1: Create Supabase Project (2 minutes)

1. Go to https://supabase.com
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Name:** html-playground (or your preferred name)
   - **Database Password:** (generate a strong password)
   - **Region:** (choose closest to your users)
5. Click "Create new project"
6. Wait for project to finish setting up (~2 minutes)

## Step 2: Run Database Migration (1 minute)

1. In your Supabase project dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Copy the entire contents of `migrations/001_create_snippets_table.sql`
4. Paste into the SQL Editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see: "Success. No rows returned"

## Step 3: Verify Setup (1 minute)

1. In the SQL Editor, click **"New Query"**
2. Copy the entire contents of `verify-setup.sql`
3. Paste into the SQL Editor
4. Click **"Run"**
5. Check the output - you should see multiple ✓ marks indicating success

## Step 4: Get API Credentials (1 minute)

1. Click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** in the settings menu
3. Copy these two values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

## Step 5: Configure Environment Variables (30 seconds)

1. In your project root, create or edit `.env.local`
2. Add these lines (replace with your actual values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file

## Done! 🎉

Your Supabase database is now ready. You can proceed to Task 3 in the implementation plan.

## Quick Test

To verify everything works, run this SQL query in the SQL Editor:

```sql
-- Insert a test snippet
INSERT INTO snippets (html, css, javascript, mode)
VALUES ('<h1>Hello World</h1>', 'h1 { color: blue; }', 'console.log("test");', 'multi')
RETURNING *;

-- Retrieve it
SELECT * FROM snippets ORDER BY created_at DESC LIMIT 1;
```

You should see your test snippet returned with a UUID and timestamp.

## What You Just Created

✅ **snippets table** - Stores HTML, CSS, and JavaScript code
✅ **Size constraint** - Prevents snippets larger than 500KB
✅ **RLS policies** - Allows public read and insert, no updates/deletes
✅ **Index** - Fast queries on created_at column

## Next Steps

1. ✅ Task 2.1: Create Supabase table with schema - **COMPLETE**
2. ✅ Task 2.2: Configure Row Level Security policies - **COMPLETE**
3. ➡️ Task 3: Configure environment variables and Supabase client
4. ➡️ Task 4: Create TypeScript types and interfaces

## Troubleshooting

### "relation already exists" error
The table was already created. You can either:
- Drop it: `DROP TABLE snippets CASCADE;` then re-run the migration
- Or skip this step if the schema matches

### Can't find API credentials
Go to: Settings (gear icon) → API → Copy "Project URL" and "anon public" key

### Environment variables not working
- Ensure `.env.local` is in your project root (same level as `package.json`)
- Restart your Next.js dev server after adding environment variables
- Check for typos in variable names (must be exact)

## Need Help?

- 📖 [Supabase Documentation](https://supabase.com/docs)
- 📖 [Full Setup Guide](./README.md)
- 📖 [RLS Policies Explained](./RLS_POLICIES.md)
- 📋 [Detailed Checklist](./SETUP_CHECKLIST.md)
