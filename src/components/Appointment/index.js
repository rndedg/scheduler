import React from "react";
import "components/Appointment/styles.scss";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";

  //Add save function

  function save(name, interviewer) {

    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.appointment.id, interview)
      .then(() => transition(SHOW))
  }

  //Add cancel function

  function cancelInterview() {

    transition(DELETING);
    props.cancelInterview(props.appointment.id)
    .then(() => transition(EMPTY))
  }


  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  return (
    <article className="appointment">
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}

      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
        />
      )}
      
      {mode === CREATE && <Form interviewers={props.interviewers} onAdd={() => transition(CREATE)} onCancel={() => back()} onSave={save} />}

      {mode === SAVING && <Status message="Saving"/>}

      {mode === DELETING && <Status message="Deleting"/>}

      {mode === CONFIRM && <Confirm onCancel={() => back()} onConfirm={cancelInterview}/>}
    </article>
  )
}