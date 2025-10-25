import Anthropic from '@anthropic-ai/sdk'
import { AIProcessingResult } from '@/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export async function processNoteWithClaude(
  noteContent: string,
  existingCategories: string[]
): Promise<AIProcessingResult> {
  const prompt = `
Existing categories: ${existingCategories.join(', ')}
Note: "${noteContent}"

Analyze and return JSON:
{
  "themes": ["theme1", "theme2"],
  "sentiment": "positive/negative/neutral",
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
}
