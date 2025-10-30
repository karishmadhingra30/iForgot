import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
// AI PROCESSING TEMPORARILY DISABLED - See DISABLED_FEATURES.md
// import { processNoteWithClaude } from '@/lib/claude/client'
import {
  createNote,
  createActionItems,
  fetchUserCategories,
  handleCategoryAssignment,
  fetchUserNotes,
} from '@/lib/notes'
import { AIProcessingResult } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const categoryId = searchParams.get('categoryId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Missing userId' },
        { status: 400 }
      )
    }

    const options = categoryId ? { categoryId } : undefined
    const result = await fetchUserNotes(userId, options)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      notes: result.notes || [],
    })
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { noteContent, userId } = await request.json()

    if (!noteContent || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // =============================================================================
    // AI PROCESSING DISABLED - See DISABLED_FEATURES.md
    // =============================================================================
    // When re-enabling AI features, uncomment the sections below and follow
    // the step-by-step guide in DISABLED_FEATURES.md
    // =============================================================================

    // For now, create a simple note without AI processing (like simple-note API)
    const { data: newNote, error } = await supabase
      .from('notes')
      .insert({
        user_id: userId,
        content: noteContent,
        themes: [], // Empty themes since AI is disabled
      })
      .select()
      .single()

    if (error || !newNote) {
      // Check if it's a foreign key constraint error
      const isForeignKeyError = error?.message?.includes('foreign key constraint') ||
                                 error?.message?.includes('notes_user_id_fkey')

      if (isForeignKeyError) {
        return NextResponse.json(
          {
            success: false,
            error: '⚠️ Database setup incomplete: Test user not found. Please run database/test-user-setup.sql in your Supabase SQL Editor. See database/README.md for instructions.',
          },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { success: false, error: error?.message || 'Failed to create note' },
        { status: 500 }
      )
    }

    // Return simple success response
    return NextResponse.json({
      success: true,
      note: newNote,
      message: 'Note saved successfully (AI features disabled)',
    })

    // =============================================================================
    // DISABLED CODE - Will re-enable in Phase 2
    // =============================================================================
    /*
    // 1. Fetch existing categories for the user
    const categories = await fetchUserCategories(userId)
    const categoryNames = categories.map((c) => c.name)

    // 2. Process note with Claude API
    const aiResult: AIProcessingResult = await processNoteWithClaude(
      noteContent,
      categoryNames
    )

    // 3. Save note with metadata
    const { success: noteSuccess, note: newNote, error: noteError } =
      await createNote(userId, noteContent, aiResult)

    if (!noteSuccess || !newNote) {
      return NextResponse.json(
        { success: false, error: noteError || 'Failed to create note' },
        { status: 500 }
      )
    }

    // 4. Handle category assignment/creation
    const categoryResult = await handleCategoryAssignment(
      newNote.id,
      userId,
      aiResult.category,
      categories
    )

    // 5. Save action items if any
    if (aiResult.action_items && aiResult.action_items.length > 0) {
      const { success: tasksSuccess, error: tasksError } =
        await createActionItems(newNote.id, userId, aiResult.action_items)

      if (!tasksSuccess) {
        console.error('Error creating tasks:', tasksError)
      }
    }

    return NextResponse.json({
      success: true,
      note: newNote,
      analysis: aiResult,
      category: {
        autoAssigned: categoryResult.autoAssigned,
        requiresConfirmation: categoryResult.requiresConfirmation,
        suggestedAction: categoryResult.suggestedAction,
        suggestedName: aiResult.category.name,
        confidence: aiResult.category.confidence,
      },
    })
    */
    // =============================================================================
  } catch (error) {
    console.error('Error processing note:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { noteId, noteContent, userId } = await request.json()

    if (!noteId || !noteContent || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update the existing note
    const { data: updatedNote, error } = await supabase
      .from('notes')
      .update({
        content: noteContent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', noteId)
      .eq('user_id', userId) // Ensure user owns the note
      .select()
      .single()

    if (error || !updatedNote) {
      return NextResponse.json(
        { success: false, error: error?.message || 'Failed to update note' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      note: updatedNote,
      message: 'Note updated successfully',
    })
  } catch (error) {
    console.error('Error updating note:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
