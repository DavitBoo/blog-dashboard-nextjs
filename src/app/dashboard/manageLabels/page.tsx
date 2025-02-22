"use client";

import BackButton from "@/app/components/BackButton";
import InfoText from "@/app/components/InfoText";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { ILabel } from "../../../interfaces/Label";
import { createLabel, deleteLabel, fetchLabels } from "@/utils/api";
import { FaEdit, FaTimes } from "react-icons/fa";
import UpdateTagModal from "./UpdateTagModal/UpdateLabelModal";

const page = () => {
  const router = useRouter();

  const [showInfoText, setShowInfoText] = useState<boolean>(false);
  const [infoTextMessage, setInfoTextMessage] = useState<string | null>(null);
  const [labelList, setLabelList] = useState<ILabel[]>();
  const [newLabel, setNewLabel] = useState<string>("");

  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

  const [updateLabelId, setUpdateLabelId] = useState<string | null>(null);
  const [updateLabelName, setUpdateLabelName] = useState<string>("");

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
      router.push("/dashboard/manageLabels"); // Equivalente a navigate()
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return; // Evitar envíos vacíos

    try {
      const newLabelData = await createLabel({ name: newLabel });

      setNewLabel(""); // Limpiar el input
      setLabelList((prev) => [...(prev ?? []), newLabelData]); // Agregar la nueva etiqueta al estado
      successfulSubmit();
    } catch (error) {
      console.error("Error creating label:", error);
      setInfoTextMessage("Error creating label");
      setShowInfoText(true);
    }
  };

  const handleTagUpdate = (id: string, name: string) => {
    setUpdateLabelId(id);
    setUpdateLabelName(name);
    setShowUpdateModal(true);
  };

  const handleTagDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this label?")) {
      try {
        const res = await deleteLabel(id);

        if (res.ok) {
          successfulSubmit();
          fetchLabelList();
        }
      } catch (error) {}
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
                labelList.map((label) => {
                  return (
                    <li key={label.id} className="registered-tasks-list-item">
                      <span>{label.name}</span>
                      <div className="label-options-divider">
                        <div className="options-container">
                          <div className="label-edit-button" onClick={() => handleTagUpdate(label.id, label.name)}>
                            <FaEdit aria-label="Edit tag" />
                          </div>
                          <div className="label-delete-button" onClick={() => handleTagDelete(label.id)}>
                            <FaTimes aria-label="Delete tag" />
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
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
          <button type="submit" className="submitLabelBtn">
            Etiqueta lista
          </button>
        </form>
        {showUpdateModal && 
          <UpdateTagModal
          showUpdateModal={showUpdateModal}/>
        }
      </div>
    </main>
  );
};

export default page;
