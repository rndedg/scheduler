import React from "react";
import classNames from "classnames";
import "components/InterviewerListItem.scss";


export default function InterviewerListItem(props) {

  const interviewerClass = classNames("interviewers__item", {
    "interviewers__item--selected": props.selected
  })


  const isSelected = () => {

    if(props.selected) {
      return props.name;
    }
  }


  return (
    <li className={interviewerClass}
        onClick={() => props.setInterviewer(props.id)}
        selected={props.selected}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {isSelected()}
    </li>
  )
}