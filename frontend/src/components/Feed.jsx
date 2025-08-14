// src/components/Feed.jsx
import React, { useEffect, useMemo, useState } from "react";
import { FaHeart, FaEdit, FaTrash } from "react-icons/fa";
import Card from "./ui/card";
import Select from "./ui/Select";
import {
  listPosts, listComments, listLikesByUser, listAllLikes,
  likePost, unlikePost, createComment
} from "../services/posts";

export default function Feed({
  currentUser,
  writerExtras = false,
  onEditPost,
  onDeletePost,
  showOnlyPublished = true,
}) {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [likesMine, setLikesMine] = useState([]); 
  const [likesAll, setLikesAll] = useState([]);   

  const [q, setQ] = useState("");
  const [ordering, setOrdering] = useState("-created_at");

  const [commentTextByPost, setCommentTextByPost] = useState({});
  const [submittingComment, setSubmittingComment] = useState(false);

  async function refresh() {
    setLoading(true);
    const [p, c, lm, la] = await Promise.all([
      listPosts({ ordering }),
      listComments(),
      listLikesByUser(currentUser.id),
      listAllLikes(),
    ]);
    setPosts(p);
    setAllComments(c);
    setLikesMine(lm);
    setLikesAll(la);
    setLoading(false);
  }

  useEffect(() => { refresh(); }, [ordering]);

  const likedByMeSet = useMemo(() => new Set(likesMine.map(x => x.blog_post)), [likesMine]);
  const likeIdByPost = useMemo(() => {
    const m = new Map();
    likesMine.forEach(l => m.set(l.blog_post, l.id));
    return m;
  }, [likesMine]);
  const likeCountByPost = useMemo(() => {
    const counts = new Map();
    likesAll.forEach(l => counts.set(l.blog_post, (counts.get(l.blog_post) || 0) + 1));
    return counts;
  }, [likesAll]);
  const commentsByPost = useMemo(() => {
    const map = new Map();
    allComments.forEach(c => {
      const arr = map.get(c.blog_post) || [];
      arr.push(c);
      map.set(c.blog_post, arr);
    });
    return map;
  }, [allComments]);

  const visiblePosts = useMemo(() => {
    let arr = posts;
    if (showOnlyPublished) arr = arr.filter(p => p.is_published);
    if (!q) return arr;
    const n = q.toLowerCase();
    return arr.filter(p =>
      p.title.toLowerCase().includes(n) ||
      JSON.stringify(p.tags || []).toLowerCase().includes(n) ||
      (p.author_username || "").toLowerCase().includes(n)
    );
  }, [posts, q, showOnlyPublished]);

  async function toggleLike(postId) {
    if (likedByMeSet.has(postId)) {
      const lid = likeIdByPost.get(postId);
      await unlikePost(lid);
    } else {
      await likePost({ user: currentUser.id, blog_post: postId });
    }
    const [lm, la] = await Promise.all([listLikesByUser(currentUser.id), listAllLikes()]);
    setLikesMine(lm);
    setLikesAll(la);
  }

  async function submitComment(postId) {
    const text = (commentTextByPost[postId] || "").trim();
    if (!text) return;
    setSubmittingComment(true);
    try {
      await createComment({ user: currentUser.id, blog_post: postId, content: text });
      setCommentTextByPost(prev => ({ ...prev, [postId]: "" }));
      const c = await listComments();
      setAllComments(c);
    } finally {
      setSubmittingComment(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <header className="mb-6 sm:mb-8 pt-2 text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold">Feed</h1>
        <p className="mt-1 text-sm sm:text-base text-white/70">
          Latest writing with likes and discussion.
        </p>

        <div className="mx-auto mt-4 flex w-full max-w-2xl items-center justify-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, tag or author"
            className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-white/50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/30"
          />
         <div className="mx-auto mt-4 flex w-full max-w-2xl items-center justify-center gap-3">
  <Select
    value={ordering}
    onChange={(val) => setOrdering(val)}
    options={[
      { value: "-created_at", label: "Newest" },
      { value: "created_at", label: "Oldest" },
      { value: "title", label: "Title A→Z" },
    ]}
  />
</div>


        </div>
      </header>

      {loading && (
        <Card className="mx-auto w-full max-w-3xl text-center text-white/70">
          Loading feed…
        </Card>
      )}

      {!loading && (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {visiblePosts.map(post => {
              const isMine = post.author === currentUser.id;
              const liked = likedByMeSet.has(post.id);
              const likeCount = likeCountByPost.get(post.id) || 0;
              const comments = commentsByPost.get(post.id) || [];

              return (
                <Card key={post.id}>
                  <header className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold">{post.title}</div>
                      <div className="text-xs text-white/60">
                        by {post.author_username} • {new Date(post.created_at).toLocaleString()}
                      </div>
                      {Array.isArray(post.tags) && post.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {post.tags.map((t, i) => (
                            <span
                              key={i}
                              className="text-[11px] rounded-full bg-white/10 px-2 py-0.5 ring-1 ring-white/10"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {writerExtras && isMine && (onEditPost || onDeletePost) && (
                      <div className="shrink-0 flex gap-2">
                        {onEditPost && (
                          <button
                            onClick={() => onEditPost(post)}
                            className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1 ring-1 ring-white/10 hover:bg-white/15"
                            title="Edit"
                          >
                            <FaEdit /> Edit
                          </button>
                        )}
                        {onDeletePost && (
                          <button
                            onClick={() => onDeletePost(post.id)}
                            className="flex items-center gap-1 rounded-lg bg-red-500/90 px-3 py-1 text-white hover:bg-red-500"
                            title="Delete"
                          >
                            <FaTrash /> Delete
                          </button>
                        )}
                      </div>
                    )}
                  </header>

                  <p className="mt-3 text-white/90 whitespace-pre-line">
                    {post.content}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-2 rounded-full px-3 py-1 ring-1 ${
                        liked
                          ? "bg-rose-400 text-black ring-rose-300"
                          : "bg-white/10 text-white ring-white/20 hover:bg-white/15"
                      }`}
                      title={liked ? "Unlike" : "Like"}
                    >
                      <FaHeart /> <span>{likeCount}</span>
                    </button>
                    <span className="text-white/60">{comments.length} comments</span>
                  </div>

                  <ul className="mt-3 space-y-2 text-sm">
                    {comments.slice(0, 4).map(c => (
                      <li key={c.id} className="rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
                        <div className="text-white/80">{c.content}</div>
                        <div className="mt-1 text-[11px] text-white/40">
                          {new Date(c.created_at).toLocaleString()}
                        </div>
                      </li>
                    ))}
                    {comments.length > 4 && (
                      <li className="text-xs text-white/60">
                        …and {comments.length - 4} more
                      </li>
                    )}
                    {comments.length === 0 && (
                      <li className="text-white/50">Be the first to comment.</li>
                    )}
                  </ul>

                  <div className="mt-3 flex items-center gap-2">
                    <input
                      value={commentTextByPost[post.id] || ""}
                      onChange={(e) =>
                        setCommentTextByPost(prev => ({ ...prev, [post.id]: e.target.value }))
                      }
                      placeholder="Write a comment…"
                      className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/40 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/30"
                    />
                    <button
                      onClick={() => submitComment(post.id)}
                      disabled={submittingComment}
                      className="rounded-lg bg-white px-3 py-2 text-neutral-900 disabled:opacity-60"
                    >
                      Post
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>

          {visiblePosts.length === 0 && (
            <Card className="mx-auto mt-4 w-full max-w-3xl text-center text-white/60">
              No posts to show.
            </Card>
          )}
        </>
      )}
    </div>
  );
}
