const BASE_URL = import.meta.env.VITE_BASE_URL ?? 'http://localhost:5000/api';

export const NOTE_ROUTES = {
  GET_ALL_NOTES: `${BASE_URL}/notes/`,
  GET_NOTE: (id) => `${BASE_URL}/notes/${id}`,
  CREATE_NOTE: `${BASE_URL}/notes/create`,
  DELETE_NOTE: (id) => `${BASE_URL}/notes/${id}`,
  UPDATE_NOTE: (id) => `${BASE_URL}/notes/${id}`,
};
