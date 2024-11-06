# Step 1: Build React App
FROM node:alpine3.18 as build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:1.23-alpine

# Copy custom Nginx configuration (updated to support SSL)
COPY nginx.conf /etc/nginx/nginx.conf

# Copy SSL certificates (if you're using Let's Encrypt certificates)
# You can update the paths based on where you store your certs
COPY /etc/letsencrypt/live/smartwardrobe.store/fullchain.pem /etc/letsencrypt/live/smartwardrobe.store/fullchain.pem
COPY /etc/letsencrypt/live/smartwardrobe.store/privkey.pem /etc/letsencrypt/live/smartwardrobe.store/privkey.pem

# Copy the React build files to Nginx root directory
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/build .

# Expose HTTP and HTTPS ports
EXPOSE 80
EXPOSE 443

# Start Nginx in the foreground
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
