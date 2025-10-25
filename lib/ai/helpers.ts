/**
 * Helper functions for AI analysis
 * Mood detection, sentiment analysis, and categorization utilities
 */

import { AIProcessingResult } from './claude-client';

/**
 * Mood emoji mapping for visual feedback
 * Perfect for ADHD users who benefit from visual cues
 */
export const moodEmojis: Record<string, string> = {
  // Positive moods
  excited: '🎉',
  happy: '😊',
  grateful: '🙏',
  accomplished: '✨',
  motivated: '💪',
  focused: '🎯',
  calm: '😌',
  energetic: '⚡',
  inspired: '💡',
  proud: '🌟',

  // Neutral moods
  neutral: '😐',
  tired: '😴',
  busy: '📋',
  thoughtful: '🤔',
  curious: '🧐',

  // Negative moods
  overwhelmed: '😰',
  anxious: '😟',
  stressed: '😓',
  frustrated: '😤',
  sad: '😢',
  confused: '😕',
  scattered: '🌀',
  worried: '😨',
};

/**
 * Get emoji for a mood description
 */
export function getMoodEmoji(mood: string): string {
  const normalizedMood = mood.toLowerCase().trim();

  // Try exact match first
  if (moodEmojis[normalizedMood]) {
    return moodEmojis[normalizedMood];
  }

  // Try partial match
  for (const [key, emoji] of Object.entries(moodEmojis)) {
    if (normalizedMood.includes(key) || key.includes(normalizedMood)) {
      return emoji;
    }
  }

  // Default emoji based on sentiment
  return '📝';
}

/**
 * Get sentiment emoji
 */
export function getSentimentEmoji(sentiment: 'positive' | 'negative' | 'neutral'): string {
  const sentimentMap = {
    positive: '😊',
    negative: '😔',
    neutral: '😐',
  };
  return sentimentMap[sentiment];
}

/**
 * Determine if a category should be auto-assigned based on confidence
 * @param confidence - Confidence score from 0 to 1
 * @param threshold - Minimum confidence for auto-assignment (default: 0.8)
 */
export function shouldAutoAssignCategory(
  confidence: number,
  threshold: number = 0.8
): boolean {
  return confidence >= threshold;
}

/**
 * Format the AI result for display
 * Returns a user-friendly summary
 */
export function formatAIResult(result: AIProcessingResult): string {
  const parts: string[] = [];

  if (result.mood) {
    const emoji = getMoodEmoji(result.mood);
    parts.push(`${emoji} Mood: ${result.mood}`);
  }

  if (result.summary) {
    parts.push(`📝 ${result.summary}`);
  }

  if (result.themes.length > 0) {
    parts.push(`🏷️ Themes: ${result.themes.join(', ')}`);
  }

  if (result.action_items.length > 0) {
    parts.push(`✅ Tasks: ${result.action_items.length} action item(s)`);
  }

  parts.push(
    `📁 Category: ${result.category.name} (${Math.round(result.category.confidence * 100)}% confident)`
  );

  return parts.join('\n');
}

/**
 * Extract people mentions from note content
 * Simple regex-based extraction for @mentions and names
 */
export function extractMentions(noteContent: string): string[] {
  const mentions: string[] = [];

  // Extract @mentions
  const atMentions = noteContent.match(/@(\w+)/g);
  if (atMentions) {
    mentions.push(...atMentions.map((m) => m.slice(1)));
  }

  return [...new Set(mentions)]; // Remove duplicates
}

/**
 * Extract hashtags from note content
 */
export function extractHashtags(noteContent: string): string[] {
  const hashtags = noteContent.match(/#(\w+)/g);
  if (!hashtags) return [];
  return [...new Set(hashtags.map((tag) => tag.slice(1)))];
}

/**
 * Determine the urgency level of a note based on content
 * Returns: 'high', 'medium', or 'low'
 */
export function detectUrgency(noteContent: string, actionItems: string[]): 'high' | 'medium' | 'low' {
  const urgentKeywords = [
    'urgent', 'asap', 'emergency', 'critical', 'now', 'immediately',
    'today', 'deadline', 'important', 'must', 'need to'
  ];

  const content = noteContent.toLowerCase();
  const urgentCount = urgentKeywords.filter(keyword => content.includes(keyword)).length;

  // High urgency if multiple urgent keywords or urgent keywords + action items
  if (urgentCount >= 2 || (urgentCount >= 1 && actionItems.length > 0)) {
    return 'high';
  }

  // Medium urgency if action items exist or one urgent keyword
  if (actionItems.length > 0 || urgentCount === 1) {
    return 'medium';
  }

  return 'low';
}

/**
 * Get color for category confidence level
 * Returns Tailwind CSS color class
 */
export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return 'text-green-600';
  if (confidence >= 0.6) return 'text-yellow-600';
  return 'text-red-600';
}

/**
 * Check if note needs user review before categorization
 */
export function needsReview(result: AIProcessingResult): boolean {
  return (
    result.category.action === 'create' ||
    result.category.confidence < 0.8 ||
    result.action_items.length > 3 // Many tasks might need review
  );
}

/**
 * Generate a user-friendly notification message
 */
export function generateNotificationMessage(result: AIProcessingResult): {
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
} {
  const shouldAutoAssign = shouldAutoAssignCategory(result.category.confidence);

  if (shouldAutoAssign) {
    return {
      title: 'Note Saved',
      message: `Categorized as "${result.category.name}" ${result.mood ? `• Mood: ${result.mood}` : ''}`,
      type: 'success',
    };
  }

  if (result.category.action === 'create') {
    return {
      title: 'New Category Suggested',
      message: `Create "${result.category.name}" category?`,
      type: 'info',
    };
  }

  return {
    title: 'Review Needed',
    message: `Not sure about category. Please review.`,
    type: 'warning',
  };
}

/**
 * Simple sentiment analysis score
 * Returns a score from -1 (very negative) to 1 (very positive)
 */
export function getSentimentScore(sentiment: 'positive' | 'negative' | 'neutral'): number {
  const scoreMap = {
    positive: 1,
    neutral: 0,
    negative: -1,
  };
  return scoreMap[sentiment];
}
