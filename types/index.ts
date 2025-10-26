// Core types for AD-Do app

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  content: string;
  category_id: string | null;
  category?: Category;
  themes: string[];
  created_at: string;
  updated_at: string;
  tasks?: Task[];
}

export interface Task {
  id: string;
  note_id: string;
  user_id: string;
  description: string;
  completed: boolean;
  created_at: string;
}

// AI Processing types
export interface AIProcessingResult {
  themes: string[];
  action_items: string[];
  category: {
    action: 'assign' | 'create';
    name: string;
    confidence: number;
  };
}

// API Request/Response types
export interface ProcessNoteRequest {
  noteContent: string;
  userId: string;
  existingCategories: string[];
}

export interface ProcessNoteResponse extends AIProcessingResult {
  success: boolean;
  error?: string;
}

export interface TranscribeRequest {
  audioBlob: Blob;
}

export interface TranscribeResponse {
  text: string;
  success: boolean;
  error?: string;
}

// Voice recording types
export interface VoiceRecordingState {
  isRecording: boolean;
  isProcessing: boolean;
  audioBlob: Blob | null;
  transcription: string;
  error: string | null;
}
