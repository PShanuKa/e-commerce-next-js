# Use Node.js 20-alpine as the base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for prisma)
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose the port the app runs on (defaulting to 3001 as per server.js)
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
