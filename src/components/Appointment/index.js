import React from "react";
import "components/Appointment/styles.scss";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import Header from "./Header";
import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  //Add save function

  function save(name, interviewer) {

    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);

    props
      .bookInterview(props.appointment.id, interview)
      .then(() => transition(SHOW))
      .catch(err => transition(ERROR_SAVE, true));
  }

  //Add cancel function

  function cancelInterview(event) {

    transition(DELETING, true);
    props.cancelInterview(props.appointment.id)
    .then(() => transition(EMPTY))
    .catch(err => transition(ERROR_DELETE, true));
  }


  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  return (
    <article className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}

      {mode === SHOW && (
        <Show
          name={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      
      {mode === CREATE && <Form interviewers={props.interviewers} onAdd={() => transition(CREATE)} onCancel={() => back()} onSave={save} />}

      {mode === SAVING && <Status message="Saving"/>}

      {mode === DELETING && <Status message="Deleting"/>}

      {mode === CONFIRM && <Confirm onCancel={() => back()} onConfirm={cancelInterview}/>}

      {mode === EDIT && <Form name={props.interview.student} interviewer={props.interview.interviewer.id} interviewers={props.interviewers} onCancel={back} onSave={save} />}

      {mode === ERROR_DELETE && <Error onClose={back}/>}

      {mode === ERROR_SAVE && <Error onClose={back}/>}
    </article>
  )
}