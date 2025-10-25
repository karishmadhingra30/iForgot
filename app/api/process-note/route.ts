/**
 * API Route: /api/process-note
 * Processes notes with Claude AI for categorization and analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import { processNote } from '@/lib/ai/claude-client';
import { promptTemplates } from '@/lib/ai/prompt-templates';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      noteContent,
      existingCategories = [],
      templateName = null,
      customPrompt = null,
      options = {},
    } = body;

    // Validate input
    if (!noteContent || noteContent.trim().length === 0) {
      return NextResponse.json(
        { error: 'Note content is required' },
        { status: 400 }
      );
    }

    // Build custom prompt if template is specified
    let prompt = customPrompt;
    if (templateName && promptTemplates[templateName as keyof typeof promptTemplates]) {
      const template = promptTemplates[templateName as keyof typeof promptTemplates];
      prompt = template.buildPrompt({
        noteContent,
        existingCategories,
      });
    }

    // Process the note with Claude
    const result = await processNote({
      noteContent,
      existingCategories,
      customPrompt: prompt,
      extractEntities: options.extractEntities ?? true,
      generateSummary: options.generateSummary ?? true,
      detectMood: options.detectMood ?? true,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error in /api/process-note:', error);

    return NextResponse.json(
      {
        error: 'Failed to process note',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve available templates
export async function GET() {
  const templates = Object.entries(promptTemplates).map(([key, template]) => ({
    key,
    name: template.name,
    description: template.description,
  }));

  return NextResponse.json({
    templates,
  });
}
