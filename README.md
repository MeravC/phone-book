# Phone Book Application

This is a simple phone book application that allows users to manage their contacts.

## Features

- Add new contacts
- View existing contacts
- Edit contact details
- Delete contacts
- Metrics and monitoring using Grafana and Prometheus

## Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or above)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

---

## Project Structure

```plaintext
phone-book/
├── src/
|   ├── config/
│   │   └── database.js            # MongoDB connection
│   ├── controllers/
│   │   └── contactController.js   # Business logic for managing contacts
|   ├── metrics/
│   │   └── prometheus.js          # Register metrics
│   ├── middlewares/
│   |   ├── metricsMiddleware.js   # Record request duration metrics       
│   │   └── validate.js            # Validate contact 
│   ├── models/
│   │   └── contact.js             # MongoDB schema
│   ├── routes/
│   │   └── contactRoutes.js       # API endpoints
│   └── server.js                  # Entry point for starting the server
├── tests/
│   └── contact.test.js            # Testing
├── .gitignore
├── Dockerfile                     # Docker configuration
├── docker-compose.yml             # Docker Compose configuration
├── nodemon.json                   # nodemon configuration
├── prometheus.yml                 # Prometheus configuration
├── package-lock.json              # Project metadata and dependencies
├── package.json                   # Project metadata and dependencies
├── README.md                      # Documentation

variables
```

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/MeravC/phone-book.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd phone-book
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

## Running the Application

### Without Docker

1. **Start the development server:**

   ```bash
   npm start
   ```

2. **Access the application:**

   Open your browser and navigate to `http://localhost:3000`.

---

### With Docker

1. **Build and start the Docker containers:**

   ```bash
   docker-compose up --build
   ```

2. **Access the application:**

   Open your browser and navigate to `http://localhost:3000`.

3. **Access Prometheus:**

   Navigate to `http://localhost:9090` to view Prometheus metrics.

4. **Access Grafana:**

   Navigate to `http://localhost:3001` to view monitoring dashboards.

   - Default username: `admin`
   - Default password: `admin`

---

## Metrics and Monitoring

### Prometheus Integration

The application exposes metrics in a format compatible with Prometheus.

- **Metrics Endpoint:** `/metrics`
- Example metrics:
  - `http_requests_total`: Tracks the total number of HTTP requests.
  - `http_request_duration_seconds`: Measures the duration of HTTP requests.

### Grafana Dashboards

Grafana is pre-configured with a dashboard for visualizing application performance metrics.

1. After logging in to Grafana, import the provided dashboard JSON file (e.g., `grafana-dashboard.json` in the repository).

2. View key metrics such as:
   - Total requests
   - Error rates
   - Response times

---

## API Documentation

The application provides a RESTful API for managing contacts. Below are the available endpoints:

### Get All Contacts

- **URL:** `/api/contacts`
- **Method:** GET
- **Description:** Retrieves a list of all contacts.
- **Response:**
  ```json
  [
    {
      "id": 1,
      "name": "John Doe",
      "phone": "+1234567890",
      "email": "john.doe@example.com"
    },
    ...
  ]
  ```

### Get a Single Contact

- **URL:** `/api/contacts/:id`
- **Method:** GET
- **Description:** Retrieves details of a specific contact by ID.
- **Response:**
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john.doe@example.com"
  }
  ```

### Add a New Contact

- **URL:** `/api/contacts`
- **Method:** POST
- **Description:** Adds a new contact.
- **Request Body:**
  ```json
  {
    "name": "Jane Smith",
    "phone": "+0987654321",
    "email": "jane.smith@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "id": 2,
    "name": "Jane Smith",
    "phone": "+0987654321",
    "email": "jane.smith@example.com"
  }
  ```

### Update a Contact

- **URL:** `/api/contacts/:id`
- **Method:** PUT
- **Description:** Updates the details of an existing contact.
- **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "phone": "+0987654321",
    "email": "jane.doe@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "id": 2,
    "name": "Jane Doe",
    "phone": "+0987654321",
    "email": "jane.doe@example.com"
  }
  ```

### Delete a Contact

- **URL:** `/api/contacts/:id`
- **Method:** DELETE
- **Description:** Deletes a contact by ID.
- **Response:**
  ```json
  {
    "message": "Contact deleted successfully."
  }
  ```
---

## Docker Compose Setup

The `docker-compose.yml` file includes services for:
- **Application:** The Phone Book app container.
- **MongoDB:** The Phone Book database container.
- **Prometheus:** Configured to scrape the application's `/metrics` endpoint.
- **Grafana:** Configured with Prometheus as a data source.

---

## Future Improvements

1. **Authentication and Authorization:**
   - Implement user authentication to secure API endpoints.
   - Add role-based access control for advanced features.

2. **Database Enhancements:**
   - Add support for backups and data recovery.
   - Add redis cache.

3. **Error Handling:**
   - Standardize API error responses with detailed error codes and messages.
   - Add a global error handler for unexpected server errors.

4. **Advanced Monitoring:**
   - Include more granular metrics, such as per-endpoint response times.
   - Add alerts in Grafana for critical performance thresholds.

5. **Deployment:**
   - Automate CI/CD pipelines using GitHub Actions.
   - Add Kubernetes support for scalable deployments.

6. **User Experience:**
   - Create a modern, responsive frontend using React or Angular.
   - Improve UI/UX with a user-friendly interface.

7. **Testing:**
   - Achieve 100% test coverage with additional unit and integration tests.
   - Include performance tests for high traffic scenarios.