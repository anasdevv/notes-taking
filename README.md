# Note-Taker App

## Overview

The Note-Taker App is a full-featured note-taking application built using the MERN stack (MongoDB, Express, React, Node.js).
The application allows users to sign up, log in, create, edit, delete, and view notes. Notes can be written in Markdown, allowing for rich text formatting.
The application also includes a user profile page where users can update their profile picture.

## Features

- User authentication (login and signup)
- Dashboard displaying all user notes
- Create, edit, and delete notes
- Markdown support for writing notes
- User profile management
- Logging with Pino
- Backend testing with Mocha/Chai
- Frontend testing with Jest
- Code quality analysis with SonarQube

## Technologies Used

- **Frontend**: React, React Router, Bootstrap
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Logging**: Pino
- **Testing**: Mocha, Chai (backend); Jest (frontend)
- **Code Quality**: SonarQube

## Setup and Installation

### Prerequisites

- Node.js (>= 14.x)
- MongoDB

### Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/yourusername/note-taker-app.git
   cd note-taker-app
   ```

2. **Backend Setup**

   ```sh
   cd backend
   npm install
   ```

3. **Frontend Setup**

   ```sh
   cd ../frontend
   npm install
   ```

4. **Environment Variables**
   Create a `.development.env` file in the `backend` directory with the following variables:

   ```sh
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/note-taker
   SECRET=your_jwt_secret
   ```

5. **Run the Application**
   - Start the backend server
     ```sh
     cd backend
     npm start
     ```
   - Start the frontend development server
     ```sh
     cd ../frontend
     npm run dev
     ```

## Testing

### Backend Testing

- Run Mocha/Chai tests
  ```sh
  cd backend
  npm test
  ```

### Frontend Testing

- Run Jest tests
  ```sh
  cd frontend
  npm test
  ```

## Project Structure

### Backend

- `server.js`: Entry point of the backend application
- `routes/`: Contains all the routes for the application
- `models/`: Contains the Mongoose models
- `controllers/`: Contains the controller logic for the routes
- `middlewares/`: Contains middleware functions

### Frontend

- `src/`: Contains all the React components and pages
- `src/components/`: Reusable React components
- `src/screens/`: Page components corresponding to different routes
- `src/context/`: Context API for state management
- `src/hooks/`: Custom hooks
- `src/constants/`: Constants used across the application
- `src/test/`: Jest tests for the frontend

## Logging

The application uses Pino for logging. Logs are written to files based on the day, and the log configuration can be found in `backend/logger.js`.

## Code Quality

The project uses SonarQube for static code analysis. Ensure that SonarQube is running and configured properly to analyze the codebase.

## Contribution

Contributions are welcome! Please create a pull request or open an issue for any feature requests, bug reports, or general improvements.

## License

This project is licensed under the MIT License.
