import React from 'react'
import { ChangeEvent } from 'react';
import {ILabel} from "../../../../../interfaces/Label";


const DisplayLabelsAdd = ({ labelList, selectedLabels, setSelectedLabels }: { labelList: ILabel[], selectedLabels: string[], setSelectedLabels: (labels: string[]) => void }) => {
  const handleTagCheckboxChange  = (event: ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    if(event.target.checked){
      setSelectedLabels([...selectedLabels, value]);
    } else {
      setSelectedLabels(selectedLabels.filter((label) => label !== value));
    }
    
  }

  return (
    <div className="create-article-label-list">
      {labelList.map((label, i) => {
        return (
          <div key={label._id} className="checkbox-container">
            <input type="checkbox" id={label.name} name={label.name} value={label._id} onChange={handleTagCheckboxChange}/>
            <label htmlFor={label.name}>{label.name}</label>
          </div>
        )
      })}
    </div>
  )
}


export default DisplayLabelsAdd