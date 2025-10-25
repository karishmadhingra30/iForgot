# AI Features Overview

## What's Included

Your iForgot ADHD note-taking app now has complete AI-powered features for natural text classification, summarization, and entity extraction.

## Files Created

### Core AI Module
- **`lib/ai/claude-client.ts`** - Main Claude API integration with `processNote()` function
- **`lib/ai/prompt-templates.ts`** - 5 pre-built prompt templates for different use cases
- **`lib/ai/helpers.ts`** - Helper functions for mood detection, sentiment analysis, and categorization
- **`lib/ai/examples.tsx`** - 7 complete React component examples
- **`lib/ai/README.md`** - Comprehensive documentation

### API & Types
- **`app/api/process-note/route.ts`** - Next.js API endpoint for note processing
- **`lib/types/index.ts`** - Complete TypeScript types for the entire app

### Configuration
- **`.env.example`** - Environment variables template
- **`package.json`** - Dependencies for Next.js, Claude API, Supabase, and Tiptap
- **`tsconfig.json`** - TypeScript configuration

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env
```

Add your API keys:
- `ANTHROPIC_API_KEY` - Get from https://console.anthropic.com/
- `NEXT_PUBLIC_SUPABASE_URL` - From your Supabase project
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - From your Supabase project

### 3. Use in Your Components

```typescript
import { processNote } from '@/lib/ai/claude-client';

const result = await processNote({
  noteContent: "I need to call mom tomorrow",
  existingCategories: ['Personal', 'Work'],
});

// Result includes: themes, sentiment, mood, action_items, category, summary, entities
```

## Key Features

### 1. Natural Text Classification
Automatically categorizes notes with confidence scoring (>80% = auto-assign).

### 2. Mood Detection
Detects user mood with emoji mapping for ADHD-friendly visual feedback.

### 3. Action Item Extraction
Pulls actionable tasks from any note content.

### 4. Custom Prompt Templates
5 pre-built templates:
- **Mood & Category** - Quick journaling
- **Task Extraction** - Work notes and todos
- **Personal Journal** - Emotional processing
- **Meeting Notes** - Professional contexts
- **Quick Capture** - Minimal processing

### 5. Entity Extraction
Automatically extracts:
- People (@mentions)
- Places
- Dates/times
- Tags/hashtags

### 6. Smart Summarization
One-line summaries for quick scanning.

## Example Usage

### Simple Note Processing
```typescript
const result = await processNote({
  noteContent: "Had a great meeting with Sarah about Q4 goals",
  existingCategories: ['Work', 'Meetings'],
});

// Auto-categorize if confidence > 80%
if (shouldAutoAssignCategory(result.category.confidence)) {
  await saveNote(result);
} else {
  showConfirmationModal(result);
}
```

### Quick Mood Analysis
```typescript
import { quickAnalyze } from '@/lib/ai/claude-client';

const result = await quickAnalyze(
  "Feeling overwhelmed with all these tasks",
  ['Personal']
);

console.log(result.mood); // "overwhelmed"
console.log(getMoodEmoji(result.mood)); // "😰"
```

### Using Templates
```typescript
import { promptTemplates } from '@/lib/ai/prompt-templates';

const prompt = promptTemplates.taskFocused.buildPrompt({
  noteContent: "Need to email team and finish report by Friday",
  existingCategories: ['Work'],
});

const result = await processNote({
  noteContent,
  existingCategories: ['Work'],
  customPrompt: prompt,
});

console.log(result.action_items);
// ["Email team", "Finish report by Friday"]
```

## API Endpoint

```typescript
// POST /api/process-note
const response = await fetch('/api/process-note', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    noteContent: "your note here",
    existingCategories: ['Work', 'Personal'],
    templateName: 'moodAndCategory', // optional
    options: {
      extractEntities: true,
      generateSummary: true,
      detectMood: true,
    },
  }),
});

const { data } = await response.json();
```

## Helper Functions

### Mood & Sentiment
```typescript
import {
  getMoodEmoji,
  getSentimentEmoji,
  formatAIResult,
} from '@/lib/ai/helpers';

const emoji = getMoodEmoji('excited'); // 🎉
const formatted = formatAIResult(result); // User-friendly display
```

### Categorization
```typescript
import {
  shouldAutoAssignCategory,
  needsReview,
  generateNotificationMessage,
} from '@/lib/ai/helpers';

if (shouldAutoAssignCategory(result.category.confidence)) {
  // Auto-assign
} else {
  // Show modal
}

const notification = generateNotificationMessage(result);
// { title: "Note Saved", message: "...", type: "success" }
```

### Content Analysis
```typescript
import {
  extractMentions,
  extractHashtags,
  detectUrgency,
} from '@/lib/ai/helpers';

const mentions = extractMentions("Meeting with @john"); // ['john']
const tags = extractHashtags("Important #project #urgent"); // ['project', 'urgent']
const urgency = detectUrgency(noteContent, actionItems); // 'high' | 'medium' | 'low'
```

## Component Examples

See `lib/ai/examples.tsx` for 7 complete React component examples:
1. Simple Note Processor
2. Mood Tracker
3. Category Decision Modal
4. Action Items Extractor
5. Template Selector
6. Complete Note Flow
7. Quick Mood Check-in (ADHD-optimized)

## ADHD-Friendly Design Principles

✅ **Low Friction** - Minimal clicks, auto-save, quick capture
✅ **Visual Feedback** - Emoji mood indicators, color-coded confidence
✅ **Smart Defaults** - Auto-categorize when confident
✅ **Reduced Decisions** - Only ask when necessary
✅ **Clear Output** - Scannable, formatted results

## Next Steps

1. **Integrate with Your Next.js App** - Copy components from examples.tsx
2. **Set Up Supabase** - Create database schema (see claude.md)
3. **Add Voice Input** - Integrate Deepgram/Whisper API
4. **Customize Templates** - Modify prompt templates for your needs
5. **Test & Iterate** - Use the built-in test cases

## Documentation

- **Full API Docs**: `lib/ai/README.md`
- **Architecture**: `claude.md`
- **Types**: `lib/types/index.ts`
- **Examples**: `lib/ai/examples.tsx`

## Support

Questions? Check:
1. The comprehensive `lib/ai/README.md`
2. Code comments in each file
3. Example components in `lib/ai/examples.tsx`

Happy coding! 🚀
