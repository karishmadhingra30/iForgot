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
