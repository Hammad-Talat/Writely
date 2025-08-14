import React, { useEffect, useMemo, useState } from "react";

export default function BlogForm({ initial = null, onSubmit, submitting }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [content, setContent] = useState(initial?.content || "");
  const [tagsInput, setTagsInput] = useState(Array.isArray(initial?.tags) ? initial.tags.join(", ") : "");
  const [isPublished, setIsPublished] = useState(!!initial?.is_published);

  useEffect(() => {
    if (!initial) return;
    setTitle(initial.title || "");
    setContent(initial.content || "");
    setTagsInput(Array.isArray(initial.tags) ? initial.tags.join(", ") : "");
    setIsPublished(!!initial.is_published);
  }, [initial]);

  const tags = useMemo(() => {
    const arr = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
    return arr.length ? arr : null;
  }, [tagsInput]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), content, tags, is_published: isPublished });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <label className="grid gap-1">
        <span className="text-sm text-white/70">Title</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Amazing post title"
          className="rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/40 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/30"
        />
      </label>

        <label className="mb-1 block text-sm text-white/70">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          placeholder="Write your story…"
          className="rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/40 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/30"
        />

      <label className="grid gap-1">
        <span className="text-sm text-white/70">Tags (comma separated)</span>
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="react, django, life"
          className="rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/40 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/30"
        />
      </label>

      <label className="inline-flex items-center gap-2">
        <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
        <span className="text-sm text-white/80">Publish now</span>
      </label>

      <div className="flex justify-end gap-2">
        <button type="submit" disabled={submitting}
          className="rounded-xl bg-white px-4 py-2 font-medium text-neutral-950 disabled:opacity-60">
          {initial ? (submitting ? "Saving…" : "Save changes") : (submitting ? "Publishing…" : "Create post")}
        </button>
      </div>
    </form>
  );
}
