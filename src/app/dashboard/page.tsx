"use client";
import { fetchPosts, fetchLabels, fetchProjects, fetchAllComments } from "@/utils/api";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalLabels: number;
  totalProjects: number;
  totalComments: number;
  hiddenComments: number;
}

const DashboardHome = () => {
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    totalLabels: 0,
    totalProjects: 0,
    totalComments: 0,
    hiddenComments: 0,
  });

  useEffect(() => {
    const load = async () => {
      const [posts, labels, projects, comments] = await Promise.allSettled([
        fetchPosts(),
        fetchLabels(),
        fetchProjects(),
        fetchAllComments(),
      ]);

      const postsData = posts.status === "fulfilled" ? posts.value ?? [] : [];
      const labelsData = labels.status === "fulfilled" ? labels.value ?? [] : [];
      const projectsData = projects.status === "fulfilled" ? projects.value ?? [] : [];
      const commentsData = comments.status === "fulfilled" ? comments.value ?? [] : [];

      setStats({
        totalPosts: postsData.length,
        publishedPosts: postsData.filter((p: any) => p.published).length,
        draftPosts: postsData.filter((p: any) => !p.published).length,
        totalViews: postsData.reduce((sum: number, p: any) => sum + (p.views ?? 0), 0),
        totalLabels: labelsData.length,
        totalProjects: projectsData.length,
        totalComments: commentsData.length,
        hiddenComments: commentsData.filter((c: any) => !c.approved).length,
      });
    };

    load();
  }, []);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-subtitle">Welcome to your content management dashboard</p>
      </div>

      {/* Stats row */}
      <div className="dashboard-cards" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
        <div className="dashboard-card">
          <div className="card-header"><span className="card-icon">📝</span><h3 className="card-title">Posts</h3></div>
          <div className="card-content">
            <div className="card-stats">
              <div>
                <div className="stat-number">{stats.totalPosts}</div>
                <div className="stat-label">Total</div>
              </div>
              <div>
                <div className="stat-number" style={{ color: "var(--color-success, #22c55e)" }}>{stats.publishedPosts}</div>
                <div className="stat-label">Publicados</div>
              </div>
              <div>
                <div className="stat-number" style={{ color: "var(--color-warning, #f59e0b)" }}>{stats.draftPosts}</div>
                <div className="stat-label">Borradores</div>
              </div>
            </div>
            <Link href="/dashboard/posts" className="btn btn-primary" style={{ marginTop: "0.75rem" }}>
              Gestionar Posts
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header"><span className="card-icon">👁️</span><h3 className="card-title">Visitas</h3></div>
          <div className="card-content">
            <div className="card-stats">
              <div>
                <div className="stat-number">{stats.totalViews.toLocaleString()}</div>
                <div className="stat-label">Vistas totales</div>
              </div>
            </div>
            <Link href="/dashboard/myAnalytics" className="btn btn-primary" style={{ marginTop: "0.75rem" }}>
              Ver Analytics
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header"><span className="card-icon">💬</span><h3 className="card-title">Comentarios</h3></div>
          <div className="card-content">
            <div className="card-stats">
              <div>
                <div className="stat-number">{stats.totalComments}</div>
                <div className="stat-label">Total</div>
              </div>
              {stats.hiddenComments > 0 && (
                <div>
                  <div className="stat-number" style={{ color: "var(--color-danger, #ef4444)" }}>{stats.hiddenComments}</div>
                  <div className="stat-label">Ocultos</div>
                </div>
              )}
            </div>
            <Link href="/dashboard/comments" className="btn btn-primary" style={{ marginTop: "0.75rem" }}>
              Moderar
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header"><span className="card-icon">🗂️</span><h3 className="card-title">Proyectos</h3></div>
          <div className="card-content">
            <div className="card-stats">
              <div>
                <div className="stat-number">{stats.totalProjects}</div>
                <div className="stat-label">Total</div>
              </div>
            </div>
            <Link href="/dashboard/projects" className="btn btn-primary" style={{ marginTop: "0.75rem" }}>
              Gestionar
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header"><span className="card-icon">🏷️</span><h3 className="card-title">Labels</h3></div>
          <div className="card-content">
            <div className="card-stats">
              <div>
                <div className="stat-number">{stats.totalLabels}</div>
                <div className="stat-label">Activas</div>
              </div>
            </div>
            <Link href="/dashboard/manageLabels" className="btn btn-primary" style={{ marginTop: "0.75rem" }}>
              Gestionar
            </Link>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="dashboard-card">
        <div className="card-header">
          <span className="card-icon">⚡</span>
          <h3 className="card-title">Acciones rápidas</h3>
        </div>
        <div className="card-content">
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
            <Link href="/dashboard/posts/new" className="btn btn-secondary">➕ Nuevo Post</Link>
            <Link href="/dashboard/posts" className="btn btn-secondary">📝 Ver Posts</Link>
            <Link href="/dashboard/comments" className="btn btn-secondary">💬 Moderar Comentarios</Link>
            <Link href="/dashboard/myAnalytics" className="btn btn-secondary">📊 Analytics</Link>
            <Link href="/dashboard/manageLabels" className="btn btn-secondary">🏷️ Labels</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
