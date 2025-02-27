"use client";

import BackButton from "@/app/components/BackButton";
import InfoText from "@/app/components/InfoText";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { ILabel } from "../../../interfaces/Label";
import { createLabel, deleteLabel, fetchLabels, updateLabel } from "@/utils/api";
import { FaEdit, FaTimes, FaCheck, FaTimesCircle } from "react-icons/fa";

const page = () => {
  const router = useRouter();

  const [showInfoText, setShowInfoText] = useState<boolean>(false);
  const [infoTextMessage, setInfoTextMessage] = useState<string | null>(null);
  const [labelList, setLabelList] = useState<ILabel[]>();
  const [newLabel, setNewLabel] = useState<string>("");

  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
  const [editingLabelName, setEditingLabelName] = useState<string>("");

  const fetchLabelList = async () => {
    const data = await fetchLabels();
    setLabelList(data);
  };

  useEffect(() => {
    fetchLabelList();
  }, []);

  const successfulSubmit = () => {
    setInfoTextMessage("Tags updated");
    setShowInfoText(true);
    setTimeout(() => {
      router.push("/dashboard/manageLabels");
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    try {
      const newLabelData = await createLabel({ name: newLabel });
      setNewLabel("");
      setLabelList((prev) => [...(prev ?? []), newLabelData]);
      successfulSubmit();
    } catch (error) {
      console.error("Error creating label:", error);
      setInfoTextMessage("Error creating label");
      setShowInfoText(true);
    }
  };

  const handleEditClick = (id: string, name: string) => {
    setEditingLabelId(id);
    setEditingLabelName(name);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingLabelName(e.target.value);
  };

  const handleEditSave = async () => {
    if (!editingLabelId || !editingLabelName.trim()) return;

    try {
      await updateLabel(editingLabelId, { name: editingLabelName });
      setLabelList((prev) => prev?.map(label => label.id === editingLabelId ? { ...label, name: editingLabelName } : label));
      setEditingLabelId(null);
    } catch (error) {
      console.error("Error updating label:", error);
      setInfoTextMessage("Error updating label");
      setShowInfoText(true);
    }
  };

  const handleEditCancel = () => {
    setEditingLabelId(null);
  };

  const handleTagDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this label?")) {
      try {
        const res = await deleteLabel(id);
        if (res.ok) {
          successfulSubmit();
          fetchLabelList();
        }
      } catch (error) {
        console.error("Error deleting label:", error);
      }
    }
  };

  return (
    <main className="manage-labels-page">
      <BackButton />
      <div className="manage-labels-container">
        {showInfoText && <InfoText message={infoTextMessage} />}
        <form onSubmit={handleSubmit}>
          <h1 className="manage-labels-heading">Etiquetas</h1>
          <div className="create-article-label-list">
            <ul>
              {labelList &&
                labelList.map((label) => (
                  <li key={label.id} className="registered-tasks-list-item">
                    {editingLabelId === label.id ? (
                      <input
                        type="text"
                        value={editingLabelName}
                        onChange={handleEditChange}
                        autoFocus
                      />
                    ) : (
                      <span>{label.name}</span>
                    )}
                    <div className="label-options-divider">
                      <div className="options-container">
                        {editingLabelId === label.id ? (
                          <>
                            <FaCheck className="label-save-button" onClick={handleEditSave} />
                            <FaTimesCircle className="label-cancel-button" onClick={handleEditCancel} />
                          </>
                        ) : (
                          <FaEdit className="label-edit-button" onClick={() => handleEditClick(label.id, label.name)} />
                        )}
                        <FaTimes className="label-delete-button" onClick={() => handleTagDelete(label.id)} />
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
          <div className="manage-labels-title-container">
            <h2>Nueva etiqueta:</h2>
            <input
              type="text"
              id="newLabel"
              name="newLabel"
              className="newLabel_input"
              placeholder="algunas etiquetas"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
            />
          </div>
          <button type="submit" className="submitLabelBtn">Etiqueta lista</button>
        </form>
      </div>
    </main>
  );
};

export default page;
