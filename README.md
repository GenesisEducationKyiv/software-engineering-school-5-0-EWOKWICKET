# WeatherForecastAPI

WeatherForecastAPI is a backend service with microservice architecture built with NestJS that delivers current weather data on demand and lets users subscribe to weather updates via email.
It uses gRPC for inter-service communication and a custom-built API gateway to route requests.
MongoDB Atlas stores subscription data, Redis speeds up responses with caching, and RabbitMQ powers the email notification service.
The application is containerized with Docker and monitored via Loki for centralized logging.

---

## Technologies

- **[NestJS](https://nestjs.com/)** - Node.js framework
- **[MongoDB](https://www.mongodb.com/atlas)** - NoSQL database for storing data
- **[Redis](https://upstash.com/)** - NoSQL key-value database for caching data
- **[RabbitMQ](https://www.cloudamqp.com/)** - Message broker
- **[Loki](https://grafana.com/oss/loki/)** - Log aggregation system
- **[Docker](https://www.docker.com/)** - Containerization platform
- **[Jest](https://jestjs.io/)** – Testing framework
- **[Yarn](https://yarnpkg.com/)** – Package manager

---

## Project Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/EWOKWICKET/WeatherForecastAPI.git
   ```

2. **Install dependencies and generate grpc contracts**

   ```bash
   cd packages/api
   yarn install
   yarn generate:proto
   ```

3. **Set up environment variables**

   - In each microservice, create `.env` file in same folder as `.env.example`. Links are provided below.
   - Copy `.env.example` to `.env`
   - Fill `.env` file with environment variables. **Critical variables**:

     - Mail credentials:
       - **MAIL_USER** - your email
       - **MAIL_PASS** - [app password](https://support.google.com/accounts/answer/185833) for email
     - Provider api keys:
       - [**WEATHERAPI_API_KEY**](https://www.weatherapi.com/)
       - [**OPENWEATHER_API_KEY**](https://openweathermap.org/)

   - Env example files:
     - [`.env.example`](packages/api/apps/gateway/.env.example)
     - [`.env.example`](packages/api/apps/subscription/.env.example)
     - [`.env.example`](packages/api/apps/notifications/.env.example)
     - [`.env.example`](packages/api/apps/weather/.env.example)

4. **Start the server**

   Start services using docker

   ```bash
   yarn docker:up
   ```

   Development(if using cloud-hosted services)

   ```bash
   yarn start:dev
   ```

   Production(if using cloud-hosted services)

   ```bash
   yarn build
   yarn strart:prod
   ```

---

## 🧪 Running Tests

Instructions [here](testing.md)
