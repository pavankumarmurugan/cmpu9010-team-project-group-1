# Use the official Python base image.
FROM python:3.12-slim

# Setting up the working directory
WORKDIR /app

# Copy the requirements file and install the dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY image_search/ ./image_search

# Setting environment variables
ENV FLASK_APP=image_search:app

# Open port
EXPOSE 9090

# Define the commands that run when the container starts
CMD ["flask", "--app", "image_search.app", "run", "--host=0.0.0.0", "--port=9090"]

