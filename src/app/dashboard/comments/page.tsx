"use client";

import { useEffect, useState } from "react";
import { fetchAllComments, deleteComment, approveComment } from "@/utils/api";
import Link from "next/link";

interface Comment {
  id: number;
  content: string;
  email: string;
  approved: boolean;
  createdAt: string;
  post: { id: number; title: string; slug: string };
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "approved" | "hidden">("all");

  useEffect(() => {
    fetchAllComments()
      .then((data) => setComments(data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este comentario?")) return;
    await deleteComment(id);
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleToggleApprove = async (id: number) => {
    const updated = await approveComment(id);
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, approved: updated.approved } : c))
    );
  };

  const filtered = comments.filter((c) => {
    if (filter === "approved") return c.approved;
    if (filter === "hidden") return !c.approved;
    return true;
  });

  const hiddenCount = comments.filter((c) => !c.approved).length;

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Moderación de comentarios</h1>
        <p className="page-subtitle">
          {comments.length} comentarios en total
          {hiddenCount > 0 && ` · ${hiddenCount} ocultos`}
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {(["all", "approved", "hidden"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn ${filter === f ? "btn-primary" : "btn-secondary"}`}
          >
            {f === "all" ? "Todos" : f === "approved" ? "Visibles" : "Ocultos"}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Cargando…</p>
      ) : filtered.length === 0 ? (
        <p>No hay comentarios en esta categoría.</p>
      ) : (
        <div className="comments-moderation-list">
          {filtered.map((comment) => (
            <div
              key={comment.id}
              className={`comment-moderation-item${comment.approved ? "" : " comment-hidden"}`}
            >
              <div className="comment-meta">
                <span className="comment-email">{comment.email}</span>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <Link
                  href={`/dashboard/posts/edit/${comment.post.id}`}
                  className="comment-post-link"
                  title={comment.post.title}
                >
                  📝 {comment.post.title.length > 40
                    ? comment.post.title.slice(0, 40) + "…"
                    : comment.post.title}
                </Link>
              </div>

              <p className="comment-body">{comment.content}</p>

              <div className="comment-actions">
                <button
                  onClick={() => handleToggleApprove(comment.id)}
                  className={`btn ${comment.approved ? "btn-secondary" : "btn-primary"}`}
                >
                  {comment.approved ? "Ocultar" : "Aprobar"}
                </button>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="btn btn-danger"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
