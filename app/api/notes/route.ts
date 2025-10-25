import { NextRequest, NextResponse } from 'next/server'
import { processNoteWithClaude } from '@/lib/claude/client'
import {
  createNote,
  createActionItems,
  fetchUserCategories,
  handleCategoryAssignment,
} from '@/lib/notes'
import { AIProcessingResult } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { noteContent, userId } = await request.json()

    if (!noteContent || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

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
        // Don't fail the whole request if tasks fail
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
