# iForgot Setup Guide

## Quick Setup Checklist

Follow these steps to get your local development environment running:

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `ANTHROPIC_API_KEY` - Your Claude API key
- `DEEPGRAM_API_KEY` or `OPENAI_API_KEY` - For voice transcription

### 3. Set Up Supabase Database

This is the **most critical step** - missing this will cause the save functionality to fail!

#### Step 3.1: Run the Schema
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `database/schema.sql`
4. Paste into the SQL Editor
5. Click **Run**

#### Step 3.2: Create the Test User (REQUIRED!)
1. Stay in the **SQL Editor**
2. Copy the contents of `database/test-user-setup.sql`
3. Paste into the SQL Editor
4. Click **Run**

**⚠️ IMPORTANT**: Without running `test-user-setup.sql`, you will get this error:
```
error: insert or update on table "notes" violates foreign key constraint "notes_user_id_fkey"
```

#### Step 3.3: Verify Test User Created
Run this query in the SQL Editor to verify:
```sql
SELECT id, email, created_at
FROM auth.users
WHERE id = '00000000-0000-0000-0000-000000000001';
```

You should see one row returned with email `demo@test.com`.

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Test the Application

#### Basic Test Page
Visit [http://localhost:3000/basic-test](http://localhost:3000/basic-test) to test basic note saving without AI features.

#### Main Application
Visit [http://localhost:3000](http://localhost:3000) to use the full app with AI categorization.

## Troubleshooting

### "Save functionality doesn't work"

**Symptom**: Clicking "Save" does nothing or shows an error about foreign key constraints.

**Cause**: The test user doesn't exist in your database.

**Solution**: Run `database/test-user-setup.sql` in your Supabase SQL Editor (see Step 3.2 above).

### "Cannot connect to Supabase"

**Cause**: Missing or incorrect environment variables.

**Solution**:
1. Check that `.env.local` exists
2. Verify your Supabase URL and key are correct
3. Restart the dev server after changing `.env.local`

### "AI categorization fails"

**Cause**: Missing or invalid Anthropic API key.

**Solution**:
1. Get an API key from [Anthropic Console](https://console.anthropic.com/)
2. Add it to `.env.local` as `ANTHROPIC_API_KEY`
3. Restart the dev server

## Understanding the Test User

For MVP development, the app uses a hardcoded test user UUID:
```
00000000-0000-0000-0000-000000000001
```

This bypasses authentication to speed up development. The test user **must exist** in the `auth.users` table because:
- The `notes` table has a foreign key to `auth.users(id)`
- The `categories` table has a foreign key to `auth.users(id)`
- The `tasks` table has a foreign key to `auth.users(id)`

Without this user, all insert operations will fail.

### Production Note

**⚠️ DO NOT** use the test user setup in production! For production:
1. Remove hardcoded UUIDs from the code
2. Implement proper Supabase authentication
3. Enable Row Level Security (RLS) policies

See `database/README.md` for more details.

## Getting Help

If you encounter issues:
1. Check the browser console for errors
2. Check the terminal for server errors
3. Verify all environment variables are set
4. Confirm the test user exists in Supabase
5. Review `database/README.md` for database-specific issues
