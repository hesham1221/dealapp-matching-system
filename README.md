# DealApp Matching System

## Overview

The DealApp Matching System connects property requests with relevant ads based on specific criteria. The system includes three types of users: clients, agents, and admins. Clients can create property requests specifying their needs, agents can create ads for properties available for rent or sale, and admins have full control over the system.

## Features

- **Property Requests**: Clients can create property requests specifying their needs.
- **Ads**: Agents can create ads for properties available for rent or sale.
- **Matching**: The system matches property requests with relevant ads based on criteria such as district, price, and area.
- **Admin Statistics**: Admins can retrieve statistics about the number of ads and requests created by users.

## Technologies

- Node.js
- MongoDB (Mongoose)
- Docker
- Express.js
- JWT for Authentication
- Swagger for API Documentation
- Mocha for Testing

## App Structure

```
.
├── backup
│   └── ads.json
│   └── propertyrequests.json
│   └── users.json
├── controllers
│   ├── adController.js
│   ├── authController.js
│   ├── propertyRequestController.js
│   ├── userController.js
├── cron
│   └── refreshPropertyRequests.js
├── middleware
│   ├── authMiddleware.js
│   ├── errorHandler.js
├── models
│   ├── Ad.js
│   ├── PropertyRequest.js
│   ├── User.js
├── routes
│   ├── adRoutes.js
│   ├── authRoutes.js
│   ├── propertyRequestRoutes.js
│   ├── userRoutes.js
├── utils
│   ├── jsonHelpers.js
│   ├── queryHelpers.js
│   └── pagination.js
├── tests
│   ├── auth.test.js
│   ├── ad.test.js
│   ├── propertyRequest.test.js
│   ├── user.test.js
│   └── setup.js
├── .env
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── README.md
└── swagger.js
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Docker (optional)
- Docker Compose (optional)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/hesham1221/dealapp-matching-system.git
cd dealapp-matching-system
```

2. Create a `.env` file in the root directory with the following content:

```bash
MONGO_URI=mongodb://mongo:27017/matching_system
NODE_ENV=development
PORT=5000
```

### Running the Application with Docker

1. Start the application using Docker Compose:

```bash
docker-compose up --build
```

This command will build the Docker images and start the application along with MongoDB.

### Running the Application without Docker

1. Start MongoDB on your local machine. Ensure it is running on the default port (`27017`).

2. Install dependencies:

```bash
npm install
```

3. Start the application:

```bash
npm start
```

This command will start the application. Ensure the MongoDB connection string in the `.env` file is set to `mongodb://mongo:27017/matching_system`.

### Accessing the Application

- **API Documentation**: The Swagger documentation is available at `http://localhost:5000/api-docs`.
- **Postman Collection**: The Postman collection is provided in the `postman_collection.json` file.

## Postman Collection

The Postman collection is available in the `postman_collection.json` file. You can import this file into Postman to test the API endpoints.

## MongoDB Backup

A backup of the MongoDB database is available in the `backup` folder. To restore the database, use the following command:

```bash
docker cp backup/ads.json mongodb:/backup/ads.json
docker cp backup/propertyrequests.json mongodb:/backup/propertyrequests.json
docker cp backup/users.json mongodb:/backup/users.json

docker exec -it mongodb mongoimport --db matching_system --collection ads --file /backup/ads.json --jsonArray
docker exec -it mongodb mongoimport --db matching_system --collection propertyrequests --file /backup/propertyrequests.json --jsonArray
docker exec -it mongodb mongoimport --db matching_system --collection users --file /backup/users.json --jsonArray
```

If you're not using Docker, you can restore the backup using the following command:

```bash
mongoimport --uri="mongodb://localhost:27017/matching_system" --collection=ads --file=backup/ads.json --jsonArray
mongoimport --uri="mongodb://localhost:27017/matching_system" --collection=propertyrequests --file=backup/propertyrequests.json --jsonArray
mongoimport --uri="mongodb://localhost:27017/matching_system" --collection=users --file=backup/users.json --jsonArray
```

## Running Tests

To run the tests, use the following command:

```bash
npm test
```

## Cron Job

A cron job is set up to refresh property requests every 3 days. This is implemented using the `node-cron` package and can be found in the `cron/refreshPropertyRequests.js` file.
