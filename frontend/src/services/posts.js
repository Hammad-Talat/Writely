import api from "./api";

export async function listPosts({ search = "", ordering = "-created_at", userId = null } = {}) {
  const params = {};
  if (search) params.search = search;
  if (ordering) params.ordering = ordering;
  if (userId) params.user = userId; 
  const { data } = await api.get("/api/posts/content/", { params });
  return data;
}

export async function createPost({ title, content, author, is_published, tags }) {
  const payload = { title, content, author, is_published, tags };
  const { data } = await api.post("/api/posts/content/", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

export async function updatePost(id, patch) {
  const { data } = await api.patch(`/api/posts/content/${id}/`, patch, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

export async function deletePost(id) {
  await api.delete(`/api/posts/content/${id}/`);
  return true;
}

export async function listComments() {
  const { data } = await api.get("/api/posts/comments/");
  return data;
}

export async function createComment({ user, blog_post, content }) {
  const { data } = await api.post(
    "/api/posts/comments/",
    { user, blog_post, content },
    { headers: { "Content-Type": "application/json" } }
  );
  return data;
}

export async function listLikesByUser(user) {
  const { data } = await api.get("/api/posts/likes/", { params: { user } });
  return data; 
}

export async function listAllLikes() {
  const { data } = await api.get("/api/posts/likes/");
  return data; 
}

export async function likePost({ user, blog_post }) {
  const { data } = await api.post(
    "/api/posts/likes/",
    { user, blog_post },
    { headers: { "Content-Type": "application/json" } }
  );
  return data;
}

export async function unlikePost(likeId) {
  await api.delete(`/api/posts/likes/${likeId}/`);
  return true;
}
