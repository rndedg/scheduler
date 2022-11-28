import { useReducer, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: [],
  });

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return {
          ...state,
          day: action.day,
        };
      case SET_APPLICATION_DATA:
        return {
          ...state,
          days: action.days,
          appointments: action.appointments,
          interviewers: action.interviewers,
        };

      case SET_INTERVIEW:
        const appointment = {
          ...state.appointments[action.id],
          interview: action.interview ? { ...action.interview } : null,
        };
        const appointments = {
          ...state.appointments,
          [action.id]: appointment,
        };

        const days = spotsRemaining(state.day, state.days, appointments);

        return {
          ...state,
          appointments,
          days,
        };

      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const setDay = (day) => dispatch({ type: SET_DAY, day });

  function spotsRemaining(day, days, appointments) {
    const foundDay = days.find((element) => element.name === day);
    let spots = 0;

    for (const appointmentID of foundDay.appointments) {
      const appointmentsObj = appointments[appointmentID];

      if (!appointmentsObj.interview) {
        spots += 1;
      }
    }
    let newDayObj = { ...foundDay, spots };
    let newDaysArray = days.map((element) =>
      element.name === day ? newDayObj : element
    );

    return newDaysArray;
  }

  const bookInterview = (id, interview) => {
    return axios.put(`/api/appointments/${id}`, { interview }).then(() =>
      dispatch({
        type: SET_INTERVIEW,
        id,
        interview,
      })
    );
  };

  const cancelInterview = (id, interview) => {
    return axios.delete(`/api/appointments/${id}`, { interview }).then(() => {
      dispatch({
        type: SET_INTERVIEW,
        id,
        interview: null,
      });
    });
  };

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      });
    });
  }, []);

  return { state, setDay, bookInterview, cancelInterview };
}
