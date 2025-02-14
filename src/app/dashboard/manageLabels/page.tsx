"use client";

import BackButton from "@/app/components/BackButton";
import InfoText from "@/app/components/InfoText";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { ILabel } from "../../../interfaces/Label";
import { deleteLabel, fetchLabels } from "@/utils/api";
import { FaEdit, FaTimes } from "react-icons/fa";



const page = () => {
  const router = useRouter();

  const [showInfoText, setShowInfoText] = useState<boolean>(false);
  const [infoTextMessage, setInfoTextMessage] = useState<string | null>(null);
  const [labelList, setLabelList] = useState<ILabel[]>();

  const [updateLabelId, setUpdateLabelId] = useState<string | null>(null);
  const [updateLabelName, setUpdateLabelName] = useState<string>('');

  useEffect(() => {
    const fetchLabelList = async () => {
      const data = await fetchLabels();
      setLabelList(data);
    };

    fetchLabelList();
  }, []);

  const successfulSubmit = () => {
    setInfoTextMessage('Tags updated');
    setShowInfoText(true);
    setTimeout(() => {
      router.push("/dashboard/manageLabels"); // Equivalente a navigate()
    }, 3000);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleTagUpdate = (id: string, name: string) => {
    setUpdateLabelId(id);
    setUpdateLabelName(name)
  }

  
  const handleTagDelete = async (id: string ) => {
    if (window.confirm('Are you sure you want to delete this label?')) {
      try {
        const res = await deleteLabel(id);

        if (res.ok) {
          successfulSubmit();
        }
      } catch (error) {
        
      }

    }
  }

  return (
    <main className="manage-labels-page">
      <BackButton />
      <div className="manage-labels-container">
        {showInfoText ? (
          <InfoText message={infoTextMessage} />
        ) : (
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
          </form>
          
        )}
       
      </div>
      
    </main>
  );
};

export default page;
