import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });


  function spotsRemaining(day, days, appointments) {

    const foundDay = days.find(element => element.name === day);
    let spots = 0;

      for (const appointmentID of foundDay.appointments) {
        const appointmentsObj = appointments[appointmentID];

        if (!appointmentsObj.interview) {
          spots += 1;
        }
      }
      let newDayObj = {...foundDay, spots};
      let newDaysArray = days.map(element => element.name === day ? newDayObj : element);

      return newDaysArray;
  }


  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = spotsRemaining(state.day, state.days, appointments);

    return axios.put(`/api/appointments/${id}`, appointment)
    .then(() => setState({
      ...state,
      appointments,
      days
    }))
  };

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = spotsRemaining(state.day, state.days, appointments);

    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
          setState({
          ...state,
          appointments,
          days
        })
      })
  };

  const setDay = day => setState({ ...state, day });

  useEffect(() => {

    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }))
    })
  }, [])



  return { state, setDay, bookInterview, cancelInterview };
}