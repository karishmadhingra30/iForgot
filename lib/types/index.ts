/**
 * TypeScript types for iForgot ADHD Note-Taking App
 */

// Re-export AI types
export type {
  AIProcessingResult,
  ProcessNoteOptions,
} from '../ai/claude-client';

export type {
  PromptTemplate,
  PromptParams,
} from '../ai/prompt-templates';

/**
 * Database Models
 */

export interface Note {
  id: string;
  user_id: string;
  content: string;
  category_id: string | null;
  themes: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  mood?: string;
  action_items: string[];
  summary?: string;
  entities?: NoteEntities;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color?: string;
  icon?: string;
  created_at: string;
}

export interface Task {
  id: string;
  note_id: string;
  user_id: string;
  description: string;
  completed: boolean;
  due_date?: string;
  created_at: string;
}

export interface NoteEntities {
  people?: string[];
  places?: string[];
  dates?: string[];
  tags?: string[];
}

/**
 * API Request/Response Types
 */

export interface ProcessNoteRequest {
  noteContent: string;
  existingCategories?: string[];
  templateName?: string;
  customPrompt?: string;
  options?: {
    extractEntities?: boolean;
    generateSummary?: boolean;
    detectMood?: boolean;
  };
}

export interface ProcessNoteResponse {
  success: boolean;
  data?: AIProcessingResult;
  error?: string;
  message?: string;
}

export interface TranscribeRequest {
  audioBlob: Blob;
}

export interface TranscribeResponse {
  success: boolean;
  text?: string;
  error?: string;
}

/**
 * UI Component Types
 */

export interface CategoryDecisionModalProps {
  isOpen: boolean;
  categoryName: string;
  confidence: number;
  action: 'assign' | 'create';
  onConfirm: () => void;
  onSkip: () => void;
}

export interface NoteCardProps {
  note: Note;
  category?: Category;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook Types
 */

export interface UseNoteProcessingOptions {
  onSuccess?: (result: AIProcessingResult) => void;
  onError?: (error: Error) => void;
  autoSave?: boolean;
}

export interface UseVoiceInputOptions {
  autoSubmit?: boolean;
  onTranscriptionComplete?: (text: string) => void;
}

/**
 * Utility Types
 */

export type SentimentType = 'positive' | 'negative' | 'neutral';

export type UrgencyLevel = 'high' | 'medium' | 'low';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface NotificationConfig {
  title: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

/**
 * Filter and Search Types
 */

export interface NoteFilters {
  category?: string;
  sentiment?: SentimentType;
  dateRange?: {
    start: Date;
    end: Date;
  };
  hasActionItems?: boolean;
  searchQuery?: string;
}

export interface SearchOptions {
  query: string;
  filters?: NoteFilters;
  limit?: number;
  offset?: number;
}
