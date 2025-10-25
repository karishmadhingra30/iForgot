import { NextRequest, NextResponse } from 'next/server'
import { createAndAssignCategory } from '@/lib/notes'

/**
 * POST: Create a new category and optionally assign it to a note
 */
export async function POST(request: NextRequest) {
  try {
    const { categoryName, userId, noteId } = await request.json()

    if (!categoryName || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // If noteId is provided, create and assign
    if (noteId) {
      const result = await createAndAssignCategory(noteId, userId, categoryName)

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        categoryId: result.categoryId,
        message: 'Category created and assigned to note',
      })
    }

    // Otherwise, just create the category
    const { supabase } = await import('@/lib/supabase/client')
    const { data: newCategory, error } = await supabase
      .from('categories')
      .insert({
        user_id: userId,
        name: categoryName,
      })
      .select()
      .single()

    if (error || !newCategory) {
      return NextResponse.json(
        { success: false, error: error?.message || 'Failed to create category' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      category: newCategory,
      message: 'Category created successfully',
    })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
