/**
 * Custom Prompt Templates for iForgot
 * Easy-to-use templates for different note analysis scenarios
 */

export interface PromptTemplate {
  name: string;
  description: string;
  buildPrompt: (params: PromptParams) => string;
}

export interface PromptParams {
  noteContent: string;
  existingCategories: string[];
  userContext?: string;
}

/**
 * Collection of pre-built prompt templates
 * Users can easily customize these or create their own
 */
export const promptTemplates = {
  /**
   * Simple mood and category analysis
   * Perfect for quick journaling
   */
  moodAndCategory: {
    name: 'Mood & Category',
    description: 'Detects mood and assigns a simple category',
    buildPrompt: ({ noteContent, existingCategories }: PromptParams) => `
You are a supportive AI assistant for someone with ADHD. Analyze this note with empathy.

Existing categories: ${existingCategories.join(', ') || 'None'}
Note: "${noteContent}"

Return ONLY a JSON object:
{
  "mood": "a warm, understanding description of their mood",
  "sentiment": "positive/negative/neutral",
  "themes": ["main theme"],
  "category": {
    "action": "assign" or "create",
    "name": "simple category name",
    "confidence": 0.9
  },
  "action_items": []
}

Be kind and supportive. This person is doing great by taking notes!
    `.trim(),
  },

  /**
   * Task extraction focused
   * Great for work notes and todo lists
   */
  taskFocused: {
    name: 'Task Extraction',
    description: 'Extracts actionable tasks and priorities',
    buildPrompt: ({ noteContent, existingCategories }: PromptParams) => `
Extract actionable tasks from this note. Be specific and clear.

Existing categories: ${existingCategories.join(', ') || 'None'}
Note: "${noteContent}"

Return ONLY a JSON object:
{
  "action_items": ["clear, actionable task 1", "task 2", "task 3"],
  "themes": ["work", "personal", etc],
  "sentiment": "positive/negative/neutral",
  "category": {
    "action": "assign" or "create",
    "name": "Work" or "Personal" or other,
    "confidence": 0.85
  },
  "summary": "one-line summary of what needs to be done"
}

Make tasks clear and actionable. Break down complex items.
    `.trim(),
  },

  /**
   * Creative journaling
   * Focuses on emotions and personal growth
   */
  journaling: {
    name: 'Personal Journal',
    description: 'Empathetic analysis for personal journaling',
    buildPrompt: ({ noteContent, existingCategories }: PromptParams) => `
This is a personal journal entry. Analyze with deep empathy and understanding.

Existing categories: ${existingCategories.join(', ') || 'None'}
Note: "${noteContent}"

Return ONLY a JSON object:
{
  "mood": "empathetic mood description",
  "sentiment": "positive/negative/neutral",
  "themes": ["emotional theme 1", "theme 2"],
  "category": {
    "action": "assign" or "create",
    "name": "appropriate journal category",
    "confidence": 0.8
  },
  "summary": "supportive, kind summary",
  "action_items": ["any self-care or follow-up items"],
  "entities": {
    "people": ["people mentioned"],
    "dates": ["time references"]
  }
}

Be warm, non-judgmental, and supportive. Validate their feelings.
    `.trim(),
  },

  /**
   * Meeting notes
   * Structured for professional contexts
   */
  meetingNotes: {
    name: 'Meeting Notes',
    description: 'Structured analysis for meetings and discussions',
    buildPrompt: ({ noteContent, existingCategories }: PromptParams) => `
Extract key information from these meeting notes.

Existing categories: ${existingCategories.join(', ') || 'None'}
Note: "${noteContent}"

Return ONLY a JSON object:
{
  "themes": ["meeting topic 1", "topic 2"],
  "sentiment": "positive/negative/neutral",
  "action_items": ["clear action item with owner if mentioned"],
  "category": {
    "action": "assign" or "create",
    "name": "Meetings" or specific meeting type,
    "confidence": 0.9
  },
  "summary": "brief meeting summary",
  "entities": {
    "people": ["attendees or mentioned people"],
    "dates": ["deadlines or future meeting dates"],
    "tags": ["key topics or projects"]
  }
}

Be clear and organized. Highlight what requires follow-up.
    `.trim(),
  },

  /**
   * Quick capture
   * Minimal processing for fast note-taking
   */
  quickCapture: {
    name: 'Quick Capture',
    description: 'Fast, minimal analysis for quick thoughts',
    buildPrompt: ({ noteContent, existingCategories }: PromptParams) => `
Quick analysis of this thought:

Note: "${noteContent}"
Categories: ${existingCategories.join(', ') || 'None'}

Return ONLY a JSON object:
{
  "themes": ["one main theme"],
  "sentiment": "positive/negative/neutral",
  "category": {
    "action": "assign" or "create",
    "name": "best fit category",
    "confidence": 0.7
  },
  "action_items": []
}

Keep it simple and fast.
    `.trim(),
  },
};

/**
 * Build a custom prompt with your own template
 * @example
 * const prompt = buildCustomPrompt(
 *   "Analyze this note for anxiety triggers",
 *   { noteContent, existingCategories }
 * );
 */
export function buildCustomPrompt(
  customInstruction: string,
  params: PromptParams
): string {
  return `
${customInstruction}

Existing categories: ${params.existingCategories.join(', ') || 'None'}
Note: "${params.noteContent}"
${params.userContext ? `Context: ${params.userContext}` : ''}

Return ONLY a valid JSON object with this structure:
{
  "themes": ["theme1", "theme2"],
  "sentiment": "positive/negative/neutral",
  "mood": "mood description",
  "action_items": ["task1", "task2"],
  "category": {
    "action": "assign" or "create",
    "name": "Category Name",
    "confidence": 0.0-1.0
  },
  "summary": "brief summary",
  "entities": {
    "people": [],
    "places": [],
    "dates": [],
    "tags": []
  }
}
  `.trim();
}

/**
 * Get a prompt template by name
 */
export function getPromptTemplate(name: keyof typeof promptTemplates): PromptTemplate {
  return promptTemplates[name];
}

/**
 * List all available templates
 */
export function listTemplates() {
  return Object.entries(promptTemplates).map(([key, template]) => ({
    key,
    name: template.name,
    description: template.description,
  }));
}
