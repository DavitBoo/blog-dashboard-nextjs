"use client";

import { useState, useEffect } from "react";
import { fetchProjects } from "../../../utils/api";
import ProjectList from "../../components/ProjectList";
import Link from "next/link";

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (e) {
        console.error(e);
      }
    };
    loadProjects();
  }, []);

  return (
    <>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">Manage Projects</h1>
            <p className="page-subtitle">Create, edit, and manage your projects</p>
          </div>
          <Link href="/dashboard/projects/new" className="btn btn-primary">
            ➕ Create New Project
          </Link>
        </div>
      </div>
      
      <div className="dashboard-card">
        <ProjectList projects={projects} />
      </div>
    </>
  );
};

export default ProjectManagement;
