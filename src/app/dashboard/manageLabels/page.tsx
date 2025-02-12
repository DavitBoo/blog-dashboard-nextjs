"use client";

import BackButton from "@/app/components/BackButton";
import InfoText from "@/app/components/InfoText";
import React, { useEffect, useState } from "react";


import {ILabel} from "../../../interfaces/Label";
import { fetchLabels } from "@/utils/api";

const page = () => {
  const [showInfoText, setShowInfoText] = useState<boolean>(false);
  const [infoTextMessage, setInfoTextMessage] = useState<string | null>(null);
  const [labelList, setLabelList] = useState<ILabel[]>();

  useEffect(() => {
    const fetchLabelList = async () => {
        const data = await fetchLabels();
        setLabelList(data)
    }

    fetchLabelList();
  }, [])
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

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
              {labelList && labelList.map((label) => {
                return (
                    <li key={label.id} className="registered-tasks-list-item">
                        <span>{label.name}</span><div className="label-options-divider"></div>
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
