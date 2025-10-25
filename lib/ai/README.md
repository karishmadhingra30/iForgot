# iForgot AI Features

Natural text classification, summarization, and entity extraction powered by Claude AI.

## Quick Start

### 1. Basic Usage

```typescript
import { processNote } from '@/lib/ai/claude-client';

// Process a note with default settings
const result = await processNote({
  noteContent: "I need to call mom tomorrow and schedule a dentist appointment",
  existingCategories: ['Personal', 'Work', 'Health'],
});

console.log(result);
// {
//   themes: ['family', 'health'],
//   sentiment: 'neutral',
//   mood: 'thoughtful',
//   action_items: ['Call mom', 'Schedule dentist appointment'],
//   category: {
//     action: 'assign',
//     name: 'Personal',
//     confidence: 0.85
//   },
//   summary: 'Personal reminders for family contact and health appointment'
// }
```

### 2. Using Prompt Templates

```typescript
import { processNote } from '@/lib/ai/claude-client';
import { promptTemplates } from '@/lib/ai/prompt-templates';

// Use the mood-focused template
const moodTemplate = promptTemplates.moodAndCategory;
const prompt = moodTemplate.buildPrompt({
  noteContent: "Feeling really overwhelmed with all these tasks...",
  existingCategories: ['Personal', 'Work'],
});

const result = await processNote({
  noteContent: "Feeling really overwhelmed with all these tasks...",
  existingCategories: ['Personal', 'Work'],
  customPrompt: prompt,
});

// Quick analysis with pre-built template
import { quickAnalyze } from '@/lib/ai/claude-client';

const quickResult = await quickAnalyze(
  "Had an amazing day at the park!",
  ['Personal', 'Journal']
);
```

### 3. Using the API Endpoint

```typescript
// Frontend code
async function analyzeNote(noteContent: string) {
  const response = await fetch('/api/process-note', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      noteContent,
      existingCategories: ['Work', 'Personal', 'Ideas'],
      templateName: 'moodAndCategory', // Optional
      options: {
        extractEntities: true,
        generateSummary: true,
        detectMood: true,
      },
    }),
  });

  const { data } = await response.json();
  return data;
}
```

## Available Prompt Templates

### 1. Mood & Category
**Best for:** Quick journaling and mood tracking

```typescript
import { promptTemplates } from '@/lib/ai/prompt-templates';

const prompt = promptTemplates.moodAndCategory.buildPrompt({
  noteContent: "your note here",
  existingCategories: ['Personal', 'Work'],
});
```

### 2. Task Extraction
**Best for:** Work notes and todo lists

```typescript
const prompt = promptTemplates.taskFocused.buildPrompt({
  noteContent: "Need to finish the report by Friday and email the team",
  existingCategories: ['Work', 'Projects'],
});
```

### 3. Personal Journal
**Best for:** Emotional processing and self-reflection

```typescript
const prompt = promptTemplates.journaling.buildPrompt({
  noteContent: "Today was tough but I made it through...",
  existingCategories: ['Journal', 'Mental Health'],
});
```

### 4. Meeting Notes
**Best for:** Professional meetings and discussions

```typescript
const prompt = promptTemplates.meetingNotes.buildPrompt({
  noteContent: "Team discussed Q4 goals. John will lead the new project...",
  existingCategories: ['Meetings', 'Work'],
});
```

### 5. Quick Capture
**Best for:** Fast, minimal processing

```typescript
const prompt = promptTemplates.quickCapture.buildPrompt({
  noteContent: "Buy milk",
  existingCategories: ['Errands'],
});
```

## Helper Functions

### Mood and Sentiment

```typescript
import {
  getMoodEmoji,
  getSentimentEmoji,
  getSentimentScore,
  formatAIResult,
} from '@/lib/ai/helpers';

const mood = "excited";
const emoji = getMoodEmoji(mood); // 🎉

const sentiment = "positive";
const sentimentEmoji = getSentimentEmoji(sentiment); // 😊
const score = getSentimentScore(sentiment); // 1

// Format result for display
const displayText = formatAIResult(result);
// "🎉 Mood: excited
//  📝 Great meeting with the team
//  🏷️ Themes: work, collaboration
//  ✅ Tasks: 2 action item(s)
//  📁 Category: Work (85% confident)"
```

### Category Assignment

```typescript
import {
  shouldAutoAssignCategory,
  needsReview,
  generateNotificationMessage,
} from '@/lib/ai/helpers';

// Check if confidence is high enough for auto-assignment
if (shouldAutoAssignCategory(result.category.confidence)) {
  // Auto-assign the category
  await assignCategory(note.id, result.category.name);
} else {
  // Show confirmation modal
  showCategoryModal(result.category.name);
}

// Check if note needs user review
if (needsReview(result)) {
  // Show review interface
  showReviewModal(result);
}

// Generate user notification
const notification = generateNotificationMessage(result);
showToast(notification.title, notification.message, notification.type);
```

### Content Analysis

```typescript
import {
  extractMentions,
  extractHashtags,
  detectUrgency,
} from '@/lib/ai/helpers';

const noteContent = "Meeting with @john about #project #urgent tomorrow";

const mentions = extractMentions(noteContent); // ['john']
const hashtags = extractHashtags(noteContent); // ['project', 'urgent']
const urgency = detectUrgency(noteContent, result.action_items); // 'high'
```

## Custom Prompts

### Create Your Own Template

```typescript
import { buildCustomPrompt } from '@/lib/ai/prompt-templates';

const customPrompt = buildCustomPrompt(
  "Analyze this note for anxiety triggers and suggest coping strategies",
  {
    noteContent: "Feeling stressed about the presentation...",
    existingCategories: ['Mental Health', 'Work'],
    userContext: "User has presentation anxiety",
  }
);

const result = await processNote({
  noteContent: "Feeling stressed about the presentation...",
  existingCategories: ['Mental Health', 'Work'],
  customPrompt,
});
```

### Template for ADHD-Specific Needs

```typescript
const adhdFriendlyPrompt = `
You are helping someone with ADHD capture and organize their thoughts.

Note: "${noteContent}"
Categories: ${existingCategories.join(', ')}

Focus on:
1. Breaking down complex ideas into simple chunks
2. Identifying time-sensitive items (ADHD users struggle with time)
3. Highlighting important but not urgent tasks
4. Detecting signs of overwhelm or executive dysfunction

Return JSON with extra fields:
{
  "themes": ["simple themes"],
  "sentiment": "positive/negative/neutral",
  "mood": "empathetic mood",
  "action_items": ["clear, small, actionable steps"],
  "time_sensitive_items": ["items with deadlines"],
  "executive_function_help": "suggestion for managing this note",
  "category": {
    "action": "assign" or "create",
    "name": "Category",
    "confidence": 0.8
  }
}
`;
```

## Configuration Options

```typescript
interface ProcessNoteOptions {
  noteContent: string;
  existingCategories: string[];
  customPrompt?: string;
  extractEntities?: boolean;      // Default: true
  generateSummary?: boolean;      // Default: true
  detectMood?: boolean;           // Default: true
}
```

## Response Structure

```typescript
interface AIProcessingResult {
  themes: string[];                              // Main themes/topics
  sentiment: 'positive' | 'negative' | 'neutral'; // Overall sentiment
  mood?: string;                                 // User's mood (if detected)
  action_items: string[];                        // Actionable tasks
  category: {
    action: 'assign' | 'create';                 // Assign existing or create new
    name: string;                                 // Category name
    confidence: number;                           // 0-1 confidence score
  };
  summary?: string;                              // Brief summary
  entities?: {
    people?: string[];                           // People mentioned
    places?: string[];                           // Locations
    dates?: string[];                            // Dates/times
    tags?: string[];                             // Hashtags/keywords
  };
}
```

## Best Practices for ADHD Users

### 1. Low Friction Capture
```typescript
// Use quick templates for fast capture
const result = await quickAnalyze(noteContent, categories);
```

### 2. Clear Visual Feedback
```typescript
// Show mood emoji immediately
const emoji = getMoodEmoji(result.mood);
displayEmoji(emoji);

// Show confidence with color coding
const confidenceColor = getConfidenceColor(result.category.confidence);
```

### 3. Smart Defaults
```typescript
// Auto-assign when confidence is high (reduces decision fatigue)
if (shouldAutoAssignCategory(result.category.confidence, 0.8)) {
  await autoAssign(result.category.name);
  showToast('Note saved!', 'success');
} else {
  // Only ask when needed
  showModal('Create new category?');
}
```

### 4. Minimal Cognitive Load
```typescript
// Use formatAIResult for consistent, scannable output
const displayText = formatAIResult(result);
// Shows: emoji + key info only
```

## Error Handling

```typescript
try {
  const result = await processNote({
    noteContent,
    existingCategories,
  });
} catch (error) {
  console.error('AI processing failed:', error);

  // Fallback: save without AI categorization
  await saveNote({
    content: noteContent,
    category: 'Uncategorized',
    themes: [],
    sentiment: 'neutral',
  });

  showToast('Note saved without AI analysis', 'warning');
}
```

## Performance Tips

1. **Batch Processing**: Process multiple notes in parallel
```typescript
const results = await Promise.all(
  notes.map(note => processNote({ noteContent: note.content, existingCategories }))
);
```

2. **Cache Categories**: Don't fetch categories on every request
```typescript
const categories = await getCachedCategories(userId);
```

3. **Use Quick Templates**: For simple notes, use `quickCapture` template
```typescript
const result = await processNote({
  noteContent,
  existingCategories,
  customPrompt: promptTemplates.quickCapture.buildPrompt({
    noteContent,
    existingCategories,
  }),
});
```

## Example: Complete User Flow

```typescript
// 1. User creates a note
const noteContent = "Had a great meeting with Sarah. Need to follow up on the budget proposal by Friday and send her the final numbers.";

// 2. Process with AI
const result = await processNote({
  noteContent,
  existingCategories: ['Work', 'Meetings', 'Personal'],
  detectMood: true,
  extractEntities: true,
  generateSummary: true,
});

// 3. Handle categorization
if (shouldAutoAssignCategory(result.category.confidence)) {
  // Auto-assign
  await saveNote({
    content: noteContent,
    categoryName: result.category.name,
    themes: result.themes,
    sentiment: result.sentiment,
    mood: result.mood,
    actionItems: result.action_items,
  });

  // Show success notification
  const notification = generateNotificationMessage(result);
  showToast(notification.title, notification.message);
} else {
  // Show confirmation modal
  showCategoryDecisionModal({
    categoryName: result.category.name,
    confidence: result.category.confidence,
    onConfirm: () => saveWithCategory(result),
    onSkip: () => saveWithoutCategory(noteContent),
  });
}

// 4. Create tasks from action items
for (const task of result.action_items) {
  await createTask({
    description: task,
    noteId: note.id,
    dueDate: extractDueDateFromTask(task), // Extract "by Friday"
  });
}
```

## Testing

```typescript
// Test with different note types
const testCases = [
  {
    name: 'Simple task',
    content: 'Buy groceries',
    expected: { sentiment: 'neutral', themes: ['errands'] },
  },
  {
    name: 'Emotional note',
    content: 'Feeling overwhelmed with everything...',
    expected: { sentiment: 'negative', mood: 'overwhelmed' },
  },
  {
    name: 'Meeting notes',
    content: 'Team meeting: discussed Q4 goals with John and Sarah',
    expected: { themes: ['work', 'meetings'], entities: { people: ['John', 'Sarah'] } },
  },
];

for (const test of testCases) {
  const result = await processNote({
    noteContent: test.content,
    existingCategories: ['Work', 'Personal'],
  });

  console.log(`Test: ${test.name}`, result);
}
```

## Support

For issues or questions:
- Check the main `claude.md` for architecture details
- Review TypeScript types in `lib/types/index.ts`
- See helper functions in `lib/ai/helpers.ts`
