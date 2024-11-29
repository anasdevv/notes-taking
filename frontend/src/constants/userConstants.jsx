const BASE_URL = import.meta.env.VITE_BASE_URL ?? 'http://localhost:5000/api';
console.log('BASE_URL');
export const USER_ROUTES = {
  SIGN_UP: `${BASE_URL}/users/signup`,
  LOG_IN: `${BASE_URL}/users/login`,
  IMAGE_UPLOAD: 'https://api.cloudinary.com/v1_1/dq196vyns/image/upload',
  UPDATE_PROFILE: `${BASE_URL}/users/profile`,
  // Add other routes here as needed
};
