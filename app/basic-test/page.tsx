'use client'

import { useState, useEffect } from 'react'

interface Note {
  id: string
  content: string
  created_at: string
}

export default function BasicTestPage() {
  const [noteContent, setNoteContent] = useState('')
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/simple-note')
      const data = await response.json()

      if (data.success) {
        setNotes(data.notes)
      } else {
        setError(data.error || 'Failed to fetch notes')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notes')
    }
  }

  const handleSave = async () => {
    if (!noteContent.trim()) {
      setError('Please enter some content')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/simple-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: noteContent,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setNoteContent('')
        // Refresh notes list
        await fetchNotes()
      } else {
        setError(data.error || 'Failed to save note')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save note')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">
            Basic Note Test - Supabase Integration
          </h1>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="note-content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Type your note:
              </label>
              <textarea
                id="note-content"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Enter your note here..."
              />
            </div>

            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : 'Save Note'}
            </button>

            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                Error: {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                Note saved successfully!
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Saved Notes</h2>

          {notes.length === 0 ? (
            <p className="text-gray-500 italic">No notes yet. Create your first note above!</p>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 border border-gray-200 rounded-md bg-gray-50"
                >
                  <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Created: {new Date(note.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
