# SignWave - ISL model

This is a FastAPI project. This README provides instructions for setting up, running, and managing the FastAPI application.

## Prerequisites

- Python 3.11 or higher
- Docker (optional, if using Docker)
- Virtual Environment (optional, if not using Docker)

## Setup Instructions

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone <repository_url>
cd <repository_directory>
```
### 2. Create a Virtual Environment (Optional)
Create a virtual environment to isolate the project dependencies:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```
### 3. Install Dependencies
Install the project dependencies:
```bash
pip install -r requirements.txt
```

### 4. Running the FastAPI Application
Option A: Running Directly
Run the FastAPI application using uvicorn:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```
Option B: Running with Docker
Build the Docker Image
```bash
docker build -t isl-model-with-frontend .
```
Run the Docker Container
```bash
docker run -p 8000:8000 isl-model-with-frontend
```
Access the application at http://localhost:8000.
