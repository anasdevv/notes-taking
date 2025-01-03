require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const noteRoutes = require('./routes/noteRoutes');
const userRoutes = require('./routes/userRoutes');
const logger = require('./logger');

const app = express();

const REQUIRED_ENV_VARS = ['PORT', 'SECRET', 'MONGO_URI'];
function validateEnvVariables() {
  const missingVars = REQUIRED_ENV_VARS.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.error(
      `Error: Missing required environment variables: ${missingVars.join(', ')}`
    );
    process.exit(1); // exit the app if validation fails
  }
}

validateEnvVariables();

// Middleware
const corsOptions = {
  origin: '*',
  credentials: true, // access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.get('/', (req, res) => {
  res.status(200).send({ message: 'API is running' });
});

app.use('/api/notes', noteRoutes);
app.use('/api/users', userRoutes);

// Connect to DB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      logger.info(`connected to db and listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });

module.exports = app;
