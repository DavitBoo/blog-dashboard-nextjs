"use client";

import { useEffect, useState } from "react";
import { fetchPosts } from "@/utils/api";
import Link from "next/link";

interface PostStat {
  id: number;
  title: string;
  slug: string;
  views: number;
  published: boolean;
  createdAt: string;
}

export default function AnalyticsPage() {
  const [posts, setPosts] = useState<PostStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts()
      .then((data) => {
        const sorted = (data ?? [])
          .map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug ?? "",
            views: p.views ?? 0,
            published: p.published,
            createdAt: p.createdAt,
          }))
          .sort((a: PostStat, b: PostStat) => b.views - a.views);
        setPosts(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  const topPosts = posts.slice(0, 15);
  const maxViews = topPosts[0]?.views ?? 1;
  const totalViews = posts.reduce((s, p) => s + p.views, 0);
  const publishedCount = posts.filter((p) => p.published).length;

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Rendimiento de tu contenido</p>
      </div>

      {/* Summary cards */}
      <div className="dashboard-cards" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", marginBottom: "2rem" }}>
        <div className="dashboard-card">
          <div className="card-header"><span className="card-icon">👁️</span><h3 className="card-title">Vistas totales</h3></div>
          <div className="card-content">
            <div className="stat-number">{totalViews.toLocaleString()}</div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="card-header"><span className="card-icon">📝</span><h3 className="card-title">Posts publicados</h3></div>
          <div className="card-content">
            <div className="stat-number">{publishedCount} / {posts.length}</div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="card-header"><span className="card-icon">🏆</span><h3 className="card-title">Más visto</h3></div>
          <div className="card-content">
            {topPosts[0] ? (
              <>
                <div className="stat-number">{topPosts[0].views.toLocaleString()} vistas</div>
                <div className="stat-label" style={{ marginTop: "0.25rem", fontSize: "0.8rem" }}>{topPosts[0].title}</div>
              </>
            ) : (
              <div className="stat-label">—</div>
            )}
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="dashboard-card">
        <div className="card-header">
          <span className="card-icon">📊</span>
          <h3 className="card-title">Top posts por visitas</h3>
        </div>
        <div className="card-content">
          {loading ? (
            <p>Cargando…</p>
          ) : topPosts.length === 0 ? (
            <p>No hay datos todavía.</p>
          ) : (
            <div className="analytics-chart">
              {topPosts.map((post) => (
                <div key={post.id} className="chart-row">
                  <div className="chart-label" title={post.title}>
                    <Link href={`/dashboard/posts/edit/${post.id}`} className="chart-title-link">
                      {post.title.length > 42 ? post.title.slice(0, 42) + "…" : post.title}
                    </Link>
                    {!post.published && (
                      <span className="draft-badge">borrador</span>
                    )}
                  </div>
                  <div className="chart-bar-wrap">
                    <div
                      className="chart-bar"
                      style={{ width: `${Math.max((post.views / maxViews) * 100, 2)}%` }}
                    />
                    <span className="chart-views">{post.views.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
