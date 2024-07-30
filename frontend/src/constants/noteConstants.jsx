const BASE_URL = "http://localhost:5000/api";

export const NOTE_ROUTES = {
  GET_ALL_NOTES: `${BASE_URL}/notes/`,
  GET_NOTE: (id) => `${BASE_URL}/notes/${id}`,
  CREATE_NOTE: (id) => `${BASE_URL}/create`,
  DELETE_NOTE: (id) => `${BASE_URL}/notes/${id}`,
  UPDATE_NOTE: (id) => `${BASE_URL}/notes/${id}`,
};
