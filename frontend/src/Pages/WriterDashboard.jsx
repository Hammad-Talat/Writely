import React, { useEffect, useMemo, useState  } from "react";
import { useSelector } from "react-redux";
import { FaChartLine, FaEdit, FaNewspaper } from "react-icons/fa";
import DashboardShell from "../components/DashboardShell";
import Card from "../components/ui/card";
import BlogForm from "../components/BlogForm";
import Feed from "../components/Feed";
import { listPosts, createPost, updatePost, deletePost } from "../services/posts";
import Select from "../components/ui/Select";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout as logoutAction } from "../store/authSlice";
import { logout as apiLogout } from "../services/auth";

export default function WriterDashboard() {
  const user = useSelector((s) => s.auth.user);
  const [activeTab, setActiveTab] = useState("feed");

  const [posts, setPosts] = useState([]);
  const [ordering, setOrdering] = useState("-created_at");
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedVersion, setFeedVersion] = useState(0);
    const dispatch = useDispatch();
  const navigate = useNavigate();

  const tabs = [
    { key: "overview", label: "Overview", icon: <FaChartLine /> },
    { key: "write", label: "Write Post", icon: <FaEdit /> },
    { key: "feed", label: "Feed", icon: <FaNewspaper /> },
    { key: "posts", label: "My Posts", icon: <FaNewspaper /> },
  ];
   const handleLogout = async () => {
   try {
     dispatch(logoutAction());   
     await apiLogout();          
   } finally {
     navigate("/login", { replace: true });
   }
 };

  async function refreshMine() {
        if (!user?.id) return;                         
  const p = await listPosts({ userId: user.id, ordering });
    setPosts(p);
  }
  
 useEffect(() => { refreshMine(); }, [ordering, user?.id]);
 if (!user) {
 return <div className="p-6 text-white/80">Loading account…</div>;
 }

  const totals = useMemo(() => {
    const total = posts.length;
    const published = posts.filter((p) => p.is_published).length;
    return { total, published, drafts: total - published };
  }, [posts]);

  async function handleCreateOrUpdate(body) {
    setSubmitting(true);
    try {
      if (editing) {
        await updatePost(editing.id, { ...body, tags: body.tags });
        setEditing(null);
      } else {
        await createPost({ ...body, author: user.id });
      }
      await refreshMine();
      setActiveTab("posts");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(postId) {
     if (!confirm("Delete this post?")) return;
 const prev = posts;
  setPosts((ps) => ps.filter((p) => p.id !== postId));
  try {
    await deletePost(postId);     
     setFeedVersion((v) => v + 1);           
  } catch (e) {
    setPosts(prev);
  }
  }

  return (
    <DashboardShell
      brand="Writely"
      user={user}
      tabs={tabs}
      activeTab={activeTab}
      onChangeTab={setActiveTab}
      onLogout={handleLogout}
    >
      {activeTab === "overview" && (
        <div className="space-y-8">
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold">Writer Dashboard</h1>
            <p className="text-sm text-white/70">Create, publish, and manage posts.</p>
          </header>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <div className="text-sm text-white/70">Total posts</div>
              <div className="mt-1 text-3xl font-semibold">{totals.total}</div>
            </Card>
            <Card>
              <div className="text-sm text-white/70">Published</div>
              <div className="mt-1 text-3xl font-semibold">{totals.published}</div>
            </Card>
            <Card>
              <div className="text-sm text-white/70">Drafts</div>
              <div className="mt-1 text-3xl font-semibold">{totals.drafts}</div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "write" && (
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <header className="mb-6 sm:mb-8 pt-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold">
              {editing ? "Edit post" : "Write a new post"}
            </h1>
            <p className="mt-1 text-sm sm:text-base text-white/70">
              Title, content, tags, and a publish toggle.
            </p>
          </header>

          <div className="rounded-2xl bg-white/5 p-4 sm:p-6 ring-1 ring-white/10 backdrop-blur">
            <BlogForm initial={editing} onSubmit={handleCreateOrUpdate} submitting={submitting} />
          </div>
        </div>
      )}

      {activeTab === "feed" && (
        <Feed
          currentUser={user}
          writerExtras
          onEditPost={(post) => {
            setEditing(post);
            setActiveTab("write");
          }}
          onDeletePost={handleDelete}
          showOnlyPublished
          refreshVersion={feedVersion}

        />
      )}

      {activeTab === "posts" && (
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <header className="mb-6 sm:mb-8 pt-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold">My posts</h1>
            <p className="mt-1 text-sm sm:text-base text-white/70">
              Your drafts and published writing.
            </p>

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
          </header>

          {posts.length === 0 ? (
            <Card className="mx-auto w-full max-w-3xl text-center text-white/70">
              No posts yet.
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {posts.map((p) => (
                <Card key={p.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-medium">{p.title}</div>
                      <div className="text-xs text-white/60">
                        Created {new Date(p.created_at).toLocaleString()}
                      </div>
                      {Array.isArray(p.tags) && p.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {p.tags.map((t, i) => (
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
                    <div className="shrink-0 flex gap-2">
                      <button
                        onClick={() => {
                          setEditing(p);
                          setActiveTab("write");
                        }}
                        className="rounded-lg bg-white/10 px-3 py-1 ring-1 ring-white/10 hover:bg-white/15"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="rounded-lg bg-red-500/90 px-3 py-1 text-white hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 text-xs">
                    <span
                      className={`rounded-full px-2 py-0.5 ring-1 ${
                        p.is_published
                          ? "bg-emerald-400/20 ring-emerald-400/40 text-emerald-300"
                          : "bg-yellow-400/20 ring-yellow-400/40 text-yellow-300"
                      }`}
                    >
                      {p.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardShell>
  );
}
