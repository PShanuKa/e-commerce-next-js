# Step 1: Build the application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Set build-time environment variables for Vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the application (using the build script from package.json)
RUN echo "Building with VITE_API_URL: $VITE_API_URL"
RUN npm run build2

# Step 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copy the built files from the build stage to Nginx's public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration if needed (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
