# Step 1: Build React app
FROM node:alpine3.18 as build
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy all source files
COPY . .

# Build the React app
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:1.23-alpine

# Copy custom Nginx configuration (updated for SSL and redirect)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the React build files from the build stage to Nginx's root directory
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/build .

# Expose port 80 and 443 for HTTP and HTTPS traffic
EXPOSE 80 443

# Start Nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]
