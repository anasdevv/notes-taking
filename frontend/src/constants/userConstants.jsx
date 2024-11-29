const BASE_URL = "http://localhost:5000/api";

export const USER_ROUTES = {
  SIGN_UP: `${BASE_URL}/users/signup`,
  LOG_IN: `${BASE_URL}/users/login`,
  IMAGE_UPLOAD: "https://api.cloudinary.com/v1_1/dq196vyns/image/upload",
  UPDATE_PROFILE: `${BASE_URL}/users/profile`,
  // Add other routes here as needed
};
