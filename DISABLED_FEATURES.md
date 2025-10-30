# ⚠️ Temporarily Disabled Features ⚠️

---

## 🚨 ATTENTION: FOR ALL CLAUDE SESSIONS 🚨

**READ THIS BEFORE MAKING ANY CHANGES TO THIS CODEBASE**

### AI Features Are INTENTIONALLY DISABLED

This is **NOT** a bug or mistake. This is a **deliberate decision** to stabilize core functionality first.

**DO NOT:**
- ❌ Re-enable AI features without explicit user request
- ❌ Rename `client.DISABLED.ts` to `client.ts`
- ❌ Uncomment AI code in route handlers
- ❌ Try to "fix" disabled features
- ❌ Integrate AI-powered functionality

**If you're unsure, see README_FIRST.md**

---

**Status:** AI features are currently DISABLED to focus on core note-taking functionality.

## Why Features Are Disabled

We're following a phased approach:
1. **Phase 1 (Current):** Get basic note saving/loading working reliably
2. **Phase 2 (Next):** Re-enable AI features one by one after core works

## Currently Disabled Features

### ❌ AI Processing (Claude API)
- **File:** `lib/claude/client.DISABLED.ts` (renamed to mark as disabled)
- **Functionality:**
  - Automatic theme extraction
  - AI-powered categorization
  - Action item detection from notes
- **Status:** FULLY DISABLED - API not called at all
- **To Re-enable:** See "Re-enabling Features" section below

### ❌ Category Auto-Assignment
- **File:** `lib/notes/category-handler.ts`
- **Functionality:**
  - Automatic category assignment based on AI confidence
  - Category creation suggestions
- **Status:** Auto-assignment disabled (manual category assignment still works)
- **Dependencies:** Requires AI Processing to be re-enabled first

### ❌ Action Items Extraction
- **File:** `lib/notes/operations.ts` (createActionItems function)
- **Functionality:**
  - Automatic task extraction from notes
  - TODO item detection
- **Status:** Not called in current flow
- **Dependencies:** Requires AI Processing to be re-enabled first

## Currently Working Features

### ✅ Core Note Management
- Create new notes
- Save notes with rich text content
- Load existing notes
- View notes list
- Basic note metadata (created_at, updated_at)

### ✅ Manual Category Management
- View categories
- Create categories manually (not tested yet)
- Filter notes by category
- Manual category assignment (not implemented in UI yet)

### ✅ Database Operations
- Supabase integration
- Test user setup (UUID: 00000000-0000-0000-0000-000000000001)
- Foreign key relationships
- Basic queries (fetch notes, fetch categories)

## Re-enabling Features (Phase 2)

When ready to re-enable AI features, follow this order:

### Step 1: Re-enable AI Processing
1. Rename `lib/claude/client.DISABLED.ts` → `lib/claude/client.ts`
2. Configure `ANTHROPIC_API_KEY` in `.env.local`
3. Test that Claude API calls work
4. Verify themes are extracted correctly

### Step 2: Re-enable Category Auto-Assignment
1. Update `app/api/notes/route.ts` to call `handleCategoryAssignment()`
2. Test with existing categories (should auto-assign)
3. Test with new categories (should suggest creation)

### Step 3: Re-enable Action Items
1. Update `app/api/notes/route.ts` to call `createActionItems()`
2. Test action item extraction
3. Add UI to display action items

### Step 4: Testing Checklist
- [ ] Save note without AI key → Should still work
- [ ] Save note with AI key → Should extract themes
- [ ] Save note matching existing category → Should auto-assign
- [ ] Save note with new category → Should suggest creation
- [ ] Save note with tasks → Should extract action items
- [ ] All above work together seamlessly

## 📋 Notes for Future Claude Sessions

### ⚠️ MANDATORY READING FOR ALL NEW CLAUDE SESSIONS ⚠️

**If you are starting work on this codebase, read this carefully:**

1. **AI features are INTENTIONALLY disabled** - This is not a bug, error, or oversight
2. **Do NOT attempt to re-enable them** - Unless the user explicitly asks you to
3. **Do NOT rename `.DISABLED.ts` files** - The extension is intentional
4. **Do NOT uncomment AI code** - It's commented out for a reason
5. **Focus on core functionality** - Save, load, display notes without AI
6. **Read README_FIRST.md** - It has the full context

### How to Identify Disabled Features

- Files ending in `.DISABLED.ts` (e.g., `lib/claude/client.DISABLED.ts`)
- Files with `⚠️` warning headers (search for this emoji in source files)
- Large commented blocks in `app/api/notes/route.ts` (lines 110-166)
- Functions that exist but are never called (like `handleCategoryAssignment`)

### Your Job as a Claude Session

**Primary focus:**
- Fix bugs in core note functionality
- Improve save/load reliability
- Enhance user experience for basic features
- Work on database operations, UI, error handling

**DO NOT work on:**
- AI theme extraction
- Automatic categorization
- Action item detection
- Anything requiring Claude API calls

### Quick Verification Command

Run this to see all disabled markers:
```bash
grep -r "DISABLED\|⚠️" --include="*.ts" --include="*.tsx" --include="*.md" . | grep -v node_modules
```

### If You're Unsure

**Ask yourself:** "Did the user explicitly request AI functionality?"
- **No** → Don't enable it
- **Yes** → Follow the re-enabling guide below

**When in doubt, ask the user for clarification.**

## Current Implementation

**Notes API (`app/api/notes/route.ts`):**
- Saves notes without any AI processing
- Skips Claude API calls entirely
- Skips category auto-assignment
- Skips action item extraction
- Returns simple success response with saved note

**Frontend (`app/page.tsx`):**
- Displays notes and categories
- Save button works for basic note content
- No AI features shown in UI
- No theme display
- No action items display

## Questions?

If you're unsure about the current state:
1. Check this file (DISABLED_FEATURES.md)
2. Look for `.DISABLED` suffix on files
3. Check git history for "disable" commits
4. Test core save functionality - it should work without AI
