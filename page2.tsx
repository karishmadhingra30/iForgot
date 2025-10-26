"use client";

import React from "react";
import {
  Plus,
  Search,
  Folder as FolderIcon,
  ChevronDown,
  Trash2,
  Type,
  List,
  ListOrdered,
  Table,
  Mic,
  ImagePlus,
  Share2,
} from "lucide-react";

const SidebarItem = ({
  icon: Icon,
  label,
  active = false,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) => (
  <div
    className={`group flex items-center gap-3 w-full rounded-xl px-3 py-2 text-sm cursor-pointer select-none
    ${
      active
        ? "bg-neutral-800/60 text-white"
        : "text-neutral-300 hover:bg-neutral-800/40 hover:text-white"
    }`}
  >
    <Icon size={18} className="shrink-0" />
    <span className="truncate">{label}</span>
  </div>
);

const NoteItem = ({
  label,
  isFolder = false,
}: {
  label: string;
  isFolder?: boolean;
}) => (
  <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800/40 cursor-pointer">
    {isFolder ? (
      <FolderIcon size={18} className="shrink-0" />
    ) : (
      <div className="w-[18px]" />
    )}
    <span className="truncate">{label}</span>
  </div>
);

export default function Page() {
  const notes = [
    { label: "New Folder", folder: true },
    { label: "Folder", folder: true },
    { label: "Folder", folder: true },
    { label: "AIPTW MI review", folder: false },
    { label: "Folder", folder: true },
    { label: "Using Atlas.ti for projects", folder: false },
    { label: "Folder", folder: true },
    { label: "Quantitative analysis sug…", folder: false },
    { label: "Consulting training overvi…", folder: false },
    { label: "Folder", folder: true },
    { label: "Consulting appointment c…", folder: false },
    { label: "Folder", folder: true },
    { label: "Quantitative analysis sug…", folder: false },
    { label: "Folder", folder: true },
    { label: "Consulting appointment c…", folder: false },
  ];

  const iconBtn =
    "inline-flex size-8 items-center justify-center rounded-md hover:bg-neutral-800/60";

  return (
    <div className="h-screen w-screen">
      <div className="flex h-full">
        {/* Sidebar */}
        <aside className="w-72 border-r border-white/10 h-full flex flex-col bg-neutral-950/90">
          <div className="px-4 pt-4 pb-3 text-neutral-200 text-sm font-semibold tracking-wide">
            iForgot
          </div>

          <div className="px-2 space-y-1">
            <SidebarItem icon={Plus} label="New chat" />
            <SidebarItem icon={Search} label="Search chats" />
          </div>

          <div className="px-4 pt-6 pb-2 text-xs uppercase tracking-wider text-neutral-400">
            Notes
          </div>

          <div className="flex-1 overflow-y-auto px-1">
            <div className="space-y-1 pr-1">
              {notes.map((n, i) => (
                <NoteItem key={i} label={n.label} isFolder={n.folder} />
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
              <div className="text-sm truncate">First Last Name</div>
              <div className="text-[11px] text-neutral-400">Plus</div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center gap-3 px-6 py-3 border-b border-white/10">
            <div className="flex items-center gap-3 text-sm text-neutral-300">
              <span>
                Folder / <span className="text-neutral-100">Name of Note</span>
              </span>
              <button
                className="ml-2 inline-flex size-7 items-center justify-center rounded-md bg-neutral-800/70 hover:bg-neutral-700"
                aria-label="Delete note"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Editing controls */}
            <div className="ml-auto flex items-center gap-1.5 text-neutral-300">
              <button className={iconBtn} title="Styling" aria-label="Styling">
                <Type size={18} />
              </button>
              <button
                className={iconBtn}
                title="Bulleted list"
                aria-label="Bulleted list"
              >
                <List size={18} />
              </button>
              <button
                className={iconBtn}
                title="Numbered list"
                aria-label="Numbered list"
              >
                <ListOrdered size={18} />
              </button>
              <button
                className={iconBtn}
                title="Insert table"
                aria-label="Insert table"
              >
                <Table size={18} />
              </button>
              <button className={iconBtn} title="Voice" aria-label="Voice">
                <Mic size={18} />
              </button>
            </div>

            {/* Far-right actions */}
            <div className="flex items-center gap-1.5 pl-2 text-neutral-300">
              <button
                className={iconBtn}
                title="Add image"
                aria-label="Add image"
              >
                <ImagePlus size={18} />
              </button>
              <button className={iconBtn} title="Share" aria-label="Share">
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* Scrollable text area */}
          <div className="flex-1 overflow-y-auto">
            {/* Centered Edited line */}
            <div className="pt-3 text-center text-xs text-neutral-400">
              Edited: October 24, 2025 at 9:14 AM
            </div>

            {/* Main note content */}
            <div className="max-w-4xl mx-16 my-6 leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-xl font-semibold mb-2">Stuff due soon:</h2>
                <ul className="list-disc pl-6 space-y-2 text-neutral-200">
                  <li>
                    Psych reading response — due Wednesday night. Haven’t
                    started. Should take ~30 mins if I actually focus. Maybe do
                    it right after lunch?
                  </li>
                  <li>
                    Stats homework — due Friday. It’s the one with the R code
                    and graphs. Need to ask Maya if she figured out that
                    regression part.
                  </li>
                  <li>
                    History essay — due next Monday. 1500 words. I have notes
                    but they’re all over Google Docs, Notion, and random
                    screenshots 😩. Need to gather them all in one place.
                  </li>
                </ul>
              </section>

              <section className="mt-6 space-y-2">
                <h2 className="text-xl font-semibold mb-2">
                  Reminders to self:
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-neutral-200">
                  <li>
                    CHECK CANVAS every morning. I keep missing stuff that gets
                    posted late.
                  </li>
                  <li>
                    Try the Pomodoro thing again — maybe 25 mins work / 5 min
                    break.
                  </li>
                  <li>
                    DO NOT start reorganizing my folders when I’m “about to”
                    start homework.
                  </li>
                  <li>
                    Coffee helps but only if I drink water too (note to self).
                  </li>
                  <li>
                    Finish one small task first — even if it’s just formatting
                    citations.
                  </li>
                </ul>
              </section>

              <section className="mt-6 space-y-2">
                <h2 className="text-xl font-semibold mb-2">
                  Plan for tonight:
                </h2>
                <ol className="list-decimal pl-6 space-y-2 text-neutral-200">
                  <li>
                    Find the psych reading link (Canvas → Week 6 → Reading #2 I
                    think).
                  </li>
                  <li>Do 1 Pomodoro of reading and jot 3 bullet points.</li>
                  <li>Reward = one episode of whatever I’m watching.</li>
                  <li>Then either quick clean-up or stop if I’m fried.</li>
                </ol>
              </section>

              <section className="mt-6 space-y-2">
                <h2 className="text-xl font-semibold mb-2">Misc:</h2>
                <ul className="list-disc pl-6 space-y-2 text-neutral-200">
                  <li>Bring laptop charger to library this time.</li>
                  <li>
                    Check planner app thing I downloaded and immediately forgot
                    about.
                  </li>
                </ul>
              </section>

              <div className="h-24" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
