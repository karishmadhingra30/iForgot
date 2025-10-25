# ADHD Organization App - Development Guide

## Project Overview
**Name Ideas**: AD-Do, iForgot  
**Principles**: Minimalist, Freakishly easy, Low complexity

AI-powered note-taking app for ADHD users with voice input and automatic categorization.

---

## Tech Stack
- **Frontend**: React + Tiptap editor
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **AI**: Claude API (Anthropic)
- **Voice**: Deepgram or Whisper API
- **UI**: shadcn/ui
- **Hosting**: Vercel

---

## Core Features (MVP)
1. **Voice Input** - Record, transcribe, edit before saving
2. **Text Notes** - Rich text editor with auto-save (2s)
3. **AI Auto-Categorization** - Smart category assignment (80% confidence threshold)
4. **Category Management** - Create, rename, delete, filter
5. **Clean Design** - Minimal, distraction-free, mobile responsive

---

## Architecture Flow

### 1. User Input
- **Text**: Direct input via Tiptap editor
- **Voice**: Audio → Deepgram/Whisper → Transcription → Text

### 2. Claude API Processing
Single API call with prompt:
```javascript
const prompt = `
Existing categories: ${categories.map(c => c.name).join(', ')}
Note: "${noteContent}"

Analyze and return JSON:
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

### 3. Categorization Logic
- **Confidence >80%**: Auto-assign to existing category
- **Confidence <80%**: Show modal to create new category
- Save note with themes, sentiment, action items

### 4. Search
Simple PostgreSQL ILIKE query on content and themes (no embeddings)

---

## Database Schema
```sql
-- Users (handled by Supabase Auth)

-- Notes
notes: id, user_id, content, category_id, themes[], sentiment, created_at, updated_at

-- Categories
categories: id, user_id, name, created_at

-- Tasks (optional)
tasks: id, note_id, user_id, description, completed, created_at
```

---

## Key User Flows

### Voice Note Flow
1. Click mic → Record → Stop
2. Transcription appears in editor
3. Edit if needed → Save
4. Claude analyzes → Category decision
5. If new category → Modal confirmation
6. Note saved with category + metadata

### Text Note Flow
1. Click "New Note" → Type content
2. Auto-saves every 2s
3. Click "Done" → Claude analyzes
4. Category assigned (auto or with confirmation)
5. Themes, sentiment, tasks extracted

### Category Decision
```
IF confidence > 80%:
  → Auto-assign to existing category
  → Show toast notification

IF confidence < 80%:
  → Show modal: "Create new category '[Name]'?"
  → User confirms/skips
```

---

## Build Phases (5 Hours)

**Hour 1**: Foundation + Text Notes  
**Hour 2**: AI Categorization  
**Hour 3**: Category Management  
**Hour 4**: Voice Input  
**Hour 5**: Clean Design + Polish

---

## Development Priorities
1. **Simplicity over features** - Keep UI minimal
2. **Fast response times** - Optimize Claude API calls
3. **Error handling** - Graceful fallbacks for API failures
4. **Mobile-first** - Responsive design from start
5. **Accessibility** - ADHD-friendly (clear feedback, low cognitive load)

---

## API Endpoints
```
POST /api/process-note
  Body: { noteContent, userId }
  Returns: { themes, sentiment, action_items, category }

POST /api/transcribe
  Body: { audioBlob }
  Returns: { text }

GET /api/notes?userId=X&category=Y
  Returns: [notes]

POST /api/categories
  Body: { name, userId }
  Returns: { categoryId }
```

---

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
DEEPGRAM_API_KEY= (or OPENAI_API_KEY for Whisper)
```

---

## Design Principles for ADHD Users
- **Instant feedback** on all actions
- **Visual indicators** for recording, saving, processing
- **No overwhelming choices** - smart defaults
- **Forgiving UX** - easy to undo/edit
- **Low friction** - minimal clicks to capture thoughts