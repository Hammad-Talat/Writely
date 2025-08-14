import React, { useEffect, useState } from "react";

export default function BlogForm({ initial = null, onSubmit, submitting = false }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
    is_published: false,
  });

  useEffect(() => {
    if (!initial) return;
    setForm({
      title: initial.title || "",
      content: initial.content || "",
      tags: Array.isArray(initial.tags) ? initial.tags.join(", ") : (initial.tags || ""),
      is_published: !!initial.is_published,
    });
  }, [initial]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function submit(e) {
    e.preventDefault();
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSubmit({
      title: form.title,
      content: form.content,
      tags,
      is_published: form.is_published,
    });
  }

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-4xl space-y-5 px-4 sm:px-6">
      <div>
        <label className="mb-1 block text-sm text-white/70">Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Amazing post title"
          className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-white/50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/30"
          required
        />
      </div>

      {/* Content */}
      <div>
        <label className="mb-1 block text-sm text-white/70">Content</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          rows={14}
          placeholder="Write your story..."
          className="w-full resize-y rounded-xl bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/30"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-white/70">Tags (comma separated)</label>
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="react, django, life"
          className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-white/50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/30"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            name="is_published"
            checked={form.is_published}
            onChange={handleChange}
            className="size-4 accent-white"
          />
          Publish now
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-white px-5 py-2 font-medium text-neutral-900 shadow hover:shadow-md disabled:opacity-60"
        >
          {submitting ? "Saving…" : initial ? "Update post" : "Create post"}
        </button>
      </div>
    </form>
  );
}
