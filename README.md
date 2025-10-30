# AD-Do (iForgot)

An AI-powered note-taking app designed specifically for ADHD users, featuring voice input and automatic categorization.

## Features

- **Voice Input**: Record thoughts instantly with voice-to-text transcription
- **AI Categorization**: Automatic note organization using Claude AI
- **Rich Text Editor**: Clean, distraction-free writing experience with Tiptap
- **Smart Categories**: Auto-suggest categories with 80% confidence threshold
- **Theme Extraction**: Automatically identify themes and sentiment
- **Action Items**: Extract and track tasks from notes
- **ADHD-Friendly Design**: Minimalist UI, instant feedback, low cognitive load

## Tech Stack

- **Frontend**: Next.js 14 + React + TypeScript
- **Editor**: Tiptap (rich text)
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude API
- **Voice**: Deepgram or OpenAI Whisper
- **UI**: shadcn/ui + Tailwind CSS
- **Hosting**: Vercel

## Quick Start

> **📖 For detailed setup instructions and troubleshooting, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)**

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Fill in your API keys
   ```

3. **Set up Supabase**:
   - Create a new Supabase project
   - Go to Supabase Dashboard → SQL Editor
   - Run the SQL schema from `database/schema.sql`
   - **IMPORTANT**: Run the test user setup from `database/test-user-setup.sql` (required for local development)
   - Copy your Supabase URL and anon key to `.env.local`

   > ⚠️ **Without running test-user-setup.sql**, the save functionality will fail with a foreign key constraint error. See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for details.

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. **Open**: [http://localhost:3000](http://localhost:3000)

## Environment Variables

Required environment variables (see `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `ANTHROPIC_API_KEY`: Your Claude API key
- `DEEPGRAM_API_KEY` or `OPENAI_API_KEY`: For voice transcription

## Project Structure

See [STRUCTURE.md](./STRUCTURE.md) for detailed project structure and development guide.

## 5-Hour Build Sprint Plan

- **Hour 1**: Foundation + Text Notes
- **Hour 2**: AI Categorization
- **Hour 3**: Category Management
- **Hour 4**: Voice Input
- **Hour 5**: Clean Design + Polish

## Development Principles

- **Simplicity over features**: Keep UI minimal
- **Fast response times**: Optimize API calls
- **Mobile-first**: Responsive design
- **ADHD-friendly**: Clear feedback, low complexity
- **Forgiving UX**: Easy to undo/edit

## License

MIT
