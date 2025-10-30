# ⚠️ READ THIS FIRST - IMPORTANT ⚠️

## AI Features Are Intentionally DISABLED

**If you are a new Claude session starting work on this codebase:**

### 🚨 CRITICAL INFORMATION 🚨

**AI features are INTENTIONALLY DISABLED in this codebase.**

This is **NOT** a bug. This is **NOT** an error. This is a **deliberate architectural decision.**

### What This Means

1. **DO NOT** try to "fix" or re-enable AI features
2. **DO NOT** rename `client.DISABLED.ts` back to `client.ts`
3. **DO NOT** uncomment AI processing code in `app/api/notes/route.ts`
4. **DO NOT** integrate AI-powered category or action item features
5. **DO NOT** add AI functionality unless explicitly requested by the user

### Why AI Is Disabled

We are following a **phased development approach**:

- **Phase 1 (CURRENT):** Stabilize core note-taking functionality (save, load, display)
- **Phase 2 (FUTURE):** Re-enable AI features one by one after core works perfectly

### What Works Right Now

✅ **These features are WORKING and should be maintained:**
- Basic note creation and saving
- Loading and displaying notes
- Manual category management
- Rich text editing
- Database operations

❌ **These features are DISABLED and should remain disabled:**
- AI-powered theme extraction (Claude API)
- Automatic category assignment
- Action item extraction from notes
- Any Claude/Anthropic API calls

### Files Marked as DISABLED

Look for these indicators:
- Files with `.DISABLED.ts` extension (e.g., `lib/claude/client.DISABLED.ts`)
- Large commented-out blocks in `app/api/notes/route.ts` (lines 110-166)
- Header warnings at the top of AI-related files

### How to Verify

Run this command to see what's disabled:
```bash
grep -r "⚠️" --include="*.ts" --include="*.tsx" lib/ app/
```

### Full Documentation

For complete details, see:
- **DISABLED_FEATURES.md** - Comprehensive documentation of what's disabled and why
- File headers in `lib/claude/`, `lib/notes/operations.ts`, and `lib/notes/category-handler.ts`

### When Working on This Codebase

**Your priorities should be:**
1. Focus on core note functionality (save/load/display)
2. Fix any bugs in the basic note-taking flow
3. Improve error handling and user experience
4. **ONLY** re-enable AI features when explicitly requested by the user

### Re-enabling AI Features

**DO NOT** re-enable unless the user explicitly asks you to.

When the time comes, follow the step-by-step guide in **DISABLED_FEATURES.md** section "Re-enabling Features (Phase 2)".

---

## Quick Start (For Development)

Since AI is disabled, focus on:

```bash
# Run the development server
npm run dev

# Test basic note operations
# 1. Create a note
# 2. Save it
# 3. Reload the page
# 4. Verify note appears in list
```

---

## Questions?

If you're confused about why something doesn't work:
1. **Check if it's an AI feature** - If yes, it's intentionally disabled
2. **Read DISABLED_FEATURES.md** - Full context and documentation
3. **Ask the user** - They can clarify what should be working

---

**Remember: This is intentional. AI features will be added back sequentially once core functionality is stable.**
