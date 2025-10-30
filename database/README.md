# Database Setup

This folder contains the database schema and setup scripts for the iForgot application.

## Files

- **schema.sql** - Complete Supabase PostgreSQL database schema
- **test-user-setup.sql** - Test user setup for local development

## Local Development Setup

### Initial Setup

1. Create a new Supabase project (or use your local instance)
2. Run the main schema:
   - Go to Supabase Dashboard → SQL Editor
   - Copy and paste the contents of `schema.sql`
   - Click "Run"

3. Set up the test user:
   - Copy and paste the contents of `test-user-setup.sql`
   - Click "Run"

### Why do I need test-user-setup.sql?

The application uses a hardcoded test UUID (`00000000-0000-0000-0000-000000000001`) for MVP/testing purposes. This user must exist in the `auth.users` table to satisfy foreign key constraints on tables like `notes`, `categories`, and `tasks`.

**Without running test-user-setup.sql**, you'll get this error:
```
error: insert or update on table "notes" violates foreign key constraint "notes_user_id_fkey"
```

### Alternative: Using Supabase CLI

If you're using Supabase CLI for local development:

```bash
# Start Supabase locally
supabase start

# Apply schema
supabase db reset

# Run test user setup
psql postgresql://postgres:postgres@localhost:54322/postgres -f database/test-user-setup.sql
```

## Important Notes

- **⚠️ WARNING**: The test-user-setup.sql script is ONLY for development/testing
- **DO NOT** run test-user-setup.sql in production
- For production, implement proper Supabase authentication
- The test user email is `demo@test.com` with a dummy password

## Future: Production Authentication

For production deployment, replace the hardcoded UUID with proper Supabase Auth:

1. Remove hardcoded UUIDs from:
   - `/app/page.tsx`
   - `/app/api/simple-note/route.ts`

2. Implement Supabase Auth:
   ```typescript
   const { data: { user } } = await supabase.auth.getUser()
   const userId = user?.id
   ```

3. Enable Row Level Security (RLS) policies (currently disabled in schema.sql)
