# Step 1: Use an official Node.js image for building the app
FROM node:18 AS build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json for dependency installation
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the app's source code
COPY . .

# Step 6: Build the app for production
RUN npm run build

# Step 7: Use a lightweight web server (Nginx) for serving the built files
FROM nginx:alpine AS serve

# Step 8: Copy the build output to Nginx's default static directory
COPY --from=build /app/dist /usr/share/nginx/html

# Step 9: Expose the port Nginx will serve on
EXPOSE 80

# Step 10: Start Nginx
CMD ["nginx", "-g", "daemon off;"]
