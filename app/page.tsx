"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Folder as FolderIcon,
  ChevronDown,
  Trash2,
  ImagePlus,
  Share2,
  Save,
} from "lucide-react";
import TipTapEditor from "@/components/TipTapEditor";
import { Note, Category } from "@/types";

const SidebarItem = ({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={`group flex items-center gap-3 w-full rounded-xl px-3 py-2 text-sm cursor-pointer select-none
    ${active ? "bg-neutral-800/60 text-white" : "text-neutral-300 hover:bg-neutral-800/40 hover:text-white"}`}
  >
    <Icon size={18} className="shrink-0" />
    <span className="truncate">{label}</span>
  </div>
);

const NoteItem = ({
  note,
  isActive,
  onClick,
}: {
  note: Note;
  isActive: boolean;
  onClick: () => void;
}) => {
  const preview = note.content
    .replace(/<[^>]*>/g, "")
    .slice(0, 50);

  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-3 px-3 py-2 rounded-lg cursor-pointer ${
        isActive
          ? "bg-neutral-800/60 text-white"
          : "text-neutral-300 hover:text-white hover:bg-neutral-800/40"
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">
          {preview || "Untitled note"}
        </div>
        {note.category && (
          <div className="text-xs text-neutral-400 truncate">
            {note.category.name}
          </div>
        )}
      </div>
    </div>
  );
};

const CategoryItem = ({
  category,
  notesCount,
  isActive,
  onClick,
}: {
  category: Category;
  notesCount: number;
  isActive: boolean;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
      isActive
        ? "bg-neutral-800/60 text-white"
        : "text-neutral-300 hover:text-white hover:bg-neutral-800/40"
    }`}
  >
    <FolderIcon size={18} className="shrink-0" />
    <span className="truncate flex-1">{category.name}</span>
    <span className="text-xs text-neutral-400">{notesCount}</span>
  </div>
);

export default function Page() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  // AI features disabled - see DISABLED_FEATURES.md
  // const [saveWarning, setSaveWarning] = useState<string | null>(null);
  const [userId] = useState("00000000-0000-0000-0000-000000000001"); // Demo UUID for MVP (bypasses auth)

  const activeNote = notes.find((n) => n.id === activeNoteId);

  // Fetch categories and notes on mount
  useEffect(() => {
    fetchCategories();
    fetchNotes();
  }, []);

  // Update editor when active note changes
  useEffect(() => {
    if (activeNote) {
      setEditorContent(activeNote.content);
    }
  }, [activeNote]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/categories?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchNotes = async (categoryId?: string) => {
    try {
      const url = categoryId
        ? `/api/notes?userId=${userId}&categoryId=${categoryId}`
        : `/api/notes?userId=${userId}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setNotes(data.notes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const createNewNote = async () => {
    const emptyContent = "<p></p>";
    setEditorContent(emptyContent);
    setActiveNoteId(null);
  };

  const saveNote = async () => {
    if (!editorContent.trim() || editorContent === "<p></p>") {
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    try {
      // Check if we're updating an existing note or creating a new one
      const isUpdating = activeNoteId !== null;
      const method = isUpdating ? "PUT" : "POST";
      const body = isUpdating
        ? JSON.stringify({
            noteId: activeNoteId,
            noteContent: editorContent,
            userId,
          })
        : JSON.stringify({
            noteContent: editorContent,
            userId,
          });

      const response = await fetch("/api/notes", {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      const data = await response.json();
      if (data.success) {
        await fetchNotes();
        await fetchCategories();
        setActiveNoteId(data.note.id);
      } else {
        setSaveError(data.error || "Failed to save note");
      }
    } catch (error) {
      console.error("Error saving note:", error);
      setSaveError(error instanceof Error ? error.message : "Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(
      selectedCategoryId === categoryId ? null : categoryId
    );
    fetchNotes(selectedCategoryId === categoryId ? undefined : categoryId);
  };

  const iconBtn =
    "inline-flex size-8 items-center justify-center rounded-md hover:bg-neutral-800/60 text-neutral-300";

  return (
    <div className="h-screen w-screen bg-neutral-950 text-neutral-100">
      <div className="flex h-full">
        {/* Sidebar */}
        <aside className="w-72 border-r border-white/10 h-full flex flex-col bg-neutral-950/90">
          <div className="px-4 pt-4 pb-3 text-neutral-200 text-sm font-semibold tracking-wide">
            iForgot
          </div>

          <div className="px-2 space-y-1">
            <SidebarItem icon={Plus} label="New note" onClick={createNewNote} />
            <SidebarItem icon={Search} label="Search notes" />
          </div>

          {/* Categories Section */}
          <div className="px-4 pt-6 pb-2 text-xs uppercase tracking-wider text-neutral-400">
            Categories
          </div>

          <div className="px-2 space-y-1 pb-2">
            {categories.map((category) => {
              const categoryNotesCount = notes.filter(
                (n) => n.category_id === category.id
              ).length;
              return (
                <CategoryItem
                  key={category.id}
                  category={category}
                  notesCount={categoryNotesCount}
                  isActive={selectedCategoryId === category.id}
                  onClick={() => handleCategoryClick(category.id)}
                />
              );
            })}
          </div>

          {/* Notes Section */}
          <div className="px-4 pt-4 pb-2 text-xs uppercase tracking-wider text-neutral-400">
            All Notes
          </div>

          <div className="flex-1 overflow-y-auto px-1">
            <div className="space-y-1 pr-1">
              {notes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  isActive={note.id === activeNoteId}
                  onClick={() => setActiveNoteId(note.id)}
                />
              ))}
            </div>
          </div>

          <div className="px-4 py-2 text-neutral-400">
            <div className="inline-flex items-center gap-2 text-xs hover:text-neutral-200 cursor-pointer">
              <ChevronDown size={16} />
              <span>More</span>
            </div>
          </div>

          <div className="mt-auto border-t border-white/10 px-4 py-3 flex items-center gap-3">
            <div className="size-7 rounded-full bg-gradient-to-br from-sky-400 to-blue-700" />
            <div className="min-w-0">
              <div className="text-sm truncate">Demo User</div>
              <div className="text-[11px] text-neutral-400">Free Plan</div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col">
          {/* Top bar */}
          <div className="flex items-center gap-3 px-6 py-3 border-b border-white/10">
            <div className="flex items-center gap-3 text-sm text-neutral-300">
              {activeNote?.category && (
                <span>
                  {activeNote.category.name} /{" "}
                  <span className="text-neutral-100">Note</span>
                </span>
              )}
              {!activeNote && (
                <span className="text-neutral-100">New Note</span>
              )}
            </div>

            {/* Far-right actions */}
            <div className="ml-auto flex items-center gap-1.5 text-neutral-300">
              <button
                onClick={saveNote}
                disabled={isSaving}
                className={`${iconBtn} ${
                  isSaving ? "opacity-50" : ""
                } flex items-center gap-2 px-3`}
                title="Save note"
              >
                <Save size={18} />
                <span className="text-sm">{isSaving ? "Saving..." : "Save"}</span>
              </button>
              <button className={iconBtn} title="Add image">
                <ImagePlus size={18} />
              </button>
              <button className={iconBtn} title="Share">
                <Share2 size={18} />
              </button>
              {activeNote && (
                <button
                  className="ml-2 inline-flex size-7 items-center justify-center rounded-md bg-neutral-800/70 hover:bg-neutral-700"
                  title="Delete note"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Error message */}
          {saveError && (
            <div className="mx-6 mt-3 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              <div className="font-semibold mb-1">Failed to save note</div>
              <div className="whitespace-pre-wrap">{saveError}</div>
            </div>
          )}

          {/* Editor */}
          <div className="flex-1 overflow-hidden">
            {activeNote && (
              <div className="pt-3 text-center text-xs text-neutral-400">
                Last edited: {new Date(activeNote.updated_at).toLocaleString()}
              </div>
            )}
            <TipTapEditor
              content={editorContent}
              onChange={setEditorContent}
              placeholder="Start typing your note..."
            />
          </div>
        </main>
      </div>
    </div>
  );
}
