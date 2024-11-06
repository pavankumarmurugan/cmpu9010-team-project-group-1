# Step 1: Build React App
FROM node:alpine3.18 as build
WORKDIR /app

# Install dependencies and build React app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:1.23-alpine

# Set up a working directory
WORKDIR /usr/share/nginx/html

# Copy Nginx configuration to enable SSL
# You can adjust the configuration in nginx.conf to use SSL
COPY nginx.conf /etc/nginx/nginx.conf

# Define environment variable for certificate path
ARG CERT_PATH

# Copy the SSL certificates (if provided by GitHub Actions or from a secure location)
# These certificates will be copied from a temporary path during the build
COPY $CERT_PATH/fullchain.pem /etc/letsencrypt/live/smartwardrobe.store/fullchain.pem
COPY $CERT_PATH/privkey.pem /etc/letsencrypt/live/smartwardrobe.store/privkey.pem

# Remove any default content in Nginx root directory
RUN rm -rf *

# Copy the React build files from the build stage to the Nginx HTML directory
COPY --from=build /app/build .

# Expose HTTP (80) and HTTPS (443) ports
EXPOSE 80
EXPOSE 443

# Start Nginx with SSL support in the foreground
ENTRYPOINT ["nginx", "-g", "daemon off;"]
