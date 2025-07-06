# WeatherForecastAPI

A backend API built with NestJS for managing weather-related data, connected to a MongoDB database, and structured with Docker for containerized environments.

---

## Technologies

- **[NestJS](https://nestjs.com/)** - Node.js framework
- **[MongoDB Atlas](https://www.mongodb.com/atlas)** - cloud-hosted NoSQL database
- **[Redis(Upstash)](https://upstash.com/)** - cloud-hosted NoSQL key-value database
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

   - Copy [`.env.example`](packages/api/.env.example) to `.env`
   - Fill in your actual credentials in the `.env` file:
     - Mail credentials:\
       - **MAIL_USER** - your email\
       - **MAIL_PASS** - [app password](https://support.google.com/accounts/answer/185833) for email
     - [**WEATHER_API_API_KEY**](https://www.weatherapi.com/)
     - [**OPENWEATHER_API_KEY**](https://openweathermap.org/)

4. **Start the server**

   Start services using docker

   ```bash
   yarn docker:up
   ```

   Dev mode

   ```bash
   yarn start:dev
   ```

   Production

   ```bash
   yarn build
   yarn strart:prod
   ```

---

## 🧪 Running Tests

Instructions [here](testing.md)
