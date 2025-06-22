const BASE = (() => {
  const host = 'localhost';
  const port = process.env.PORT || '3000';
  return `http://${host}:${port}/weatherapi.app/api`;
})();

export const Url = Object.freeze({
  SUBSCRIBE: `${BASE}/subscribe`,
  CONFIRM: `${BASE}/confirm`,
  UNSUBSCRIBE: `${BASE}/unsubscribe`,
  WEATHER_API: 'http://api.weatherapi.com/v1',
  OPENWEATHER_API: 'https://api.openweathermap.org/data/2.5',
});
