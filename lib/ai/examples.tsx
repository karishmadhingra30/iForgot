/**
 * Example usage of iForgot AI features in React components
 * These examples show how to integrate the AI functionality into your UI
 */

'use client';

import { useState } from 'react';
import { AIProcessingResult } from './claude-client';
import {
  getMoodEmoji,
  shouldAutoAssignCategory,
  formatAIResult,
  generateNotificationMessage,
} from './helpers';

/**
 * Example 1: Simple Note Processing Component
 */
export function SimpleNoteProcessor() {
  const [noteContent, setNoteContent] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<AIProcessingResult | null>(null);

  const handleSubmit = async () => {
    setProcessing(true);

    try {
      const response = await fetch('/api/process-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteContent,
          existingCategories: ['Work', 'Personal', 'Ideas'],
        }),
      });

      const { data } = await response.json();
      setResult(data);

      // Handle categorization
      if (shouldAutoAssignCategory(data.category.confidence)) {
        console.log(`Auto-assigning to: ${data.category.name}`);
        // Save note with category
      } else {
        console.log('Need user confirmation for category');
        // Show modal
      }
    } catch (error) {
      console.error('Error processing note:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-4">
      <textarea
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        placeholder="Write your note here..."
        className="w-full p-2 border rounded"
        rows={4}
      />

      <button
        onClick={handleSubmit}
        disabled={processing || !noteContent}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        {processing ? 'Processing...' : 'Save Note'}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold">Analysis Result:</h3>
          <pre className="text-sm whitespace-pre-wrap">
            {formatAIResult(result)}
          </pre>
        </div>
      )}
    </div>
  );
}

/**
 * Example 2: Mood Tracking Component
 */
export function MoodTracker() {
  const [noteContent, setNoteContent] = useState('');
  const [mood, setMood] = useState<string | null>(null);
  const [emoji, setEmoji] = useState<string>('');

  const analyzeMood = async () => {
    const response = await fetch('/api/process-note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        noteContent,
        templateName: 'moodAndCategory', // Use mood-focused template
        options: {
          detectMood: true,
          extractEntities: false,
          generateSummary: false,
        },
      }),
    });

    const { data } = await response.json();
    setMood(data.mood);
    setEmoji(getMoodEmoji(data.mood));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">How are you feeling?</h2>

      <textarea
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        placeholder="Express your thoughts..."
        className="w-full p-2 border rounded"
        rows={3}
      />

      <button
        onClick={analyzeMood}
        className="mt-2 px-4 py-2 bg-purple-500 text-white rounded"
      >
        Analyze Mood
      </button>

      {mood && (
        <div className="mt-4 text-center">
          <div className="text-6xl mb-2">{emoji}</div>
          <p className="text-lg font-semibold">{mood}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Example 3: Category Decision Modal
 */
export function CategoryDecisionModal({
  isOpen,
  categoryName,
  confidence,
  action,
  onConfirm,
  onSkip,
}: {
  isOpen: boolean;
  categoryName: string;
  confidence: number;
  action: 'assign' | 'create';
  onConfirm: () => void;
  onSkip: () => void;
}) {
  if (!isOpen) return null;

  const confidencePercent = Math.round(confidence * 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md">
        <h3 className="text-xl font-bold mb-4">
          {action === 'create' ? 'Create New Category?' : 'Assign Category?'}
        </h3>

        <p className="mb-4">
          {action === 'create'
            ? `Create new category "${categoryName}"?`
            : `Assign to "${categoryName}"?`}
        </p>

        <p className="text-sm text-gray-600 mb-4">
          Confidence: {confidencePercent}%
        </p>

        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded"
          >
            {action === 'create' ? 'Create & Assign' : 'Assign'}
          </button>
          <button
            onClick={onSkip}
            className="flex-1 px-4 py-2 bg-gray-300 rounded"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Example 4: Action Items Extractor
 */
export function ActionItemsExtractor() {
  const [noteContent, setNoteContent] = useState('');
  const [actionItems, setActionItems] = useState<string[]>([]);

  const extractTasks = async () => {
    const response = await fetch('/api/process-note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        noteContent,
        templateName: 'taskFocused', // Use task-focused template
        existingCategories: ['Work', 'Personal'],
      }),
    });

    const { data } = await response.json();
    setActionItems(data.action_items);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Extract Tasks</h2>

      <textarea
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        placeholder="Paste your meeting notes or thoughts..."
        className="w-full p-2 border rounded"
        rows={5}
      />

      <button
        onClick={extractTasks}
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
      >
        Extract Action Items
      </button>

      {actionItems.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Action Items:</h3>
          <ul className="list-disc list-inside">
            {actionItems.map((item, index) => (
              <li key={index} className="mb-1">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Example 5: Custom Template Selector
 */
export function TemplateSelector() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [noteContent, setNoteContent] = useState('');
  const [result, setResult] = useState<AIProcessingResult | null>(null);

  // Fetch available templates
  const fetchTemplates = async () => {
    const response = await fetch('/api/process-note');
    const { templates } = await response.json();
    setTemplates(templates);
  };

  const processWithTemplate = async () => {
    const response = await fetch('/api/process-note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        noteContent,
        templateName: selectedTemplate,
        existingCategories: ['Work', 'Personal', 'Health', 'Ideas'],
      }),
    });

    const { data } = await response.json();
    setResult(data);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Choose Analysis Type</h2>

      <button onClick={fetchTemplates} className="mb-4 px-4 py-2 bg-gray-200 rounded">
        Load Templates
      </button>

      {templates.length > 0 && (
        <select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">Select a template...</option>
          {templates.map((template) => (
            <option key={template.key} value={template.key}>
              {template.name} - {template.description}
            </option>
          ))}
        </select>
      )}

      <textarea
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        placeholder="Your note..."
        className="w-full p-2 border rounded"
        rows={4}
      />

      <button
        onClick={processWithTemplate}
        disabled={!selectedTemplate || !noteContent}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        Process with {selectedTemplate || 'Template'}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre className="text-sm whitespace-pre-wrap">
            {formatAIResult(result)}
          </pre>
        </div>
      )}
    </div>
  );
}

/**
 * Example 6: Complete Note Creation Flow
 */
export function CompleteNoteFlow() {
  const [noteContent, setNoteContent] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [aiResult, setAiResult] = useState<AIProcessingResult | null>(null);

  const handleSaveNote = async () => {
    setProcessing(true);

    try {
      // 1. Process with AI
      const response = await fetch('/api/process-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteContent,
          existingCategories: ['Work', 'Personal', 'Health', 'Ideas'],
          templateName: 'moodAndCategory',
        }),
      });

      const { data } = await response.json();
      setAiResult(data);

      // 2. Check if we need user confirmation
      if (shouldAutoAssignCategory(data.category.confidence)) {
        // Auto-save with category
        await saveNoteToDatabase(data);
        showSuccessNotification(data);
      } else {
        // Show confirmation modal
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process note');
    } finally {
      setProcessing(false);
    }
  };

  const saveNoteToDatabase = async (data: AIProcessingResult) => {
    // This would be your actual database save logic
    console.log('Saving note with data:', data);
    // await fetch('/api/notes', { method: 'POST', body: JSON.stringify({ ...data, content: noteContent }) });
  };

  const showSuccessNotification = (data: AIProcessingResult) => {
    const notification = generateNotificationMessage(data);
    alert(`${notification.title}: ${notification.message}`);
    // In real app, use a toast notification library
  };

  const handleConfirmCategory = async () => {
    if (aiResult) {
      await saveNoteToDatabase(aiResult);
      setShowModal(false);
      showSuccessNotification(aiResult);
      setNoteContent('');
      setAiResult(null);
    }
  };

  const handleSkipCategory = async () => {
    if (aiResult) {
      // Save without category
      await saveNoteToDatabase({
        ...aiResult,
        category: { action: 'create', name: 'Uncategorized', confidence: 0 },
      });
      setShowModal(false);
      setNoteContent('');
      setAiResult(null);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Note</h1>

      <textarea
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        placeholder="Start typing or use voice input..."
        className="w-full p-3 border rounded-lg"
        rows={6}
      />

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleSaveNote}
          disabled={processing || !noteContent}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
        >
          {processing ? 'Processing...' : 'Save Note'}
        </button>

        <button
          onClick={() => setNoteContent('')}
          className="px-6 py-2 bg-gray-200 rounded-lg"
        >
          Clear
        </button>
      </div>

      {aiResult && showModal && (
        <CategoryDecisionModal
          isOpen={showModal}
          categoryName={aiResult.category.name}
          confidence={aiResult.category.confidence}
          action={aiResult.category.action}
          onConfirm={handleConfirmCategory}
          onSkip={handleSkipCategory}
        />
      )}
    </div>
  );
}

/**
 * Example 7: Quick Mood Check-in (ADHD-friendly)
 */
export function QuickMoodCheckIn() {
  const [thought, setThought] = useState('');
  const [saved, setSaved] = useState(false);

  const quickSave = async () => {
    // Ultra-minimal UI for ADHD users
    const response = await fetch('/api/process-note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        noteContent: thought,
        templateName: 'quickCapture',
        options: {
          extractEntities: false,
          generateSummary: false,
          detectMood: true,
        },
      }),
    });

    const { data } = await response.json();

    // Auto-save without confirmation (low friction)
    await fetch('/api/notes', {
      method: 'POST',
      body: JSON.stringify({
        content: thought,
        mood: data.mood,
        category: data.category.name,
      }),
    });

    // Visual feedback
    setSaved(true);
    setTimeout(() => {
      setThought('');
      setSaved(false);
    }, 2000);
  };

  return (
    <div className="p-4">
      {saved ? (
        <div className="text-center">
          <div className="text-6xl mb-2">✅</div>
          <p className="text-xl font-semibold">Saved!</p>
        </div>
      ) : (
        <>
          <input
            type="text"
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && quickSave()}
            placeholder="Quick thought..."
            className="w-full p-3 text-lg border-2 rounded-lg"
            autoFocus
          />
          <p className="text-sm text-gray-500 mt-2">Press Enter to save</p>
        </>
      )}
    </div>
  );
}
