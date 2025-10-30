# Basic Test - Supabase Integration

This is a back-to-basics test for the iForgot application. It focuses on the core functionality of typing a note and saving it to Supabase, without any AI processing.

## What This Test Does

1. **Type a Note**: Simple textarea where you can type your note content
2. **Save to Supabase**: Directly saves the note to the `notes` table in Supabase
3. **Display Notes**: Shows all saved notes in a list below the input area
4. **No AI Processing**: Bypasses all Claude AI functionality for testing purposes

## File Structure

```
app/
├── basic-test/
│   ├── page.tsx                   # Main UI page
│   └── layout.tsx                 # Basic layout wrapper
└── api/
    └── simple-note/
        └── route.ts               # API endpoint for saving/fetching notes
```

**Note:** This follows Next.js App Router conventions where routes are defined by folders inside the `app/` directory.

## API Routes

### GET `/api/simple-note`
Fetches all notes for the dummy user from Supabase.

**Response:**
```json
{
  "success": true,
  "notes": [
    {
      "id": "uuid",
      "content": "note content",
      "created_at": "timestamp"
    }
  ]
}
```

### POST `/api/simple-note`
Saves a new note to Supabase.

**Request:**
```json
{
  "content": "Your note content here"
}
```

**Response:**
```json
{
  "success": true,
  "note": {
    "id": "uuid",
    "content": "note content",
    "created_at": "timestamp"
  }
}
```

## Environment Variables Required

Make sure these are set in your Vercel deployment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Accessing the Test

Once deployed on Vercel, navigate to:
```
https://your-app.vercel.app/basic-test
```

Or locally:
```
http://localhost:3000/basic-test
```

## Database Requirements

This test uses the existing `notes` table from the main schema. It requires:
- The `notes` table to exist in Supabase
- Row Level Security (RLS) to be disabled (already done for demo purposes)
- A dummy user ID: `00000000-0000-0000-0000-000000000001`

## Next Steps

Once this basic test works, you can build on top of it by:
1. Adding AI categorization
2. Adding task extraction
3. Adding rich text editing
4. Adding user authentication
