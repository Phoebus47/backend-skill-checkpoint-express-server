# Quora Mock API

## Description

Quora Mock API is a backend server built with Express.js and PostgreSQL to simulate the functionality of a Q&A platform like Quora. Users can create, view, update, and delete questions, as well as provide answers, vote on questions and answers, and search for questions by category or title. The project also includes API documentation using Swagger.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Technologies Used](#technologies-used)
- [License](#license)

## Features

- Create, view, update, and delete questions.
- Search for questions by category or title.
- Add answers to questions.
- View and delete answers for a question.
- Vote on questions and answers (upvote or downvote).
- API documentation with Swagger.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/techupth/backend-skill-checkpoint-express-server.git
   cd backend-skill-checkpoint-express-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the PostgreSQL database:
   - Use the provided [SQL Script](https://gist.github.com/napatwongchr/811ef7071003602b94482b3d8c0f32e0) to create the database schema and seed data.
   - Update the connection string in `utils/db.mjs` to match your PostgreSQL configuration.

4. Start the server:
   ```bash
   npm start
   ```

## Usage

- The server runs on `http://localhost:4000` by default.
- Use Postman or any API client to test the endpoints.
- Access the Swagger API documentation at `http://localhost:4000/api-docs`.

## API Documentation

The API documentation is available at `http://localhost:4000/api-docs`. It provides detailed information about all available endpoints, request parameters, and response formats.

## Technologies Used

- **Node.js**: JavaScript runtime for building the server.
- **Express.js**: Web framework for creating RESTful APIs.
- **PostgreSQL**: Relational database for storing data.
- **Swagger**: API documentation tool.
- **Nodemon**: Development tool for automatically restarting the server.

## License

This project is licensed under the ISC License.
