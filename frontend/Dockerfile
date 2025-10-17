# Step 1: Build the app
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your project files
COPY . .

# Build the app for production
RUN npm run build

# Step 2: Serve the app using a lightweight web server (nginx)
FROM nginx:stable-alpine

# Copy build output to nginx's default public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
