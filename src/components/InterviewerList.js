import React from "react";
import InterviewerListItem from "./InterviewerListItem";
import "components/InterviewerList.scss"
//Import PropTypes for some basic verification
import PropTypes from 'prop-types';


export default function InterviewerList (props) {



  const interviewers = props.interviewers.map(value => {
    return (
      <InterviewerListItem
        key={value.id}
        name={value.name}
        avatar={value.avatar}
        selected={value.id === props.value}        
        onChange={() => props.onChange(value.id)}
    />)
  });



  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewers}
      </ul>
    </section>
  )
};


//Add PropType test to verify interviewers is, in fact, an array.
InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
};