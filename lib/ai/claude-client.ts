/**
 * Claude API Client for iForgot ADHD Note-Taking App
 * Handles AI text classification, summarization, and entity extraction
 */

import Anthropic from '@anthropic-ai/sdk';

// Initialize Claude client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AIProcessingResult {
  themes: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  mood?: string;
  action_items: string[];
  category: {
    action: 'assign' | 'create';
    name: string;
    confidence: number;
  };
  summary?: string;
  entities?: {
    people?: string[];
    places?: string[];
    dates?: string[];
    tags?: string[];
  };
}

export interface ProcessNoteOptions {
  noteContent: string;
  existingCategories: string[];
  customPrompt?: string;
  extractEntities?: boolean;
  generateSummary?: boolean;
  detectMood?: boolean;
}

/**
 * Main function to process a note with Claude AI
 * Uses a single API call for efficiency
 */
export async function processNote({
  noteContent,
  existingCategories,
  customPrompt,
  extractEntities = true,
  generateSummary = true,
  detectMood = true,
}: ProcessNoteOptions): Promise<AIProcessingResult> {
  try {
    const prompt = customPrompt || buildDefaultPrompt({
      noteContent,
      existingCategories,
      extractEntities,
      generateSummary,
      detectMood,
    });

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract JSON from response
    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    const result = parseClaudeResponse(responseText);
    return result;
  } catch (error) {
    console.error('Error processing note with Claude:', error);
    throw new Error('Failed to process note with AI');
  }
}

/**
 * Build the default prompt for note processing
 * Designed to be human-friendly and optimized for ADHD users
 */
function buildDefaultPrompt({
  noteContent,
  existingCategories,
  extractEntities,
  generateSummary,
  detectMood,
}: {
  noteContent: string;
  existingCategories: string[];
  extractEntities: boolean;
  generateSummary: boolean;
  detectMood: boolean;
}): string {
  const categoriesList = existingCategories.length > 0
    ? existingCategories.join(', ')
    : 'No existing categories';

  return `You are helping an ADHD user organize their thoughts. Analyze this note and provide structured information.

Existing categories: ${categoriesList}

Note: "${noteContent}"

Analyze this note and return ONLY a valid JSON object with this exact structure:
{
  "themes": ["theme1", "theme2"],
  "sentiment": "positive" or "negative" or "neutral",
  ${detectMood ? '"mood": "a simple, empathetic description of the user\'s mood (e.g., \'excited\', \'overwhelmed\', \'focused\')",' : ''}
  "action_items": ["actionable task 1", "actionable task 2"],
  "category": {
    "action": "assign" or "create",
    "name": "Category Name",
    "confidence": 0.85
  }${generateSummary ? ',\n  "summary": "A brief, helpful summary in one sentence"' : ''}${extractEntities ? ',\n  "entities": {\n    "people": ["person names mentioned"],\n    "places": ["locations mentioned"],\n    "dates": ["dates or time references"],\n    "tags": ["relevant hashtags or keywords"]\n  }' : ''}
}

Guidelines:
- For category: If the note fits an existing category well (>80% confidence), use "assign". Otherwise, suggest a new category name with "create"
- Keep themes simple and relatable (2-3 max)
- Action items should be clear, actionable tasks extracted from the note
- Be empathetic and understanding - this user may be overwhelmed
- Return ONLY the JSON object, no other text`;
}

/**
 * Parse Claude's response and extract structured data
 */
function parseClaudeResponse(response: string): AIProcessingResult {
  try {
    // Extract JSON from response (handle cases where Claude adds explanation)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate and return with defaults
    return {
      themes: parsed.themes || [],
      sentiment: parsed.sentiment || 'neutral',
      mood: parsed.mood,
      action_items: parsed.action_items || [],
      category: {
        action: parsed.category?.action || 'create',
        name: parsed.category?.name || 'Uncategorized',
        confidence: parsed.category?.confidence || 0.5,
      },
      summary: parsed.summary,
      entities: parsed.entities,
    };
  } catch (error) {
    console.error('Error parsing Claude response:', error);
    // Return safe defaults
    return {
      themes: [],
      sentiment: 'neutral',
      action_items: [],
      category: {
        action: 'create',
        name: 'Uncategorized',
        confidence: 0.0,
      },
    };
  }
}

/**
 * Simplified function for quick mood and category detection
 * Perfect for simple use cases
 */
export async function quickAnalyze(noteContent: string, existingCategories: string[] = []) {
  return processNote({
    noteContent,
    existingCategories,
    extractEntities: false,
    generateSummary: false,
    detectMood: true,
  });
}
