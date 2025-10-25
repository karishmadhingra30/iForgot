# Note Categorization Logic

## Overview

This implementation provides a simple, single Claude API call approach to analyze notes and handle categorization automatically.

## Flow

### 1. Note Processing (`POST /api/notes`)

```
User creates note
    ↓
Fetch existing categories
    ↓
Single Claude API call (analyzes themes, sentiment, action items, category)
    ↓
Save note with metadata
    ↓
Handle category assignment (auto or manual)
    ↓
Extract and save action items
```

### 2. Claude API Analysis

The Claude API receives:
- User's existing categories
- Note content

It returns JSON with:
```json
{
  "themes": ["theme1", "theme2"],
  "sentiment": "positive/negative/neutral",
  "action_items": ["task1", "task2"],
  "category": {
    "action": "assign" or "create",
    "name": "Category Name",
    "confidence": 0.85
  }
}
```

### 3. Decision Logic

**High Confidence (>0.8) + Existing Category:**
- Auto-assign to the existing category
- No user confirmation needed

**Low Confidence (≤0.8) or New Category:**
- Return suggestion to frontend
- Frontend shows confirmation modal
- User confirms/rejects category creation

## Files

### Core Logic
- `/lib/claude/client.ts` - Claude API integration
- `/lib/notes/category-handler.ts` - Category decision logic
- `/lib/notes/operations.ts` - Note and task operations
- `/lib/notes/index.ts` - Clean exports

### API Routes
- `/app/api/notes/route.ts` - Main note processing endpoint
- `/app/api/categories/route.ts` - Category creation endpoint

### Types
- `/types/index.ts` - TypeScript definitions

## Usage

### Creating a Note

```typescript
const response = await fetch('/api/notes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    noteContent: "Remember to buy groceries tomorrow",
    userId: "user-123"
  })
})

const result = await response.json()
// {
//   success: true,
//   note: { id: '...', content: '...', themes: [...], sentiment: '...' },
//   analysis: { themes, sentiment, action_items, category },
//   category: {
//     autoAssigned: true/false,
//     requiresConfirmation: true/false,
//     suggestedAction: 'assign'/'create'/'none',
//     suggestedName: 'Shopping',
//     confidence: 0.92
//   }
// }
```

### Confirming Category Creation

If `requiresConfirmation: true`, show a modal and then:

```typescript
const response = await fetch('/api/categories', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    categoryName: "Shopping",
    userId: "user-123",
    noteId: "note-456"  // Optional: assigns to note if provided
  })
})
```

## Helper Functions

### Note Operations
- `createNote(userId, content, aiResult)` - Create note with AI metadata
- `updateNoteCategory(noteId, categoryId)` - Assign category to note
- `createActionItems(noteId, userId, actionItems)` - Create tasks from action items
- `fetchNote(noteId)` - Get note with related data
- `fetchUserNotes(userId, options)` - Get all user notes with filters

### Category Operations
- `fetchUserCategories(userId)` - Get user's categories
- `handleCategoryAssignment(noteId, userId, categoryResult, existingCategories)` - Auto-assign or suggest
- `createAndAssignCategory(noteId, userId, categoryName)` - Create and assign new category

## Database Schema (Supabase)

Already defined in `/database/schema.sql`

**Tables:**
- `users` - User accounts
- `notes` - Notes with themes, sentiment, category_id
- `categories` - User-created categories
- `tasks` - Action items extracted from notes

## Next Steps

1. **Frontend Integration:**
   - Create note input component
   - Add category confirmation modal
   - Display themes and sentiment
   - Show action items as tasks

2. **Supabase Setup:**
   - Run database migrations
   - Set up environment variables
   - Configure Row Level Security (RLS)

3. **Enhancements:**
   - Add note editing
   - Category management UI
   - Task completion tracking
   - Search by themes/sentiment
