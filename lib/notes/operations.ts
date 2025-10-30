// ============================================================================
// ⚠️  AI FEATURES IN THIS FILE ARE TEMPORARILY DISABLED ⚠️
// ============================================================================
// Functions in this file that depend on AI processing are not currently called:
// - createNote() - Requires AIProcessingResult (not used in current flow)
// - createActionItems() - Requires AI to extract action items (not called)
//
// These functions are defined but INACTIVE in the current implementation.
// See DISABLED_FEATURES.md for details on re-enabling.
//
// FOR CLAUDE SESSIONS: These functions exist for future use. Do NOT call them
// or integrate them unless explicitly requested by the user.
// ============================================================================

import { supabase } from '@/lib/supabase/client'
import { Note, Task, AIProcessingResult } from '@/types'

/**
 * Create a new note with AI-generated metadata
 */
export async function createNote(
  userId: string,
  content: string,
  aiResult: AIProcessingResult
): Promise<{ success: boolean; note?: Note; error?: string }> {
  try {
    const { data: newNote, error } = await supabase
      .from('notes')
      .insert({
        user_id: userId,
        content,
        themes: aiResult.themes,
      })
      .select()
      .single()

    if (error || !newNote) {
      // Check if it's a foreign key constraint error
      const isForeignKeyError = error?.message?.includes('foreign key constraint') ||
                                 error?.message?.includes('notes_user_id_fkey')

      if (isForeignKeyError) {
        return {
          success: false,
          error: '⚠️ Database setup incomplete: Test user not found. Please run database/test-user-setup.sql in your Supabase SQL Editor. See database/README.md for instructions.',
        }
      }

      return {
        success: false,
        error: error?.message || 'Failed to create note',
      }
    }

    return {
      success: true,
      note: newNote as Note,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Update note's category
 */
export async function updateNoteCategory(
  noteId: string,
  categoryId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('notes')
      .update({ category_id: categoryId })
      .eq('id', noteId)

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Create action items (tasks) from a note
 */
export async function createActionItems(
  noteId: string,
  userId: string,
  actionItems: string[]
): Promise<{ success: boolean; tasks?: Task[]; error?: string }> {
  try {
    if (!actionItems || actionItems.length === 0) {
      return { success: true, tasks: [] }
    }

    const tasks = actionItems.map((description) => ({
      note_id: noteId,
      user_id: userId,
      description,
      completed: false,
    }))

    const { data, error } = await supabase
      .from('tasks')
      .insert(tasks)
      .select()

    if (error) {
      // Check if it's a foreign key constraint error
      const isForeignKeyError = error.message?.includes('foreign key constraint') ||
                                 error.message?.includes('tasks_user_id_fkey')

      if (isForeignKeyError) {
        return {
          success: false,
          error: '⚠️ Database setup incomplete: Test user not found. Please run database/test-user-setup.sql in your Supabase SQL Editor. See database/README.md for instructions.',
        }
      }

      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      tasks: data as Task[],
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Fetch note with its related data
 */
export async function fetchNote(
  noteId: string
): Promise<{ success: boolean; note?: Note; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select(`
        *,
        category:categories(*),
        tasks(*)
      `)
      .eq('id', noteId)
      .single()

    if (error || !data) {
      return {
        success: false,
        error: error?.message || 'Note not found',
      }
    }

    return {
      success: true,
      note: data as Note,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Fetch all notes for a user with optional filters
 */
export async function fetchUserNotes(
  userId: string,
  options?: {
    categoryId?: string
    limit?: number
  }
): Promise<{ success: boolean; notes?: Note[]; error?: string }> {
  try {
    let query = supabase
      .from('notes')
      .select(`
        *,
        category:categories(*),
        tasks(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (options?.categoryId) {
      query = query.eq('category_id', options.categoryId)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      notes: (data || []) as Note[],
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Delete a note and its associated tasks
 */
export async function deleteNote(
  noteId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', userId) // Security: verify ownership

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
