"use client";
import { fetchPosts, fetchLabels } from "@/utils/api";
import Link from "next/link";
import { useEffect, useState } from "react";

const DashboardHome = () => {

  const [postNumber, setPostNumber] = useState(0);
  const [labelNumber, setLabelNumber] = useState(0)

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts();
        console.log(data);
        setPostNumber(data.length);
      } catch (error) {
        console.error("Error fetching posts:", error);

      }
    };

    const getLabels =  async () => {
      try {
        const data = await fetchLabels();
        setLabelNumber(data.length)
      } catch (error) {
        console.error("Error fetching labels:", error);
      }
    }

    getPosts();
    getLabels();
  }, []);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-subtitle">Welcome to your content management dashboard</p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="card-header">
            <span className="card-icon">📝</span>
            <h3 className="card-title">Posts</h3>
          </div>
          <div className="card-content">
            <p>Manage your blog posts, create new content, and edit existing articles.</p>
            <div className="card-stats">
              <div>
                <div className="stat-number">{postNumber}</div>
                <div className="stat-label">Total Posts</div>
              </div>
              <Link href="/dashboard/posts" className="btn btn-primary">
                Manage Posts
              </Link>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <span className="card-icon">➕</span>
            <h3 className="card-title">Create Content</h3>
          </div>
          <div className="card-content">
            <p>Start writing a new blog post or article for your website.</p>
            <div className="card-stats">
              <div>
                
              </div>
              <Link href="/dashboard/posts/new" className="btn btn-primary">
                Create New Post
              </Link>
            </div>
          </div>
        </div>

        {/* <div className="dashboard-card">
          <div className="card-header">
            <span className="card-icon">💬</span>
            <h3 className="card-title">Comments</h3>
          </div>
          <div className="card-content">
            <p>Review and moderate comments from your readers and visitors.</p>
            <div className="card-stats">
              <div>
                <div className="stat-number">47</div>
                <div className="stat-label">Pending Review</div>
              </div>
              <Link href="/dashboard/comments" className="btn btn-primary">
                Manage Comments
              </Link>
            </div>
          </div>
        </div> */}

        <div className="dashboard-card">
          <div className="card-header">
            <span className="card-icon">🏷️</span>
            <h3 className="card-title">Labels</h3>
          </div>
          <div className="card-content">
            <p>Organize your content with tags and categories for better navigation.</p>
            <div className="card-stats">
              <div>
                <div className="stat-number">{labelNumber}</div>
                <div className="stat-label">Active Labels</div>
              </div>
              <Link href="/dashboard/manageLabels" className="btn btn-primary">
                Manage Labels
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="card-header">
          <span className="card-icon">📊</span>
          <h3 className="card-title">Quick Actions</h3>
        </div>
        <div className="card-content">
          <p>Common tasks and shortcuts to help you manage your content efficiently.</p>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
            <Link href="/dashboard/posts/new" className="btn btn-secondary">
              ➕ New Post
            </Link>
            <Link href="/dashboard/posts" className="btn btn-secondary">
              📝 View All Posts
            </Link>
            <Link href="/dashboard/comments" className="btn btn-secondary">
              💬 Review Comments
            </Link>
            <Link href="/dashboard/manageLabels" className="btn btn-secondary">
              🏷️ Organize Labels
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
