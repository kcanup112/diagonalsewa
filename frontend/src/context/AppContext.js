import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  appointments: [],
  services: [],
  costCalculation: null,
  timeline: null,
};

// Action types
export const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',
  SET_APPOINTMENTS: 'SET_APPOINTMENTS',
  ADD_APPOINTMENT: 'ADD_APPOINTMENT',
  UPDATE_APPOINTMENT: 'UPDATE_APPOINTMENT',
  SET_SERVICES: 'SET_SERVICES',
  SET_COST_CALCULATION: 'SET_COST_CALCULATION',
  SET_TIMELINE: 'SET_TIMELINE',
  CLEAR_CALCULATION_DATA: 'CLEAR_CALCULATION_DATA',
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
      };

    case actionTypes.LOGOUT:
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        appointments: [],
      };

    case actionTypes.SET_APPOINTMENTS:
      return {
        ...state,
        appointments: action.payload,
      };

    case actionTypes.ADD_APPOINTMENT:
      return {
        ...state,
        appointments: [...state.appointments, action.payload],
      };

    case actionTypes.UPDATE_APPOINTMENT:
      return {
        ...state,
        appointments: state.appointments.map(apt =>
          apt.id === action.payload.id ? action.payload : apt
        ),
      };

    case actionTypes.SET_SERVICES:
      return {
        ...state,
        services: action.payload,
      };

    case actionTypes.SET_COST_CALCULATION:
      return {
        ...state,
        costCalculation: action.payload,
      };

    case actionTypes.SET_TIMELINE:
      return {
        ...state,
        timeline: action.payload,
      };

    case actionTypes.CLEAR_CALCULATION_DATA:
      return {
        ...state,
        costCalculation: null,
        timeline: null,
      };

    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Check for stored auth data on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminData = localStorage.getItem('admin');
    
    if (token && adminData) {
      try {
        const admin = JSON.parse(adminData);
        dispatch({
          type: actionTypes.SET_USER,
          payload: admin,
        });
      } catch (error) {
        console.error('Error parsing stored admin data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
      }
    }
  }, []);

  // Actions
  const setLoading = (loading) => {
    dispatch({
      type: actionTypes.SET_LOADING,
      payload: loading,
    });
  };

  const setError = (error) => {
    dispatch({
      type: actionTypes.SET_ERROR,
      payload: error,
    });
  };

  const clearError = () => {
    dispatch({
      type: actionTypes.CLEAR_ERROR,
    });
  };

  const setUser = (user) => {
    dispatch({
      type: actionTypes.SET_USER,
      payload: user,
    });
  };

  const logout = () => {
    dispatch({
      type: actionTypes.LOGOUT,
    });
  };

  const setAppointments = (appointments) => {
    dispatch({
      type: actionTypes.SET_APPOINTMENTS,
      payload: appointments,
    });
  };

  const addAppointment = (appointment) => {
    dispatch({
      type: actionTypes.ADD_APPOINTMENT,
      payload: appointment,
    });
  };

  const updateAppointment = (appointment) => {
    dispatch({
      type: actionTypes.UPDATE_APPOINTMENT,
      payload: appointment,
    });
  };

  const setServices = (services) => {
    dispatch({
      type: actionTypes.SET_SERVICES,
      payload: services,
    });
  };

  const setCostCalculation = (calculation) => {
    dispatch({
      type: actionTypes.SET_COST_CALCULATION,
      payload: calculation,
    });
  };

  const setTimeline = (timeline) => {
    dispatch({
      type: actionTypes.SET_TIMELINE,
      payload: timeline,
    });
  };

  const clearCalculationData = () => {
    dispatch({
      type: actionTypes.CLEAR_CALCULATION_DATA,
    });
  };

  // Context value
  const value = {
    ...state,
    // Actions
    setLoading,
    setError,
    clearError,
    setUser,
    logout,
    setAppointments,
    addAppointment,
    updateAppointment,
    setServices,
    setCostCalculation,
    setTimeline,
    clearCalculationData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
