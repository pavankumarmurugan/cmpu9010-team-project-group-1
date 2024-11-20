# Use the official Python base image.
FROM python:3.12-slim

# Setting up the working directory
WORKDIR /vector_search

# Copy the requirements file and install the dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY vector_search/ ./vector_search

# Setting environment variables
ENV FLASK_APP=vector_search.main:app

# Open port
EXPOSE 5000

# Define the commands that run when the container starts
CMD ["gunicorn", "-b", "0.0.0.0:5000", "vector_search.main:app"]
