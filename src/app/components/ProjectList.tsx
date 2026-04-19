"use client";

import React, { useState } from "react";

import ConfirmProjectDelete from "./ConfirmProjectDelete";
import { FaTrashAlt, FaEdit, FaEye } from 'react-icons/fa';
import Link from "next/link";


type Project = {
  id: number;
  title: string;
  published: boolean;
};

type ProjectListProps = {
  projects: Project[];
  onTogglePublish?: (id: number, isPublished: boolean) => void;
};

const ProjectList: React.FC<ProjectListProps> = ({ projects, onTogglePublish }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const handleDelete = (projectId: number) => {
    setSelectedProjectId(projectId);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setSelectedProjectId(null);
  };

  return (
    <>
      {showDeleteModal && selectedProjectId && (
        <ConfirmProjectDelete isOpen={showDeleteModal} onClose={handleCloseModal} projectId={selectedProjectId} />
      )}
      
      <div className="posts-grid">
        {projects.map((project) => (
          <div key={project.id} className="post-card">
             <div className="post-card-header">
              <h3 className="post-title">{project.title}</h3>
              <span className={`post-status ${project.published ? 'published' : 'draft'}`}>
                {project.published ? "Published" : "Draft"}
              </span>
            </div>
            
            <div className="post-card-actions">
              <Link href={`./projects/edit/${project.id}`} className="btn btn-sm btn-secondary">
                <FaEdit /> Edit
              </Link>
              
              <button 
                className="btn btn-sm btn-danger" 
                onClick={() => handleDelete(project.id)}
              >
                <FaTrashAlt /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {projects.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">📝</span>
          <h3>No projects yet</h3>
          <p>Create your first project to get started</p>
          <Link href="/dashboard/projects/new" className="btn btn-primary">
            Create Your First Project
          </Link>
        </div>
      )}
    </>
  );
};

export default ProjectList;
