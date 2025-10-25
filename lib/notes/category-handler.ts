import { supabase } from '@/lib/supabase/client'
import { AIProcessingResult, Category } from '@/types'

/**
 * Decision logic for category handling based on AI analysis
 */
export async function handleCategoryAssignment(
  noteId: string,
  userId: string,
  categoryResult: AIProcessingResult['category'],
  existingCategories: Category[]
): Promise<{
  categoryId: string | null
  autoAssigned: boolean
  requiresConfirmation: boolean
  suggestedAction: 'assign' | 'create' | 'none'
}> {
  // High confidence assignment to existing category
  if (categoryResult.action === 'assign' && categoryResult.confidence > 0.8) {
    const existingCategory = existingCategories.find(
      (c) => c.name === categoryResult.name
    )

    if (existingCategory) {
      // Auto-assign to existing category
      await supabase
        .from('notes')
        .update({ category_id: existingCategory.id })
        .eq('id', noteId)

      return {
        categoryId: existingCategory.id,
        autoAssigned: true,
        requiresConfirmation: false,
        suggestedAction: 'assign',
      }
    }
  }

  // Low confidence or create action - requires user confirmation
  if (categoryResult.action === 'create' || categoryResult.confidence <= 0.8) {
    return {
      categoryId: null,
      autoAssigned: false,
      requiresConfirmation: true,
      suggestedAction: 'create',
    }
  }

  // No category action needed
  return {
    categoryId: null,
    autoAssigned: false,
    requiresConfirmation: false,
    suggestedAction: 'none',
  }
}

/**
 * Create a new category and assign it to a note
 */
export async function createAndAssignCategory(
  noteId: string,
  userId: string,
  categoryName: string
): Promise<{ success: boolean; categoryId?: string; error?: string }> {
  try {
    // Create new category
    const { data: newCategory, error: categoryError } = await supabase
      .from('categories')
      .insert({
        user_id: userId,
        name: categoryName,
      })
      .select()
      .single()

    if (categoryError || !newCategory) {
      return {
        success: false,
        error: categoryError?.message || 'Failed to create category',
      }
    }

    // Assign category to note
    const { error: updateError } = await supabase
      .from('notes')
      .update({ category_id: newCategory.id })
      .eq('id', noteId)

    if (updateError) {
      return {
        success: false,
        error: updateError.message,
      }
    }

    return {
      success: true,
      categoryId: newCategory.id,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Fetch user's existing categories
 */
export async function fetchUserCategories(
  userId: string
): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, user_id, created_at')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}
