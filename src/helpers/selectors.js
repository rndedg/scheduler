export function getAppointmentsForDay(state, day) {
  let results = [];

  let filteredDays = state.days.find(selectedDay => selectedDay.name === day);

  if (!filteredDays) {
    return [];
  }

  for (const appointmentID of filteredDays.appointments) {
    if (state.appointments[appointmentID]) {
      results.push(state.appointments[appointmentID]);
    }
  }

  return results;
}

export function getInterview(state, interview) {
  const results = {};

  if (interview) {
    results["student"] = interview.student;
    results["interviewer"] = state.interviewers[interview.interviewer];
  } else {
    return null;
  }
  
  return results;
}

export function getInterviewersForDay(state, day) {
  let results = [];

  let filteredDays = state.days.find(selectedDay => selectedDay.name === day);

  if (!filteredDays) {
    return [];
  }

  for (const appointmentID of filteredDays.appointments) {
    if (state.appointments[appointmentID]) {
      results.push(state.appointments[appointmentID]);
    }
  }
  
  return results;
}