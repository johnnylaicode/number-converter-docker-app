# Base web server image
FROM nginx:latest

# Copy Contents of the Application
COPY index.html /usr/share/nginx/html
COPY scripts/ /usr/share/nginx/html/scripts/

# Port to use
EXPOSE 80
