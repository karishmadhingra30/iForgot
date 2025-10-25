# AD-Do Project Structure

## Directory Overview

```
ad-do/
├── app/                          # Next.js App Router
│   ├── (dashboard)/             # Dashboard layout group
│   │   ├── notes/              # Notes page
│   │   └── categories/         # Categories page
│   ├── api/                     # API routes
│   │   ├── process-note/       # Claude AI processing endpoint
│   │   ├── transcribe/         # Voice transcription endpoint
│   │   ├── notes/              # CRUD operations for notes
│   │   └── categories/         # CRUD operations for categories
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
│
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   ├── notes/                  # Note-related components
│   │   ├── NoteEditor.tsx      # Tiptap rich text editor
│   │   ├── NoteList.tsx        # Display list of notes
│   │   └── NoteCard.tsx        # Individual note display
│   ├── categories/             # Category-related components
│   │   ├── CategoryModal.tsx   # Create/edit category modal
│   │   └── CategoryFilter.tsx  # Filter notes by category
│   ├── voice/                  # Voice recording components
│   │   └── VoiceRecorder.tsx   # Voice recording UI
│   └── layout/                 # Layout components
│       ├── Navbar.tsx          # Navigation bar
│       └── Sidebar.tsx         # Sidebar navigation
│
├── lib/                        # Utilities and clients
│   ├── supabase/
│   │   └── client.ts           # Supabase client initialization
│   ├── claude/
│   │   └── client.ts           # Claude API integration
│   ├── voice/
│   │   └── transcribe.ts       # Voice transcription logic
│   └── utils.ts                # Utility functions (cn, etc.)
│
├── types/                      # TypeScript type definitions
│   └── index.ts                # Core types (Note, Category, etc.)
│
├── database/                   # Database schemas
│   └── schema.sql              # Supabase PostgreSQL schema
│
├── public/                     # Static assets
│   ├── icons/                  # App icons
│   └── audio/                  # Audio assets
│
└── Configuration files
    ├── package.json            # Dependencies
    ├── tsconfig.json           # TypeScript config
    ├── next.config.js          # Next.js config
    ├── tailwind.config.js      # Tailwind CSS config
    ├── components.json         # shadcn/ui config
    ├── .env.example            # Environment variables template
    └── .gitignore              # Git ignore rules
```

## Key Files to Create During Build Sprint

### Hour 1: Foundation + Text Notes
- `app/globals.css` - Global styles with CSS variables
- `app/layout.tsx` - Root layout with auth
- `app/page.tsx` - Landing page
- `app/(dashboard)/notes/page.tsx` - Main notes interface
- `components/notes/NoteEditor.tsx` - Tiptap editor component
- `components/notes/NoteList.tsx` - Display notes
- `app/api/notes/route.ts` - CRUD API for notes

### Hour 2: AI Categorization
- `app/api/process-note/route.ts` - Claude processing endpoint
- `components/categories/CategoryModal.tsx` - Confirm new categories

### Hour 3: Category Management
- `app/(dashboard)/categories/page.tsx` - Manage categories
- `app/api/categories/route.ts` - Category CRUD
- `components/categories/CategoryFilter.tsx` - Filter UI

### Hour 4: Voice Input
- `components/voice/VoiceRecorder.tsx` - Recording UI
- `app/api/transcribe/route.ts` - Transcription endpoint

### Hour 5: Clean Design + Polish
- `components/ui/*` - Install shadcn/ui components
- `components/layout/Navbar.tsx` - Navigation
- Polish existing components
- Add loading states and error handling

## Database Setup

1. Create a Supabase project
2. Run `database/schema.sql` in Supabase SQL editor
3. Enable Row Level Security (RLS) policies
4. Configure authentication providers

## Environment Setup

1. Copy `.env.example` to `.env.local`
2. Fill in all API keys:
   - Supabase URL and anon key
   - Anthropic API key
   - Deepgram or OpenAI API key

## Development Workflow

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Access at http://localhost:3000
```

## shadcn/ui Component Installation

```bash
# Install specific components as needed
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add card
```

## API Routes

- `POST /api/process-note` - Process note with Claude AI
- `POST /api/transcribe` - Transcribe voice recording
- `GET /api/notes` - Fetch user's notes
- `POST /api/notes` - Create new note
- `PATCH /api/notes/[id]` - Update note
- `DELETE /api/notes/[id]` - Delete note
- `GET /api/categories` - Fetch user's categories
- `POST /api/categories` - Create category
- `PATCH /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

## Design Principles

- **ADHD-friendly**: Clear feedback, low cognitive load
- **Minimalist**: Clean, distraction-free interface
- **Mobile-first**: Responsive design from the start
- **Fast**: Optimized API calls, instant feedback
- **Forgiving**: Easy to undo/edit, auto-save
