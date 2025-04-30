# Dockerfile for FE (Vite-based front-end)

# Stage 1: Build the front-end app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app files
COPY . .


# Build the production version of the Vite app
RUN npm run build

# Stage 2: Serve the app using NGINX
FROM nginx:alpine

# Copy the built files from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to serve the app
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
