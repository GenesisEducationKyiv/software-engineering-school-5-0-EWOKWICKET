# WeatherForecastAPI

A backend API built with NestJS for managing weather-related data, connected to a MongoDB database, and structured with Docker for containerized environments.

---

## Technologies

- **[NestJS](https://nestjs.com/)** - Node.js framework
- **[MongoDB Atlas](https://www.mongodb.com/atlas)** - cloud-hosted NoSQL database
- **[Docker](https://www.docker.com/)** - Containerization platform
- **[Jest](https://jestjs.io/)** – testing framework
- **[Yarn](https://yarnpkg.com/)** – Package manager

---

## Project Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/EWOKWICKET/WeatherForecastAPI.git
   ```

2. **Install dependencies**

   ```bash
   cd packages/api
   yarn install
   ```

3. **Set up environment variables**

   - Copy `.env.example` to `.env`
   - Fill in your actual credentials in the `.env` file:
     - Mail credentials:\
        &nbsp;&nbsp;&nbsp; **MAIL_USER** - email\
        &nbsp;&nbsp;&nbsp; **MAIL_PASS** - app password for email
     - **WEATHER_API_KEY** from https://openweathermap.org/api

4. **Start the server in development mode**

   ```bash
   yarn start:dev
   ```

   or see Docker Commands section below

---

## 🧪 Running Tests

- **Run unit tests**

  ```bash
  yarn test:unit
  ```

- **Run end-to-end tests**
  ```bash
  yarn test:e2e
  ```

---

## Docker Commands

- **Start the application with Docker**

  ```bash
  yarn docker:up
  ```

- **Stop and remove containers**

  ```bash
  yarn docker:down
  ```

- **Stop containers without removing**

  ```bash
  yarn docker:stop
  ```

- **Start existing containers**

  ```bash
  yarn docker:start
  ```

Make sure Docker is installed and running on your system before using these commands.

---

## .env Configuration

The `.env` file contains all sensitive credentials and configuration. An example is provided in `.env.example`:

```env
PORT=3000
HOST=localhost
DB_URI=mongodb+srv://devUser:nvjkEgP0HBtzBe48@weatherapi-cluster.g0ogrf4.mongodb.net/weatherAPI?retryWrites=true&w=majority&appName=weatherapi-cluster
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_email_app_password
WEATHER_API_KEY=your_openweathermap_api_key
```

## Subscription page

Visit page http://HOST:PORT/weatherapi.app/ to subscribe
