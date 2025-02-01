import React from 'react'
import {ILabel} from "../../../../../interfaces/Label";


const DisplayLabelsAdd = ({ labelList }: { labelList: ILabel[] }) => {
  return (
    <div className="create-article-label-list">
      {labelList.map((label, i) => {
        return (
          <div key={label._id} className="checkbox-container">
            <input type="checkbox" id={label._id} name={label.name} value={label._id} />
            <label htmlFor={label._id}>{label.name}</label>
          </div>
        )
      })}
    </div>
  )
}


export default DisplayLabelsAdd