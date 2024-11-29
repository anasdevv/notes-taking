# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install PM2 globally
RUN npm install -g pm2

# Copy the rest of the application code
COPY . .

# Run tests during the build process
# RUN npm test

# Expose the port your app runs on
EXPOSE 5000

# Use PM2 to run the application
CMD ["pm2-runtime", "start", "server.js"]
