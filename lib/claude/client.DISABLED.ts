// ============================================================================
// ⚠️  THIS FILE IS INTENTIONALLY DISABLED - DO NOT USE ⚠️
// ============================================================================
// This file has been renamed with .DISABLED.ts extension to prevent imports.
// AI features are temporarily disabled while we stabilize core note functionality.
//
// STATUS: DISABLED
// REASON: Focusing on core save/load functionality first
// RE-ENABLE: See DISABLED_FEATURES.md for step-by-step instructions
//
// FOR CLAUDE SESSIONS: Do NOT rename or enable this file unless explicitly
// requested by the user. This is an intentional architectural decision.
// ============================================================================

import Anthropic from '@anthropic-ai/sdk'
import { AIProcessingResult } from '@/types'

// Check if API key is configured
const hasApiKey = !!process.env.ANTHROPIC_API_KEY

const anthropic = hasApiKey
  ? new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    })
  : null

/**
 * Returns a default AI result when Claude API is not available
 */
function getDefaultAIResult(): AIProcessingResult {
  return {
    themes: [],
    action_items: [],
    category: {
      action: 'create',
      name: 'Uncategorized',
      confidence: 0,
    },
  }
}

export async function processNoteWithClaude(
  noteContent: string,
  existingCategories: string[]
): Promise<AIProcessingResult> {
  // If no API key, return default result (graceful degradation)
  if (!anthropic || !hasApiKey) {
    console.warn(
      '⚠️ ANTHROPIC_API_KEY not configured. Saving note without AI processing.'
    )
    return getDefaultAIResult()
  }

  try {
    const prompt = `
Existing categories: ${existingCategories.join(', ')}
Note: "${noteContent}"

Analyze and return JSON:
{
  "themes": ["theme1", "theme2"],
  "action_items": ["task1", "task2"],
  "category": {
    "action": "assign" or "create",
    "name": "Category Name",
    "confidence": 0.85
  }
}

Rules:
- If confidence > 0.8 and category exists, use "assign"
- If confidence < 0.8 or category doesn't exist, use "create"
- Extract 2-4 themes
- Identify action items if present
- Return only valid JSON
`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const textContent = message.content.find((block) => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude')
    }

    const result = JSON.parse(textContent.text) as AIProcessingResult
    return result
  } catch (error) {
    // If Claude API fails, log the error but don't fail the save
    console.error('Claude API error (falling back to default):', error)
    return getDefaultAIResult()
  }
}
