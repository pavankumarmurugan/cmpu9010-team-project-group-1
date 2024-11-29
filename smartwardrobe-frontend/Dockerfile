# Step 1: Build React App
FROM node:alpine3.18 as build
WORKDIR /app

# Install dependencies and build
COPY package.json .
RUN npm install
COPY . .
RUN npm run build  # Generates the /app/build directory

# Step 2: Serve with Nginx
FROM nginx:1.23-alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files, including favicon.ico, to the Nginx root directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 and start Nginx
EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
